namespace API.DTOs;

public class StorefrontCollectionHeroPointDto
{
    public int Id { get; set; }

    public string IconClass { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
}