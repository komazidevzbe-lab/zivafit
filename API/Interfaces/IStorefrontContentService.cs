using API.DTOs;

namespace API.Interfaces;

public interface IStorefrontContentService
{
    Task<StorefrontHomeContentDto?> GetHomeContentAsync();
    Task<StorefrontHomeContentDto?> UpdateHomeContentAsync(UpdateStorefrontHomeContentDto dto);

    Task<StorefrontHeroCardDto?> UpdateHeroCardAsync(int heroCardId, UpdateStorefrontHeroCardDto dto);
    Task<StorefrontHeroCardDto?> UploadHeroCardImageAsync(int heroCardId, IFormFile file, string? imageAlt);

    Task<StorefrontCategoryCardImageDto?> UpdateCategoryCardImageAsync(
        int imageId,
        UpdateStorefrontCategoryCardImageDto dto);

    Task<StorefrontCategoryCardImageDto?> UploadCategoryCardImageAsync(
        int imageId,
        IFormFile file,
        string? imageAlt);

    Task<StorefrontBenefitItemDto?> UpdateBenefitItemAsync(int benefitId, UpdateStorefrontBenefitItemDto dto);
}