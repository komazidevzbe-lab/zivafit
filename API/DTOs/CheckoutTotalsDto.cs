namespace API.DTOs;

public class CheckoutTotalsDto
{
    public string DeliveryMethodName { get; set; } = string.Empty;
    public string DeliveryMessage { get; set; } = string.Empty;
    public string DeliveryRuleText { get; set; } = string.Empty;

    public decimal SubtotalAmount { get; set; }
    public string SubtotalText { get; set; } = string.Empty;

    public decimal DeliveryFee { get; set; }
    public string DeliveryFeeText { get; set; } = string.Empty;

    public decimal FreeDeliveryThreshold { get; set; }
    public string FreeDeliveryThresholdText { get; set; } = string.Empty;

    public decimal AmountUntilFreeDelivery { get; set; }
    public string AmountUntilFreeDeliveryText { get; set; } = string.Empty;

    public bool IsFreeDelivery { get; set; }

    public decimal TotalAmount { get; set; }
    public string TotalText { get; set; } = string.Empty;
}