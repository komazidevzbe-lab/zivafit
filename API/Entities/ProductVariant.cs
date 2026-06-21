namespace API.Entities;

public class ProductVariant
{
    public int Id { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string Size { get; set; } = string.Empty;
    public string Colour { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;

    public int StockQuantity { get; set; }
    public bool IsActive { get; set; } = true;
}