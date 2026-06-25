namespace API.DTOs;

public class WishlistItemDto
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string FitType { get; set; } = string.Empty;

    public decimal Price { get; set; }
    public string PriceText { get; set; } = string.Empty;

    public string Colour { get; set; } = string.Empty;
    public string Badge { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;
    public string ImageAlt { get; set; } = string.Empty;

    public bool IsNew { get; set; }
    public bool IsBestSeller { get; set; }
    public bool IsFeatured { get; set; }

    public DateTime CreatedAt { get; set; }
}