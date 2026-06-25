namespace API.DTOs;

public class OrderParamsDto
{
    public string? Search { get; set; }
    public string? OrderStatus { get; set; }
    public string? PaymentStatus { get; set; }
}