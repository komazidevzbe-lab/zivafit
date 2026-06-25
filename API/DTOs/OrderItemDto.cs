namespace API.DTOs;

public class OrderItemDto
{
    public int Id { get; set; }

    public int ProductId { get; set; }
    public int ProductVariantId { get; set; }

    public string ProductName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Colour { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;
    public string ImageAlt { get; set; } = string.Empty;

    public decimal UnitPrice { get; set; }
    public string UnitPriceText { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal LineTotal { get; set; }
    public string LineTotalText { get; set; } = string.Empty;
}