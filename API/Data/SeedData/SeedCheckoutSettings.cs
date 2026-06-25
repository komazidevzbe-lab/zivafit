using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.SeedData;

public static class SeedCheckoutSettings
{
    public static async Task SeedAsync(DataContext context)
    {
        var settings = await context.StoreCheckoutSettings
            .FirstOrDefaultAsync(s => s.IsActive);

        if (settings == null)
        {
            context.StoreCheckoutSettings.Add(new StoreCheckoutSettings
            {
                SettingsName = "Default ZivaFit Delivery Rules",
                DeliveryMethodName = "Standard Delivery",
                DeliveryMessage = "Nationwide South African delivery.",
                DeliveryRuleText = "Orders under R500: R100 delivery. Orders from R500 to R999.99: R80 delivery. Orders R1000 or more: free delivery.",
                SmallOrderDeliveryFee = 100m,
                MediumDeliveryThreshold = 500m,
                MediumOrderDeliveryFee = 80m,
                FreeDeliveryThreshold = 1000m,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            await context.SaveChangesAsync();
            return;
        }

        settings.SettingsName = "Default ZivaFit Delivery Rules";
        settings.DeliveryMethodName = "Standard Delivery";
        settings.DeliveryMessage = "Nationwide South African delivery.";
        settings.DeliveryRuleText = "Orders under R500: R100 delivery. Orders from R500 to R999.99: R80 delivery. Orders R1000 or more: free delivery.";
        settings.SmallOrderDeliveryFee = 100m;
        settings.MediumDeliveryThreshold = 500m;
        settings.MediumOrderDeliveryFee = 80m;
        settings.FreeDeliveryThreshold = 1000m;
        settings.IsActive = true;
        settings.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();
    }
}