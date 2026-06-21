namespace API.Entities;

public class StorefrontBenefitItem
{
    public int Id { get; set; }

    public int HomeContentId { get; set; }
    public StorefrontHomeContent HomeContent { get; set; } = null!;

    public string IconClass { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}