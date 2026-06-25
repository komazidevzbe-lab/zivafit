using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class CartService(
    DataContext context,
    ICheckoutSettingsService checkoutSettingsService
) : ICartService
{
    public async Task<CartDto> GetCartAsync(int userId)
    {
        var cartItems = await GetCartItemsQuery(userId).ToListAsync();

        return await MapCartToDtoAsync(cartItems);
    }

    public async Task<CartDto> AddItemAsync(int userId, AddCartItemDto dto)
    {
        if (dto.Quantity <= 0)
            throw new ArgumentException("Quantity must be greater than zero.");

        var product = await context.Products
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == dto.ProductId && p.IsActive);

        if (product == null)
            throw new KeyNotFoundException("Product not found.");

        var variant = product.Variants
            .FirstOrDefault(v =>
                v.Id == dto.ProductVariantId &&
                v.ProductId == dto.ProductId &&
                v.IsActive);

        if (variant == null)
            throw new KeyNotFoundException("Product variant not found.");

        var existingItem = await context.CartItems
            .FirstOrDefaultAsync(c =>
                c.AppUserId == userId &&
                c.ProductVariantId == dto.ProductVariantId);

        var requestedQuantity = dto.Quantity + (existingItem?.Quantity ?? 0);

        if (requestedQuantity > variant.StockQuantity)
            throw new ArgumentException("The selected quantity is more than the available stock.");

        if (existingItem == null)
        {
            context.CartItems.Add(new CartItem
            {
                AppUserId = userId,
                ProductId = dto.ProductId,
                ProductVariantId = dto.ProductVariantId,
                Quantity = dto.Quantity,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }
        else
        {
            existingItem.Quantity += dto.Quantity;
            existingItem.UpdatedAt = DateTime.UtcNow;
        }

        await context.SaveChangesAsync();

        return await GetCartAsync(userId);
    }

    public async Task<CartDto?> UpdateItemAsync(int userId, int cartItemId, UpdateCartItemDto dto)
    {
        if (dto.Quantity <= 0)
            throw new ArgumentException("Quantity must be greater than zero.");

        var cartItem = await context.CartItems
            .Include(c => c.ProductVariant)
            .FirstOrDefaultAsync(c => c.Id == cartItemId && c.AppUserId == userId);

        if (cartItem == null)
            return null;

        if (dto.Quantity > cartItem.ProductVariant.StockQuantity)
            throw new ArgumentException("The selected quantity is more than the available stock.");

        cartItem.Quantity = dto.Quantity;
        cartItem.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        return await GetCartAsync(userId);
    }

    public async Task<bool> RemoveItemAsync(int userId, int cartItemId)
    {
        var cartItem = await context.CartItems
            .FirstOrDefaultAsync(c => c.Id == cartItemId && c.AppUserId == userId);

        if (cartItem == null)
            return false;

        context.CartItems.Remove(cartItem);
        await context.SaveChangesAsync();

        return true;
    }

    public async Task ClearCartAsync(int userId)
    {
        var cartItems = await context.CartItems
            .Where(c => c.AppUserId == userId)
            .ToListAsync();

        context.CartItems.RemoveRange(cartItems);

        await context.SaveChangesAsync();
    }

    private IQueryable<CartItem> GetCartItemsQuery(int userId)
    {
        return context.CartItems
            .Include(c => c.Product)
                .ThenInclude(p => p.Category)
            .Include(c => c.Product)
                .ThenInclude(p => p.Images)
            .Include(c => c.ProductVariant)
            .Where(c => c.AppUserId == userId)
            .OrderBy(c => c.CreatedAt);
    }

    private async Task<CartDto> MapCartToDtoAsync(List<CartItem> cartItems)
    {
        var items = cartItems.Select(MapCartItemToDto).ToList();
        var subtotal = items.Sum(i => i.LineTotal);
        var totals = await checkoutSettingsService.CalculateTotalsAsync(subtotal);

        return new CartDto
        {
            Items = items,
            TotalItems = items.Sum(i => i.Quantity),

            SubtotalAmount = totals.SubtotalAmount,
            SubtotalText = totals.SubtotalText,

            DeliveryMethod = totals.DeliveryMethodName,
            DeliveryMessage = totals.DeliveryMessage,
            DeliveryRuleText = totals.DeliveryRuleText,

            DeliveryFee = totals.DeliveryFee,
            DeliveryFeeText = totals.DeliveryFeeText,

            FreeDeliveryThreshold = totals.FreeDeliveryThreshold,
            FreeDeliveryThresholdText = totals.FreeDeliveryThresholdText,

            AmountUntilFreeDelivery = totals.AmountUntilFreeDelivery,
            AmountUntilFreeDeliveryText = totals.AmountUntilFreeDeliveryText,

            IsFreeDelivery = totals.IsFreeDelivery,

            TotalAmount = totals.TotalAmount,
            TotalText = totals.TotalText
        };
    }

    private static CartItemDto MapCartItemToDto(CartItem cartItem)
    {
        var mainImage = cartItem.Product.Images
            .OrderByDescending(i => i.IsMain)
            .ThenBy(i => i.DisplayOrder)
            .FirstOrDefault();

        var lineTotal = cartItem.Product.Price * cartItem.Quantity;

        return new CartItemDto
        {
            Id = cartItem.Id,
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
            UnitPriceText = FormatPrice(cartItem.Product.Price),
            Quantity = cartItem.Quantity,
            LineTotal = lineTotal,
            LineTotalText = FormatPrice(lineTotal),
            AvailableStock = cartItem.ProductVariant.StockQuantity
        };
    }

    private static string FormatPrice(decimal price)
    {
        return $"R{price:0.00}";
    }
}