namespace API.DTOs;

public class ProductDto : ProductListDto
{
    public string Description { get; set; } = string.Empty;

    public List<ProductImageDto> Images { get; set; } = [];
    public List<ProductVariantDto> Variants { get; set; } = [];
}