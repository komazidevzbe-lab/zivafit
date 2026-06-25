namespace API.DTOs;

public class PayFastPaymentResponseDto
{
    public int OrderId { get; set; }

    public string OrderNumber { get; set; } = string.Empty;
    public string PaymentProvider { get; set; } = "PayFast";

    public decimal Amount { get; set; }
    public string AmountText { get; set; } = string.Empty;

    public string PaymentUrl { get; set; } = string.Empty;

    public Dictionary<string, string> FormFields { get; set; } = new();
}