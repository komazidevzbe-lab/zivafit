namespace API.DTOs;

public class StorefrontCollectionBenefitDto
{
    public int Id { get; set; }

    public string IconClass { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
}