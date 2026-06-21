namespace API.DTOs;

public class ProductVariantDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }

    public string Size { get; set; } = string.Empty;
    public string Colour { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;

    public int StockQuantity { get; set; }
    public bool IsActive { get; set; }
}