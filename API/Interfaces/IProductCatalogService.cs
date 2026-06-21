using API.DTOs;

namespace API.Interfaces;

public interface IProductCatalogService
{
    Task<IReadOnlyList<ProductListDto>> GetProductsAsync(ProductParamsDto productParams, bool includeInactive = false);
    Task<ProductDto?> GetProductByIdAsync(int id, bool includeInactive = false);
    Task<IReadOnlyList<ProductCategoryDto>> GetCategoriesAsync(bool includeInactive = false);

    Task<ProductDto> CreateProductAsync(CreateProductDto dto);
    Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto dto);
    Task<bool> DeleteProductAsync(int id);

    Task<ProductVariantDto?> CreateVariantAsync(int productId, CreateProductVariantDto dto);
    Task<ProductVariantDto?> UpdateVariantAsync(int variantId, UpdateProductVariantDto dto);
    Task<bool> DeleteVariantAsync(int variantId);

    Task<ProductImageDto?> CreateUploadedImageAsync(
        int productId,
        string imageUrl,
        string? publicId,
        string imageAlt,
        bool isMain);

    Task<ProductImageDto?> UpdateImageAsync(int imageId, UpdateProductImageDto dto);
    Task<ProductImageDto?> SetMainImageAsync(int imageId);
    Task<bool> DeleteImageAsync(int imageId);
}