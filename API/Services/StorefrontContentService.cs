using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class StorefrontContentService(
    DataContext context,
    IPhotoService photoService
) : IStorefrontContentService
{
    // ===============================
    // Get Home content
    // Loads active Home content from the database.
    // This keeps Home page copy, cards, images, and benefits out of Angular TypeScript.
    // ===============================
    public async Task<StorefrontHomeContentDto?> GetHomeContentAsync()
    {
        var homeContent = await LoadHomeContentQuery()
            .AsNoTracking()
            .Where(h => h.IsActive)
            .OrderBy(h => h.Id)
            .FirstOrDefaultAsync();

        if (homeContent == null)
            return null;

        return MapHomeContentToDto(homeContent);
    }

    // ===============================
    // Update Home content
    // Admin updates copy and labels only.
    // Routes remain controlled by Angular routes and backend APIs.
    // ===============================
    public async Task<StorefrontHomeContentDto?> UpdateHomeContentAsync(UpdateStorefrontHomeContentDto dto)
    {
        var homeContent = await LoadHomeContentQuery()
            .Where(h => h.IsActive)
            .OrderBy(h => h.Id)
            .FirstOrDefaultAsync();

        if (homeContent == null)
            return null;

        homeContent.HeroEyebrow = dto.HeroEyebrow.Trim();
        homeContent.HeroTitle = dto.HeroTitle.Trim();
        homeContent.HeroHighlight = dto.HeroHighlight.Trim();
        homeContent.HeroText = dto.HeroText.Trim();
        homeContent.PrimaryButtonLabel = dto.PrimaryButtonLabel.Trim();
        homeContent.SecondaryButtonLabel = dto.SecondaryButtonLabel.Trim();
        homeContent.HeroVisualAriaLabel = dto.HeroVisualAriaLabel.Trim();
        homeContent.CategorySectionAriaLabel = dto.CategorySectionAriaLabel.Trim();
        homeContent.BestSellersEyebrow = dto.BestSellersEyebrow.Trim();
        homeContent.BestSellersTitle = dto.BestSellersTitle.Trim();
        homeContent.BestSellersLinkLabel = dto.BestSellersLinkLabel.Trim();
        homeContent.ProductCardLinkLabel = dto.ProductCardLinkLabel.Trim();

        await context.SaveChangesAsync();

        return MapHomeContentToDto(homeContent);
    }

    // ===============================
    // Update hero card
    // Updates title and alt text only.
    // Image URL is changed only through upload.
    // ===============================
    public async Task<StorefrontHeroCardDto?> UpdateHeroCardAsync(
        int heroCardId,
        UpdateStorefrontHeroCardDto dto)
    {
        var heroCard = await context.StorefrontHeroCards
            .FirstOrDefaultAsync(c => c.Id == heroCardId);

        if (heroCard == null)
            return null;

        heroCard.Title = dto.Title.Trim();
        heroCard.ImageAlt = dto.ImageAlt.Trim();

        await context.SaveChangesAsync();

        return MapHeroCardToDto(heroCard);
    }

    // ===============================
    // Upload hero card image
    // Admin uploads an image file instead of typing a URL.
    // ===============================
    public async Task<StorefrontHeroCardDto?> UploadHeroCardImageAsync(
        int heroCardId,
        IFormFile file,
        string? imageAlt)
    {
        var heroCard = await context.StorefrontHeroCards
            .FirstOrDefaultAsync(c => c.Id == heroCardId);

        if (heroCard == null)
            return null;

        var uploadResult = await photoService.UploadStorefrontImageAsync(file);

        heroCard.ImageUrl = uploadResult.Url;

        if (!string.IsNullOrWhiteSpace(imageAlt))
            heroCard.ImageAlt = imageAlt.Trim();

        await context.SaveChangesAsync();

        return MapHeroCardToDto(heroCard);
    }

    // ===============================
    // Update category card image
    // Updates alt text only.
    // Image URL is changed only through upload.
    // ===============================
    public async Task<StorefrontCategoryCardImageDto?> UpdateCategoryCardImageAsync(
        int imageId,
        UpdateStorefrontCategoryCardImageDto dto)
    {
        var image = await context.StorefrontCategoryCardImages
            .FirstOrDefaultAsync(i => i.Id == imageId);

        if (image == null)
            return null;

        image.ImageAlt = dto.ImageAlt.Trim();

        await context.SaveChangesAsync();

        return MapCategoryCardImageToDto(image);
    }

    // ===============================
    // Upload category card image
    // Admin uploads an image file instead of typing a URL.
    // ===============================
    public async Task<StorefrontCategoryCardImageDto?> UploadCategoryCardImageAsync(
        int imageId,
        IFormFile file,
        string? imageAlt)
    {
        var image = await context.StorefrontCategoryCardImages
            .FirstOrDefaultAsync(i => i.Id == imageId);

        if (image == null)
            return null;

        var uploadResult = await photoService.UploadStorefrontImageAsync(file);

        image.ImageUrl = uploadResult.Url;

        if (!string.IsNullOrWhiteSpace(imageAlt))
            image.ImageAlt = imageAlt.Trim();

        await context.SaveChangesAsync();

        return MapCategoryCardImageToDto(image);
    }

    // ===============================
    // Update benefit item
    // Updates Home benefit messages.
    // ===============================
    public async Task<StorefrontBenefitItemDto?> UpdateBenefitItemAsync(
        int benefitId,
        UpdateStorefrontBenefitItemDto dto)
    {
        var benefit = await context.StorefrontBenefitItems
            .FirstOrDefaultAsync(b => b.Id == benefitId);

        if (benefit == null)
            return null;

        benefit.IconClass = dto.IconClass.Trim();
        benefit.Title = dto.Title.Trim();
        benefit.Text = dto.Text.Trim();

        await context.SaveChangesAsync();

        return MapBenefitItemToDto(benefit);
    }

    private IQueryable<StorefrontHomeContent> LoadHomeContentQuery()
    {
        return context.StorefrontHomeContents
            .Include(h => h.HeroCards)
            .Include(h => h.CategoryCards)
            .ThenInclude(c => c.Images)
            .Include(h => h.Benefits);
    }

    private static StorefrontHomeContentDto MapHomeContentToDto(StorefrontHomeContent homeContent)
    {
        return new StorefrontHomeContentDto
        {
            Id = homeContent.Id,
            HeroEyebrow = homeContent.HeroEyebrow,
            HeroTitle = homeContent.HeroTitle,
            HeroHighlight = homeContent.HeroHighlight,
            HeroText = homeContent.HeroText,
            PrimaryButtonLabel = homeContent.PrimaryButtonLabel,
            PrimaryButtonRoute = homeContent.PrimaryButtonRoute,
            SecondaryButtonLabel = homeContent.SecondaryButtonLabel,
            SecondaryButtonRoute = homeContent.SecondaryButtonRoute,
            HeroVisualAriaLabel = homeContent.HeroVisualAriaLabel,
            CategorySectionAriaLabel = homeContent.CategorySectionAriaLabel,
            BestSellersEyebrow = homeContent.BestSellersEyebrow,
            BestSellersTitle = homeContent.BestSellersTitle,
            BestSellersLinkLabel = homeContent.BestSellersLinkLabel,
            BestSellersLinkRoute = homeContent.BestSellersLinkRoute,
            ProductCardLinkLabel = homeContent.ProductCardLinkLabel,
            HeroCards = homeContent.HeroCards
                .Where(c => c.IsActive)
                .OrderBy(c => c.DisplayOrder)
                .Select(MapHeroCardToDto)
                .ToList(),
            CategoryCards = homeContent.CategoryCards
                .Where(c => c.IsActive)
                .OrderBy(c => c.DisplayOrder)
                .Select(MapCategoryCardToDto)
                .ToList(),
            Benefits = homeContent.Benefits
                .Where(b => b.IsActive)
                .OrderBy(b => b.DisplayOrder)
                .Select(MapBenefitItemToDto)
                .ToList()
        };
    }

    private static StorefrontHeroCardDto MapHeroCardToDto(StorefrontHeroCard card)
    {
        return new StorefrontHeroCardDto
        {
            Id = card.Id,
            Title = card.Title,
            ImageUrl = card.ImageUrl,
            ImageAlt = card.ImageAlt,
            CardClass = card.CardClass,
            DisplayOrder = card.DisplayOrder
        };
    }

    private static StorefrontCategoryCardDto MapCategoryCardToDto(StorefrontCategoryCard card)
    {
        return new StorefrontCategoryCardDto
        {
            Id = card.Id,
            Title = card.Title,
            Route = card.Route,
            LinkLabel = card.LinkLabel,
            DisplayOrder = card.DisplayOrder,
            Images = card.Images
                .Where(i => i.IsActive)
                .OrderBy(i => i.DisplayOrder)
                .Select(MapCategoryCardImageToDto)
                .ToList()
        };
    }

    private static StorefrontCategoryCardImageDto MapCategoryCardImageToDto(StorefrontCategoryCardImage image)
    {
        return new StorefrontCategoryCardImageDto
        {
            Id = image.Id,
            ImageUrl = image.ImageUrl,
            ImageAlt = image.ImageAlt,
            DisplayOrder = image.DisplayOrder
        };
    }

    private static StorefrontBenefitItemDto MapBenefitItemToDto(StorefrontBenefitItem benefit)
    {
        return new StorefrontBenefitItemDto
        {
            Id = benefit.Id,
            IconClass = benefit.IconClass,
            Title = benefit.Title,
            Text = benefit.Text,
            DisplayOrder = benefit.DisplayOrder
        };
    }
}