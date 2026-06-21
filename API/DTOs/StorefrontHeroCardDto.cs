namespace API.DTOs;

public class StorefrontHeroCardDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string ImageAlt { get; set; } = string.Empty;
    public string CardClass { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
}