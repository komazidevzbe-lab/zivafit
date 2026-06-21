namespace API.Entities;

public class ProductImage
{
    public int Id { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string ImageUrl { get; set; } = string.Empty;
    public string ImageAlt { get; set; } = string.Empty;

    public string? PublicId { get; set; }

    public int DisplayOrder { get; set; }
    public bool IsMain { get; set; }
}