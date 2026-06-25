using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Services;

public class PayFastPaymentService(
    DataContext context,
    IOptions<PayFastSettings> payFastOptions,
    ILogger<PayFastPaymentService> logger
) : IPaymentService
{
    private readonly PayFastSettings _payFastSettings = payFastOptions.Value;

    private static readonly string[] CheckoutSignatureFieldOrder =
    [
        "merchant_id",
        "merchant_key",
        "return_url",
        "cancel_url",
        "notify_url",
        "name_first",
        "name_last",
        "email_address",
        "m_payment_id",
        "amount",
        "item_name",
        "item_description"
    ];

    private static readonly string[] PayFastNotificationFieldOrder =
    [
        "m_payment_id",
        "pf_payment_id",
        "payment_status",
        "item_name",
        "item_description",
        "amount_gross",
        "amount_fee",
        "amount_net",
        "custom_str1",
        "custom_str2",
        "custom_str3",
        "custom_str4",
        "custom_str5",
        "custom_int1",
        "custom_int2",
        "custom_int3",
        "custom_int4",
        "custom_int5",
        "name_first",
        "name_last",
        "email_address",
        "merchant_id"
    ];

    // ===============================
    // Initiate PayFast order payment
    // Builds signed PayFast checkout form fields for an existing pending order.
    // This follows the Mo Salon pattern: order exists first, payment starts second.
    // ===============================
    public async Task<PayFastPaymentResponseDto> InitiatePayFastOrderPaymentAsync(
        int userId,
        InitiatePayFastPaymentDto dto)
    {
        ValidatePayFastSettings();

        var order = await context.Orders
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == dto.OrderId && o.AppUserId == userId);

        if (order == null)
            throw new KeyNotFoundException("Order not found.");

        if (order.OrderStatus != "PendingPayment" || order.PaymentStatus != "PendingPayment")
            throw new ArgumentException("Only pending payment orders can be paid.");

        if (order.TotalAmount <= 0)
            throw new ArgumentException("Order total amount is invalid.");

        var payment = order.Payments
            .FirstOrDefault(p =>
                p.Provider == "PayFast" &&
                p.Status == "PendingPayment");

        if (payment == null)
        {
            payment = new OrderPayment
            {
                OrderId = order.Id,
                Provider = "PayFast",
                Status = "PendingPayment",
                Amount = order.TotalAmount,
                MerchantReference = order.OrderNumber,
                CreatedAt = DateTime.UtcNow
            };

            context.OrderPayments.Add(payment);
            await context.SaveChangesAsync();
        }

        var formFields = BuildPayFastFormFields(order);

        formFields["signature"] = GenerateSignatureForOrderedFields(
            formFields,
            CheckoutSignatureFieldOrder);

        return new PayFastPaymentResponseDto
        {
            OrderId = order.Id,
            OrderNumber = order.OrderNumber,
            PaymentProvider = "PayFast",
            Amount = order.TotalAmount,
            AmountText = FormatPrice(order.TotalAmount),
            PaymentUrl = _payFastSettings.ProcessUrl,
            FormFields = formFields
        };
    }

    // ===============================
    // Process PayFast notification
    // Handles PayFast server-to-server ITN/webhook form posts.
    // This endpoint is the source of truth for marking orders as paid.
    // ===============================
    public async Task ProcessPayFastNotificationAsync(Dictionary<string, string> formFields)
    {
        if (formFields.Count == 0)
            throw new ArgumentException("PayFast notification payload is empty.");

        var signatureIsValid = ValidatePayFastNotificationSignature(formFields);

        if (!signatureIsValid && !_payFastSettings.SandboxMode)
            throw new ArgumentException("PayFast signature is invalid.");

        if (!signatureIsValid && _payFastSettings.SandboxMode)
        {
            logger.LogWarning(
                "PayFast sandbox notify signature did not match, but SandboxMode is true. The notification will continue after merchant, order, and amount validation.");
        }

        ValidateMerchantId(formFields);

        var merchantReference = GetRequiredField(formFields, "m_payment_id").Trim();

        var order = await context.Orders
            .Include(o => o.Items)
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.OrderNumber == merchantReference);

        if (order == null)
            throw new KeyNotFoundException("Order was not found for PayFast notification.");

        var paidAmount = GetPayFastAmount(formFields);

        if (Math.Abs(paidAmount - order.TotalAmount) > 0.01m)
            throw new ArgumentException("PayFast amount does not match the order total.");

        var paymentStatus = GetRequiredField(formFields, "payment_status")
            .Trim()
            .ToUpperInvariant();

        var gatewayPaymentId = formFields.TryGetValue("pf_payment_id", out var pfPaymentId)
            ? pfPaymentId
            : string.Empty;

        var payment = order.Payments
            .FirstOrDefault(p => p.Provider == "PayFast" && p.MerchantReference == order.OrderNumber);

        if (payment == null)
        {
            payment = new OrderPayment
            {
                OrderId = order.Id,
                Provider = "PayFast",
                MerchantReference = order.OrderNumber,
                Amount = order.TotalAmount,
                CreatedAt = DateTime.UtcNow
            };

            context.OrderPayments.Add(payment);
        }

        payment.Amount = order.TotalAmount;
        payment.GatewayPaymentId = gatewayPaymentId;
        payment.RawGatewayResponse = BuildRawGatewayResponse(formFields);

        if (paymentStatus == "COMPLETE")
        {
            payment.Status = "Paid";
            payment.PaidAt ??= DateTime.UtcNow;

            order.PaymentStatus = "Paid";
            order.OrderStatus = "Processing";
            order.PaidAt ??= DateTime.UtcNow;
            order.UpdatedAt = DateTime.UtcNow;
        }
        else if (paymentStatus == "FAILED")
        {
            if (order.PaymentStatus == "Paid")
                return;

            payment.Status = "Failed";
            payment.FailedAt = DateTime.UtcNow;

            order.PaymentStatus = "Failed";
            order.OrderStatus = "Failed";
            order.FailedAt = DateTime.UtcNow;
            order.UpdatedAt = DateTime.UtcNow;

            await RestoreReservedStockAsync(order);
        }
        else if (paymentStatus == "CANCELLED")
        {
            if (order.PaymentStatus == "Paid")
                return;

            payment.Status = "Cancelled";
            payment.CancelledAt = DateTime.UtcNow;

            order.PaymentStatus = "Cancelled";
            order.OrderStatus = "Cancelled";
            order.CancelledAt = DateTime.UtcNow;
            order.UpdatedAt = DateTime.UtcNow;

            await RestoreReservedStockAsync(order);
        }
        else
        {
            throw new ArgumentException($"Unsupported PayFast payment status '{paymentStatus}'.");
        }

        await context.SaveChangesAsync();
    }

    // ===============================
    // Mark PayFast order payment cancelled
    // Used when the customer clicks cancel or returns from PayFast cancel URL.
    // ===============================
    public async Task<bool> MarkPayFastOrderPaymentCancelledAsync(int userId, int orderId)
    {
        var order = await context.Orders
            .Include(o => o.Items)
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.AppUserId == userId);

        if (order == null)
            return false;

        if (order.PaymentStatus == "Paid")
            throw new ArgumentException("Paid orders cannot be cancelled from the payment screen.");

        order.PaymentStatus = "Cancelled";
        order.OrderStatus = "Cancelled";
        order.CancelledAt = DateTime.UtcNow;
        order.UpdatedAt = DateTime.UtcNow;

        var payment = order.Payments
            .FirstOrDefault(p => p.Provider == "PayFast" && p.MerchantReference == order.OrderNumber);

        if (payment != null)
        {
            payment.Status = "Cancelled";
            payment.CancelledAt = DateTime.UtcNow;
        }

        await RestoreReservedStockAsync(order);

        await context.SaveChangesAsync();

        return true;
    }

    private Dictionary<string, string> BuildPayFastFormFields(Order order)
    {
        var returnUrl = AppendOrderIdToUrl(_payFastSettings.ReturnUrl, order.Id);
        var cancelUrl = AppendOrderIdToUrl(_payFastSettings.CancelUrl, order.Id);

        return new Dictionary<string, string>
        {
            ["merchant_id"] = _payFastSettings.MerchantId,
            ["merchant_key"] = _payFastSettings.MerchantKey,
            ["return_url"] = returnUrl,
            ["cancel_url"] = cancelUrl,
            ["notify_url"] = _payFastSettings.NotifyUrl,
            ["name_first"] = order.FirstName,
            ["name_last"] = order.LastName,
            ["email_address"] = order.Email,
            ["m_payment_id"] = order.OrderNumber,
            ["amount"] = order.TotalAmount.ToString("0.00", CultureInfo.InvariantCulture),
            ["item_name"] = $"ZivaFit Order {order.OrderNumber}",
            ["item_description"] = $"ZivaFit activewear order {order.OrderNumber}"
        };
    }

    private void ValidatePayFastSettings()
    {
        if (string.IsNullOrWhiteSpace(_payFastSettings.MerchantId))
            throw new Exception("PayFast MerchantId is missing.");

        if (string.IsNullOrWhiteSpace(_payFastSettings.MerchantKey))
            throw new Exception("PayFast MerchantKey is missing.");

        if (string.IsNullOrWhiteSpace(_payFastSettings.ProcessUrl))
            throw new Exception("PayFast ProcessUrl is missing.");

        if (string.IsNullOrWhiteSpace(_payFastSettings.ReturnUrl))
            throw new Exception("PayFast ReturnUrl is missing.");

        if (string.IsNullOrWhiteSpace(_payFastSettings.CancelUrl))
            throw new Exception("PayFast CancelUrl is missing.");

        if (string.IsNullOrWhiteSpace(_payFastSettings.NotifyUrl))
            throw new Exception("PayFast NotifyUrl is missing.");
    }

    private void ValidateMerchantId(Dictionary<string, string> formFields)
    {
        var merchantId = GetRequiredField(formFields, "merchant_id").Trim();

        if (merchantId != _payFastSettings.MerchantId)
            throw new ArgumentException("PayFast merchant ID does not match.");
    }

    private bool ValidatePayFastNotificationSignature(Dictionary<string, string> formFields)
    {
        if (!formFields.TryGetValue("signature", out var submittedSignature) ||
            string.IsNullOrWhiteSpace(submittedSignature))
        {
            logger.LogWarning("PayFast notify signature is missing.");
            return false;
        }

        var fieldsWithoutSignature = formFields
            .Where(field => field.Key != "signature")
            .ToDictionary(field => field.Key, field => field.Value);

        var candidateSignatures = new List<string>
        {
            GenerateSignature(fieldsWithoutSignature),
            GenerateSignatureForOrderedFields(fieldsWithoutSignature, PayFastNotificationFieldOrder),
            GenerateSignatureAlphabetically(fieldsWithoutSignature)
        }
        .Distinct(StringComparer.OrdinalIgnoreCase)
        .ToList();

        var signatureMatches = candidateSignatures.Any(candidate =>
            string.Equals(candidate, submittedSignature.Trim(), StringComparison.OrdinalIgnoreCase));

        if (!signatureMatches)
        {
            logger.LogWarning(
                "PayFast notify signature mismatch. Submitted signature: {SubmittedSignature}. Calculated signatures: {CalculatedSignatures}",
                submittedSignature,
                string.Join(", ", candidateSignatures));
        }

        return signatureMatches;
    }

    private string GenerateSignatureForOrderedFields(
        Dictionary<string, string> fields,
        IReadOnlyList<string> fieldOrder)
    {
        var orderedKeys = fieldOrder.ToHashSet(StringComparer.OrdinalIgnoreCase);

        var orderedFields = fieldOrder
            .Where(fields.ContainsKey)
            .Select(key => new KeyValuePair<string, string>(key, fields[key]))
            .Concat(fields
                .Where(field => !orderedKeys.Contains(field.Key))
                .OrderBy(field => field.Key, StringComparer.Ordinal));

        return GenerateSignature(orderedFields);
    }

    private string GenerateSignatureAlphabetically(Dictionary<string, string> fields)
    {
        return GenerateSignature(fields.OrderBy(field => field.Key, StringComparer.Ordinal));
    }

    private string GenerateSignature(Dictionary<string, string> fields)
    {
        return GenerateSignature(fields.AsEnumerable());
    }

    private string GenerateSignature(IEnumerable<KeyValuePair<string, string>> fields)
    {
        var signatureFields = fields
            .Where(field => !string.IsNullOrWhiteSpace(field.Value))
            .Select(field => $"{field.Key}={EncodePayFastValue(field.Value)}")
            .ToList();

        if (!string.IsNullOrWhiteSpace(_payFastSettings.Passphrase))
            signatureFields.Add($"passphrase={EncodePayFastValue(_payFastSettings.Passphrase)}");

        var parameterString = string.Join("&", signatureFields);

        using var md5 = MD5.Create();

        var bytes = Encoding.UTF8.GetBytes(parameterString);
        var hashBytes = md5.ComputeHash(bytes);

        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }

    private static string EncodePayFastValue(string value)
    {
        return WebUtility.UrlEncode(value.Trim())?.Replace("%20", "+") ?? string.Empty;
    }

    private static string GetRequiredField(Dictionary<string, string> formFields, string fieldName)
    {
        if (!formFields.TryGetValue(fieldName, out var value) || string.IsNullOrWhiteSpace(value))
            throw new ArgumentException($"PayFast field '{fieldName}' is missing.");

        return value;
    }

    private static decimal GetPayFastAmount(Dictionary<string, string> formFields)
    {
        var amountValue = formFields.TryGetValue("amount_gross", out var amountGross)
            ? amountGross
            : GetRequiredField(formFields, "amount");

        if (!decimal.TryParse(amountValue, NumberStyles.Number, CultureInfo.InvariantCulture, out var amount))
            throw new ArgumentException("PayFast amount is invalid.");

        return amount;
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

    private static string BuildRawGatewayResponse(Dictionary<string, string> formFields)
    {
        return string.Join("&", formFields.Select(field => $"{field.Key}={field.Value}"));
    }

    private static string AppendOrderIdToUrl(string url, int orderId)
    {
        var separator = url.Contains('?') ? "&" : "?";

        return $"{url}{separator}orderId={orderId}";
    }

    private static string FormatPrice(decimal price)
    {
        return $"R{price:0.00}";
    }
}