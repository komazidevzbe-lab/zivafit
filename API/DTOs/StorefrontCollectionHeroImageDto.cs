namespace API.DTOs;

public class StorefrontCollectionHeroImageDto
{
    public int Id { get; set; }

    public string ImageUrl { get; set; } = string.Empty;
    public string ImageAlt { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
}