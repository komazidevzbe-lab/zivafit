namespace API.Entities;

public class StorefrontCollectionHeroImage
{
    public int Id { get; set; }

    public int CollectionPageId { get; set; }
    public StorefrontCollectionPage CollectionPage { get; set; } = null!;

    public string ImageUrl { get; set; } = string.Empty;
    public string ImageAlt { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}