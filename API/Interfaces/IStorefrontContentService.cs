using API.DTOs;
using Microsoft.AspNetCore.Http;

namespace API.Interfaces;

public interface IStorefrontContentService
{
    Task<StorefrontHomeContentDto?> GetHomeContentAsync();
    Task<StorefrontHomeContentDto?> UpdateHomeContentAsync(UpdateStorefrontHomeContentDto dto);

    Task<IReadOnlyList<StorefrontCollectionPageDto>> GetCollectionPagesAsync(bool includeInactive = false);
    Task<StorefrontCollectionPageDto?> GetCollectionPageAsync(string pageKey, bool includeInactive = false);
    Task<StorefrontCollectionPageDto?> UpdateCollectionPageAsync(int collectionPageId, UpdateStorefrontCollectionPageDto dto);

    Task<StorefrontCollectionHeroPointDto?> UpdateCollectionHeroPointAsync(
        int heroPointId,
        UpdateStorefrontCollectionHeroPointDto dto);

    Task<StorefrontCollectionHeroImageDto?> UpdateCollectionHeroImageAsync(
        int heroImageId,
        UpdateStorefrontCollectionHeroImageDto dto);

    Task<StorefrontCollectionHeroImageDto?> UploadCollectionHeroImageAsync(
        int heroImageId,
        IFormFile file,
        string? imageAlt);

    Task<StorefrontCollectionBenefitDto?> UpdateCollectionBenefitAsync(
        int collectionBenefitId,
        UpdateStorefrontCollectionBenefitDto dto);

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