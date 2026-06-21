namespace API.Entities;

public class StorefrontCategoryCard
{
    public int Id { get; set; }

    public int HomeContentId { get; set; }
    public StorefrontHomeContent HomeContent { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string Route { get; set; } = string.Empty;
    public string LinkLabel { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<StorefrontCategoryCardImage> Images { get; set; } = new List<StorefrontCategoryCardImage>();
}