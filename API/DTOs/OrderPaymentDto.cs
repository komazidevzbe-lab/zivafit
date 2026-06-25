namespace API.DTOs;

public class OrderPaymentDto
{
    public int Id { get; set; }

    public string Provider { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;

    public decimal Amount { get; set; }
    public string AmountText { get; set; } = string.Empty;

    public string MerchantReference { get; set; } = string.Empty;
    public string GatewayPaymentId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
    public DateTime? PaidAt { get; set; }
    public DateTime? FailedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
}