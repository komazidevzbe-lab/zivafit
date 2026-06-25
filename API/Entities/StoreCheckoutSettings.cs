namespace API.Entities;

public class StoreCheckoutSettings
{
    public int Id { get; set; }

    public string SettingsName { get; set; } = "Default Checkout Settings";

    public string DeliveryMethodName { get; set; } = "Standard Delivery";
    public string DeliveryMessage { get; set; } = "Nationwide South African delivery.";
    public string DeliveryRuleText { get; set; } = string.Empty;

    public decimal SmallOrderDeliveryFee { get; set; }
    public decimal MediumDeliveryThreshold { get; set; }
    public decimal MediumOrderDeliveryFee { get; set; }
    public decimal FreeDeliveryThreshold { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}