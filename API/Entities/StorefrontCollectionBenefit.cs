namespace API.Entities;

public class StorefrontCollectionBenefit
{
    public int Id { get; set; }

    public int CollectionPageId { get; set; }
    public StorefrontCollectionPage CollectionPage { get; set; } = null!;

    public string IconClass { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}