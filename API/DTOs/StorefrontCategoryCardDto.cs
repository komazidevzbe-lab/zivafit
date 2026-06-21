namespace API.DTOs;

public class StorefrontCategoryCardDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Route { get; set; } = string.Empty;
    public string LinkLabel { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }

    public List<StorefrontCategoryCardImageDto> Images { get; set; } = [];
}