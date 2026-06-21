namespace API.Entities;

public class StorefrontCategoryCardImage
{
    public int Id { get; set; }

    public int CategoryCardId { get; set; }
    public StorefrontCategoryCard CategoryCard { get; set; } = null!;

    public string ImageUrl { get; set; } = string.Empty;
    public string ImageAlt { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}