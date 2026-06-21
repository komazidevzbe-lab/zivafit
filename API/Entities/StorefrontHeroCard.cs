namespace API.Entities;

public class StorefrontHeroCard
{
    public int Id { get; set; }

    public int HomeContentId { get; set; }
    public StorefrontHomeContent HomeContent { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string ImageAlt { get; set; } = string.Empty;
    public string CardClass { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}