using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class OrderService(
    DataContext context,
    ICheckoutSettingsService checkoutSettingsService
) : IOrderService
{
    private static readonly string[] AllowedOrderStatuses =
    [
        "PendingPayment",
        "Processing",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Failed"
    ];

    // ===============================
    // Create order from cart
    // Creates a pending-payment order using database cart items.
    // Delivery and total values come from backend database checkout settings.
    // ===============================
    public async Task<OrderDto> CreateOrderFromCartAsync(int userId, CreateOrderDto dto)
    {
        ValidateCheckoutDto(dto);

        var cartItems = await context.CartItems
            .Include(c => c.Product)
                .ThenInclude(p => p.Category)
            .Include(c => c.Product)
                .ThenInclude(p => p.Images)
            .Include(c => c.ProductVariant)
            .Where(c => c.AppUserId == userId)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync();

        if (cartItems.Count == 0)
            throw new ArgumentException("Your cart is empty.");

        foreach (var cartItem in cartItems)
        {
            if (!cartItem.Product.IsActive)
                throw new ArgumentException($"The product '{cartItem.Product.Name}' is no longer available.");

            if (!cartItem.ProductVariant.IsActive)
                throw new ArgumentException($"The selected size for '{cartItem.Product.Name}' is no longer available.");

            if (cartItem.Quantity > cartItem.ProductVariant.StockQuantity)
                throw new ArgumentException($"Only {cartItem.ProductVariant.StockQuantity} item(s) are available for '{cartItem.Product.Name}' in size {cartItem.ProductVariant.Size}.");
        }

        var subtotal = cartItems.Sum(c => c.Product.Price * c.Quantity);
        var checkoutTotals = await checkoutSettingsService.CalculateTotalsAsync(subtotal);

        var order = new Order
        {
            AppUserId = userId,
            OrderNumber = string.Empty,
            OrderStatus = "PendingPayment",
            PaymentStatus = "PendingPayment",

            FirstName = dto.FirstName.Trim(),
            LastName = dto.LastName.Trim(),
            Email = dto.Email.Trim().ToLowerInvariant(),
            PhoneNumber = dto.PhoneNumber.Trim(),

            AddressLine1 = dto.AddressLine1.Trim(),
            AddressLine2 = dto.AddressLine2?.Trim() ?? string.Empty,
            Suburb = dto.Suburb.Trim(),
            City = dto.City.Trim(),
            Province = dto.Province.Trim(),
            PostalCode = dto.PostalCode.Trim(),

            DeliveryMethod = checkoutTotals.DeliveryMethodName,
            CustomerNote = dto.CustomerNote?.Trim() ?? string.Empty,

            SubtotalAmount = checkoutTotals.SubtotalAmount,
            DeliveryFee = checkoutTotals.DeliveryFee,
            TotalAmount = checkoutTotals.TotalAmount,

            StockReservedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,

            Items = cartItems.Select(MapCartItemToOrderItem).ToList()
        };

        foreach (var cartItem in cartItems)
        {
            cartItem.ProductVariant.StockQuantity -= cartItem.Quantity;
        }

        context.Orders.Add(order);
        context.CartItems.RemoveRange(cartItems);

        await context.SaveChangesAsync();

        order.OrderNumber = GenerateOrderNumber(order.Id);

        await context.SaveChangesAsync();

        return await GetUserOrderByIdAsync(userId, order.Id)
            ?? throw new Exception("Order was created but could not be loaded.");
    }

    // ===============================
    // Get user orders
    // Returns orders for the logged-in customer.
    // ===============================
    public async Task<IReadOnlyList<OrderDto>> GetUserOrdersAsync(int userId)
    {
        var orders = await GetOrdersQuery()
            .Where(o => o.AppUserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapOrderToDto).ToList();
    }

    // ===============================
    // Get user order by ID
    // Returns one order only if it belongs to the logged-in customer.
    // ===============================
    public async Task<OrderDto?> GetUserOrderByIdAsync(int userId, int orderId)
    {
        var order = await GetOrdersQuery()
            .FirstOrDefaultAsync(o => o.Id == orderId && o.AppUserId == userId);

        return order == null ? null : MapOrderToDto(order);
    }

    // ===============================
    // Get admin orders
    // Admin can view all orders and filter by status/search.
    // ===============================
    public async Task<IReadOnlyList<OrderDto>> GetAdminOrdersAsync(OrderParamsDto orderParams)
    {
        var query = GetOrdersQuery();

        if (!string.IsNullOrWhiteSpace(orderParams.OrderStatus))
        {
            var orderStatus = orderParams.OrderStatus.Trim();
            query = query.Where(o => o.OrderStatus == orderStatus);
        }

        if (!string.IsNullOrWhiteSpace(orderParams.PaymentStatus))
        {
            var paymentStatus = orderParams.PaymentStatus.Trim();
            query = query.Where(o => o.PaymentStatus == paymentStatus);
        }

        if (!string.IsNullOrWhiteSpace(orderParams.Search))
        {
            var search = orderParams.Search.Trim().ToLower();

            query = query.Where(o =>
                o.OrderNumber.ToLower().Contains(search) ||
                o.FirstName.ToLower().Contains(search) ||
                o.LastName.ToLower().Contains(search) ||
                o.Email.ToLower().Contains(search) ||
                o.PhoneNumber.ToLower().Contains(search));
        }

        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapOrderToDto).ToList();
    }

    // ===============================
    // Get admin order by ID
    // Admin can view one full order.
    // ===============================
    public async Task<OrderDto?> GetAdminOrderByIdAsync(int orderId)
    {
        var order = await GetOrdersQuery()
            .FirstOrDefaultAsync(o => o.Id == orderId);

        return order == null ? null : MapOrderToDto(order);
    }

    // ===============================
    // Update order status
    // Admin updates fulfilment status after payment/order processing.
    // ===============================
    public async Task<OrderDto?> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusDto dto)
    {
        var cleanStatus = dto.OrderStatus?.Trim() ?? string.Empty;

        if (!AllowedOrderStatuses.Contains(cleanStatus))
            throw new ArgumentException("Invalid order status.");

        var order = await GetOrdersQuery()
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
            return null;

        var previousStatus = order.OrderStatus;

        order.OrderStatus = cleanStatus;
        order.UpdatedAt = DateTime.UtcNow;

        if (cleanStatus == "Cancelled" && previousStatus != "Cancelled")
        {
            if (order.PaymentStatus == "PendingPayment")
                order.PaymentStatus = "Cancelled";

            order.CancelledAt = DateTime.UtcNow;

            await RestoreReservedStockAsync(order);
        }

        await context.SaveChangesAsync();

        return MapOrderToDto(order);
    }

    private IQueryable<Order> GetOrdersQuery()
    {
        return context.Orders
            .Include(o => o.Items)
            .Include(o => o.Payments);
    }

    private static OrderItem MapCartItemToOrderItem(CartItem cartItem)
    {
        var mainImage = cartItem.Product.Images
            .OrderByDescending(i => i.IsMain)
            .ThenBy(i => i.DisplayOrder)
            .FirstOrDefault();

        var lineTotal = cartItem.Product.Price * cartItem.Quantity;

        return new OrderItem
        {
            ProductId = cartItem.ProductId,
            ProductVariantId = cartItem.ProductVariantId,
            ProductName = cartItem.Product.Name,
            Category = cartItem.Product.Category.Name,
            Size = cartItem.ProductVariant.Size,
            Colour = cartItem.ProductVariant.Colour,
            Sku = cartItem.ProductVariant.Sku,
            ImageUrl = mainImage?.ImageUrl ?? "assets/product-placeholder.png",
            ImageAlt = mainImage?.ImageAlt ?? cartItem.Product.Name,
            UnitPrice = cartItem.Product.Price,
            Quantity = cartItem.Quantity,
            LineTotal = lineTotal
        };
    }

    private async Task RestoreReservedStockAsync(Order order)
    {
        if (order.StockRestoredAt.HasValue)
            return;

        var variantIds = order.Items.Select(i => i.ProductVariantId).ToList();

        var variants = await context.ProductVariants
            .Where(v => variantIds.Contains(v.Id))
            .ToListAsync();

        foreach (var item in order.Items)
        {
            var variant = variants.FirstOrDefault(v => v.Id == item.ProductVariantId);

            if (variant != null)
                variant.StockQuantity += item.Quantity;
        }

        order.StockRestoredAt = DateTime.UtcNow;
    }

    private static OrderDto MapOrderToDto(Order order)
    {
        var orderItems = order.Items
            .OrderBy(i => i.Id)
            .Select(MapOrderItemToDto)
            .ToList();

        var payments = order.Payments
            .OrderByDescending(p => p.CreatedAt)
            .Select(MapPaymentToDto)
            .ToList();

        return new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            OrderStatus = order.OrderStatus,
            PaymentStatus = order.PaymentStatus,

            FirstName = order.FirstName,
            LastName = order.LastName,
            FullName = $"{order.FirstName} {order.LastName}".Trim(),

            Email = order.Email,
            PhoneNumber = order.PhoneNumber,

            AddressLine1 = order.AddressLine1,
            AddressLine2 = order.AddressLine2,
            Suburb = order.Suburb,
            City = order.City,
            Province = order.Province,
            PostalCode = order.PostalCode,

            DeliveryMethod = order.DeliveryMethod,
            CustomerNote = order.CustomerNote,

            SubtotalAmount = order.SubtotalAmount,
            SubtotalText = FormatPrice(order.SubtotalAmount),

            DeliveryFee = order.DeliveryFee,
            DeliveryFeeText = order.DeliveryFee <= 0 ? "Free" : FormatPrice(order.DeliveryFee),

            TotalAmount = order.TotalAmount,
            TotalText = FormatPrice(order.TotalAmount),

            TotalItems = orderItems.Sum(i => i.Quantity),

            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            PaidAt = order.PaidAt,
            CancelledAt = order.CancelledAt,
            FailedAt = order.FailedAt,

            Items = orderItems,
            Payments = payments
        };
    }

    private static OrderItemDto MapOrderItemToDto(OrderItem orderItem)
    {
        return new OrderItemDto
        {
            Id = orderItem.Id,
            ProductId = orderItem.ProductId,
            ProductVariantId = orderItem.ProductVariantId,
            ProductName = orderItem.ProductName,
            Category = orderItem.Category,
            Size = orderItem.Size,
            Colour = orderItem.Colour,
            Sku = orderItem.Sku,
            ImageUrl = orderItem.ImageUrl,
            ImageAlt = orderItem.ImageAlt,
            UnitPrice = orderItem.UnitPrice,
            UnitPriceText = FormatPrice(orderItem.UnitPrice),
            Quantity = orderItem.Quantity,
            LineTotal = orderItem.LineTotal,
            LineTotalText = FormatPrice(orderItem.LineTotal)
        };
    }

    private static OrderPaymentDto MapPaymentToDto(OrderPayment payment)
    {
        return new OrderPaymentDto
        {
            Id = payment.Id,
            Provider = payment.Provider,
            Status = payment.Status,
            Amount = payment.Amount,
            AmountText = FormatPrice(payment.Amount),
            MerchantReference = payment.MerchantReference,
            GatewayPaymentId = payment.GatewayPaymentId,
            CreatedAt = payment.CreatedAt,
            PaidAt = payment.PaidAt,
            FailedAt = payment.FailedAt,
            CancelledAt = payment.CancelledAt
        };
    }

    private static void ValidateCheckoutDto(CreateOrderDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.FirstName))
            throw new ArgumentException("First name is required.");

        if (string.IsNullOrWhiteSpace(dto.LastName))
            throw new ArgumentException("Last name is required.");

        if (string.IsNullOrWhiteSpace(dto.Email))
            throw new ArgumentException("Email is required.");

        if (string.IsNullOrWhiteSpace(dto.PhoneNumber))
            throw new ArgumentException("Phone number is required.");

        if (string.IsNullOrWhiteSpace(dto.AddressLine1))
            throw new ArgumentException("Address line 1 is required.");

        if (string.IsNullOrWhiteSpace(dto.Suburb))
            throw new ArgumentException("Suburb is required.");

        if (string.IsNullOrWhiteSpace(dto.City))
            throw new ArgumentException("City is required.");

        if (string.IsNullOrWhiteSpace(dto.Province))
            throw new ArgumentException("Province is required.");

        if (string.IsNullOrWhiteSpace(dto.PostalCode))
            throw new ArgumentException("Postal code is required.");
    }

    private static string GenerateOrderNumber(int orderId)
    {
        return $"ZIVA-{DateTime.UtcNow:yyyyMMdd}-{orderId:000000}";
    }

    private static string FormatPrice(decimal price)
    {
        return $"R{price:0.00}";
    }
}