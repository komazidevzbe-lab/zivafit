namespace API.Entities;

public class OrderPayment
{
    public int Id { get; set; }

    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public string Provider { get; set; } = "PayFast";
    public string Status { get; set; } = "PendingPayment";

    public decimal Amount { get; set; }

    public string MerchantReference { get; set; } = string.Empty;
    public string GatewayPaymentId { get; set; } = string.Empty;
    public string RawGatewayResponse { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PaidAt { get; set; }
    public DateTime? FailedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
}