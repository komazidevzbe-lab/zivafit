using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class CheckoutSettingsService(DataContext context) : ICheckoutSettingsService
{
    public async Task<StoreCheckoutSettings> GetActiveSettingsAsync()
    {
        var settings = await context.StoreCheckoutSettings
            .Where(s => s.IsActive)
            .OrderBy(s => s.Id)
            .FirstOrDefaultAsync();

        if (settings == null)
            throw new InvalidOperationException("Checkout settings are missing. Please seed StoreCheckoutSettings before using checkout.");

        ValidateSettings(settings);

        return settings;
    }

    public async Task<CheckoutTotalsDto> CalculateTotalsAsync(decimal subtotalAmount)
    {
        var settings = await GetActiveSettingsAsync();

        var cleanSubtotal = subtotalAmount < 0 ? 0 : subtotalAmount;

        var isFreeDelivery = cleanSubtotal > 0 &&
                             cleanSubtotal >= settings.FreeDeliveryThreshold;

        var deliveryFee = GetDeliveryFee(cleanSubtotal, settings);
        var total = cleanSubtotal + deliveryFee;

        var amountUntilFreeDelivery = isFreeDelivery || cleanSubtotal == 0
            ? 0
            : settings.FreeDeliveryThreshold - cleanSubtotal;

        return new CheckoutTotalsDto
        {
            DeliveryMethodName = settings.DeliveryMethodName,
            DeliveryMessage = settings.DeliveryMessage,
            DeliveryRuleText = settings.DeliveryRuleText,

            SubtotalAmount = cleanSubtotal,
            SubtotalText = FormatPrice(cleanSubtotal),

            DeliveryFee = deliveryFee,
            DeliveryFeeText = deliveryFee <= 0 ? "Free" : FormatPrice(deliveryFee),

            FreeDeliveryThreshold = settings.FreeDeliveryThreshold,
            FreeDeliveryThresholdText = FormatPrice(settings.FreeDeliveryThreshold),

            AmountUntilFreeDelivery = amountUntilFreeDelivery,
            AmountUntilFreeDeliveryText = FormatPrice(amountUntilFreeDelivery),

            IsFreeDelivery = isFreeDelivery,

            TotalAmount = total,
            TotalText = FormatPrice(total)
        };
    }

    private static decimal GetDeliveryFee(decimal subtotalAmount, StoreCheckoutSettings settings)
    {
        if (subtotalAmount <= 0)
            return 0;

        if (subtotalAmount >= settings.FreeDeliveryThreshold)
            return 0;

        if (subtotalAmount >= settings.MediumDeliveryThreshold)
            return settings.MediumOrderDeliveryFee;

        return settings.SmallOrderDeliveryFee;
    }

    private static void ValidateSettings(StoreCheckoutSettings settings)
    {
        if (settings.SmallOrderDeliveryFee < 0)
            throw new InvalidOperationException("Small order delivery fee cannot be negative.");

        if (settings.MediumOrderDeliveryFee < 0)
            throw new InvalidOperationException("Medium order delivery fee cannot be negative.");

        if (settings.MediumDeliveryThreshold <= 0)
            throw new InvalidOperationException("Medium delivery threshold must be greater than zero.");

        if (settings.FreeDeliveryThreshold <= settings.MediumDeliveryThreshold)
            throw new InvalidOperationException("Free delivery threshold must be greater than the medium delivery threshold.");
    }

    private static string FormatPrice(decimal price)
    {
        return $"R{price:0.00}";
    }
}