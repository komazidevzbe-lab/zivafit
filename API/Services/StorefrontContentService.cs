using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class StorefrontContentService(
    DataContext context,
    IPhotoService photoService
) : IStorefrontContentService
{
    // ===============================
    // Get Home content
    // Loads active Home page content from the database.
    // ===============================
    public async Task<StorefrontHomeContentDto?> GetHomeContentAsync()
    {
        var homeContent = await context.StorefrontHomeContents
            .Include(h => h.HeroCards)
            .Include(h => h.CategoryCards)
                .ThenInclude(c => c.Images)
            .Include(h => h.Benefits)
            .AsNoTracking()
            .FirstOrDefaultAsync(h => h.IsActive);

        return homeContent == null ? null : MapHomeContent(homeContent);
    }

    // ===============================
    // Update Home content
    // Updates admin-managed Home text only.
    // Routes remain controlled by Angular routes and API behaviour.
    // ===============================
    public async Task<StorefrontHomeContentDto?> UpdateHomeContentAsync(UpdateStorefrontHomeContentDto dto)
    {
        var homeContent = await context.StorefrontHomeContents
            .Include(h => h.HeroCards)
            .Include(h => h.CategoryCards)
                .ThenInclude(c => c.Images)
            .Include(h => h.Benefits)
            .FirstOrDefaultAsync(h => h.IsActive);

        if (homeContent == null)
            return null;

        homeContent.HeroEyebrow = Clean(dto.HeroEyebrow);
        homeContent.HeroTitle = Clean(dto.HeroTitle);
        homeContent.HeroHighlight = Clean(dto.HeroHighlight);
        homeContent.HeroText = Clean(dto.HeroText);
        homeContent.PrimaryButtonLabel = Clean(dto.PrimaryButtonLabel);
        homeContent.SecondaryButtonLabel = Clean(dto.SecondaryButtonLabel);
        homeContent.BestSellersEyebrow = Clean(dto.BestSellersEyebrow);
        homeContent.BestSellersTitle = Clean(dto.BestSellersTitle);
        homeContent.BestSellersLinkLabel = Clean(dto.BestSellersLinkLabel);
        homeContent.ProductCardLinkLabel = Clean(dto.ProductCardLinkLabel);

        await context.SaveChangesAsync();

        return MapHomeContent(homeContent);
    }

    // ===============================
    // Get collection pages
    // Loads public collection page content from the database.
    // ===============================
    public async Task<IReadOnlyList<StorefrontCollectionPageDto>> GetCollectionPagesAsync(bool includeInactive = false)
    {
        var pages = await CollectionPageQuery(includeInactive)
            .OrderBy(page => page.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();

        return pages.Select(MapCollectionPage).ToList();
    }

    // ===============================
    // Get collection page
    // Loads one collection page by internal page key.
    // Page keys are not slugs and are not edited by customers/admins.
    // ===============================
    public async Task<StorefrontCollectionPageDto?> GetCollectionPageAsync(string pageKey, bool includeInactive = false)
    {
        var cleanedPageKey = Clean(pageKey).ToLowerInvariant();

        var page = await CollectionPageQuery(includeInactive)
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.PageKey.ToLower() == cleanedPageKey);

        return page == null ? null : MapCollectionPage(page);
    }

    // ===============================
    // Update collection page
    // Updates public collection page text only.
    // Page key, mode, category, routes, and slugs are not edited here.
    // ===============================
    public async Task<StorefrontCollectionPageDto?> UpdateCollectionPageAsync(
        int collectionPageId,
        UpdateStorefrontCollectionPageDto dto)
    {
        var page = await context.StorefrontCollectionPages
            .Include(item => item.HeroPoints)
            .Include(item => item.HeroImages)
            .Include(item => item.Benefits)
            .FirstOrDefaultAsync(item => item.Id == collectionPageId);

        if (page == null)
            return null;

        page.HeroEyebrow = Clean(dto.HeroEyebrow);
        page.HeroTitle = Clean(dto.HeroTitle);
        page.HeroText = Clean(dto.HeroText);
        page.HeroButtonLabel = Clean(dto.HeroButtonLabel);

        page.SecondaryButtonLabel = Clean(dto.SecondaryButtonLabel);

        page.CollectionEyebrow = Clean(dto.CollectionEyebrow);
        page.CollectionTitle = Clean(dto.CollectionTitle);
        page.ProductCardLinkLabel = Clean(dto.ProductCardLinkLabel);

        page.EmptyTitle = Clean(dto.EmptyTitle);
        page.EmptyText = Clean(dto.EmptyText);

        page.NoteEyebrow = Clean(dto.NoteEyebrow);
        page.NoteTitle = Clean(dto.NoteTitle);
        page.NoteText = Clean(dto.NoteText);

        await context.SaveChangesAsync();

        return MapCollectionPage(page);
    }

    // ===============================
    // Update collection hero point
    // Updates one hero point shown on a public collection page.
    // ===============================
    public async Task<StorefrontCollectionHeroPointDto?> UpdateCollectionHeroPointAsync(
        int heroPointId,
        UpdateStorefrontCollectionHeroPointDto dto)
    {
        var point = await context.StorefrontCollectionHeroPoints
            .FirstOrDefaultAsync(item => item.Id == heroPointId);

        if (point == null)
            return null;

        point.IconClass = Clean(dto.IconClass);
        point.Label = Clean(dto.Label);

        await context.SaveChangesAsync();

        return MapCollectionHeroPoint(point);
    }

    // ===============================
    // Update collection hero image
    // Updates collection hero image alt text only.
    // Admin cannot manually type or edit image URLs.
    // ===============================
    public async Task<StorefrontCollectionHeroImageDto?> UpdateCollectionHeroImageAsync(
        int heroImageId,
        UpdateStorefrontCollectionHeroImageDto dto)
    {
        var image = await context.StorefrontCollectionHeroImages
            .FirstOrDefaultAsync(item => item.Id == heroImageId);

        if (image == null)
            return null;

        image.ImageAlt = Clean(dto.ImageAlt);

        await context.SaveChangesAsync();

        return MapCollectionHeroImage(image);
    }

    // ===============================
    // Upload collection hero image
    // Replaces collection hero image through the storefront upload service.
    // ===============================
    public async Task<StorefrontCollectionHeroImageDto?> UploadCollectionHeroImageAsync(
        int heroImageId,
        IFormFile file,
        string? imageAlt)
    {
        var image = await context.StorefrontCollectionHeroImages
            .FirstOrDefaultAsync(item => item.Id == heroImageId);

        if (image == null)
            return null;

        var uploadResult = await photoService.UploadStorefrontImageAsync(file);

        image.ImageUrl = uploadResult.Url;

        if (!string.IsNullOrWhiteSpace(imageAlt))
            image.ImageAlt = Clean(imageAlt);

        await context.SaveChangesAsync();

        return MapCollectionHeroImage(image);
    }

    // ===============================
    // Update collection benefit
    // Updates one benefit card shown on a public collection page.
    // ===============================
    public async Task<StorefrontCollectionBenefitDto?> UpdateCollectionBenefitAsync(
        int collectionBenefitId,
        UpdateStorefrontCollectionBenefitDto dto)
    {
        var benefit = await context.StorefrontCollectionBenefits
            .FirstOrDefaultAsync(item => item.Id == collectionBenefitId);

        if (benefit == null)
            return null;

        benefit.IconClass = Clean(dto.IconClass);
        benefit.Title = Clean(dto.Title);
        benefit.Text = Clean(dto.Text);

        await context.SaveChangesAsync();

        return MapCollectionBenefit(benefit);
    }

    // ===============================
    // Update hero card
    // Updates title and image alt text only.
    // ===============================
    public async Task<StorefrontHeroCardDto?> UpdateHeroCardAsync(
        int heroCardId,
        UpdateStorefrontHeroCardDto dto)
    {
        var card = await context.StorefrontHeroCards
            .FirstOrDefaultAsync(item => item.Id == heroCardId);

        if (card == null)
            return null;

        card.Title = Clean(dto.Title);
        card.ImageAlt = Clean(dto.ImageAlt);

        await context.SaveChangesAsync();

        return MapHeroCard(card);
    }

    // ===============================
    // Upload hero card image
    // Replaces Home hero card image through the photo service.
    // ===============================
    public async Task<StorefrontHeroCardDto?> UploadHeroCardImageAsync(
        int heroCardId,
        IFormFile file,
        string? imageAlt)
    {
        var card = await context.StorefrontHeroCards
            .FirstOrDefaultAsync(item => item.Id == heroCardId);

        if (card == null)
            return null;

        var uploadResult = await photoService.UploadStorefrontImageAsync(file);

        card.ImageUrl = uploadResult.Url;

        if (!string.IsNullOrWhiteSpace(imageAlt))
            card.ImageAlt = Clean(imageAlt);

        await context.SaveChangesAsync();

        return MapHeroCard(card);
    }

    // ===============================
    // Update category card image
    // Updates Home category image alt text only.
    // ===============================
    public async Task<StorefrontCategoryCardImageDto?> UpdateCategoryCardImageAsync(
        int imageId,
        UpdateStorefrontCategoryCardImageDto dto)
    {
        var image = await context.StorefrontCategoryCardImages
            .FirstOrDefaultAsync(item => item.Id == imageId);

        if (image == null)
            return null;

        image.ImageAlt = Clean(dto.ImageAlt);

        await context.SaveChangesAsync();

        return MapCategoryCardImage(image);
    }

    // ===============================
    // Upload category card image
    // Replaces Home category image through the photo service.
    // ===============================
    public async Task<StorefrontCategoryCardImageDto?> UploadCategoryCardImageAsync(
        int imageId,
        IFormFile file,
        string? imageAlt)
    {
        var image = await context.StorefrontCategoryCardImages
            .FirstOrDefaultAsync(item => item.Id == imageId);

        if (image == null)
            return null;

        var uploadResult = await photoService.UploadStorefrontImageAsync(file);

        image.ImageUrl = uploadResult.Url;

        if (!string.IsNullOrWhiteSpace(imageAlt))
            image.ImageAlt = Clean(imageAlt);

        await context.SaveChangesAsync();

        return MapCategoryCardImage(image);
    }

    // ===============================
    // Update benefit item
    // Updates Home benefit item content.
    // ===============================
    public async Task<StorefrontBenefitItemDto?> UpdateBenefitItemAsync(
        int benefitId,
        UpdateStorefrontBenefitItemDto dto)
    {
        var benefit = await context.StorefrontBenefitItems
            .FirstOrDefaultAsync(item => item.Id == benefitId);

        if (benefit == null)
            return null;

        benefit.IconClass = Clean(dto.IconClass);
        benefit.Title = Clean(dto.Title);
        benefit.Text = Clean(dto.Text);

        await context.SaveChangesAsync();

        return MapBenefitItem(benefit);
    }

    private IQueryable<StorefrontCollectionPage> CollectionPageQuery(bool includeInactive)
    {
        var query = context.StorefrontCollectionPages
            .Include(page => page.HeroPoints)
            .Include(page => page.HeroImages)
            .Include(page => page.Benefits)
            .AsQueryable();

        if (!includeInactive)
            query = query.Where(page => page.IsActive);

        return query;
    }

    private static StorefrontHomeContentDto MapHomeContent(StorefrontHomeContent content)
    {
        return new StorefrontHomeContentDto
        {
            Id = content.Id,
            HeroEyebrow = content.HeroEyebrow,
            HeroTitle = content.HeroTitle,
            HeroHighlight = content.HeroHighlight,
            HeroText = content.HeroText,
            PrimaryButtonLabel = content.PrimaryButtonLabel,
            PrimaryButtonRoute = content.PrimaryButtonRoute,
            SecondaryButtonLabel = content.SecondaryButtonLabel,
            SecondaryButtonRoute = content.SecondaryButtonRoute,
            HeroVisualAriaLabel = content.HeroVisualAriaLabel,
            CategorySectionAriaLabel = content.CategorySectionAriaLabel,
            BestSellersEyebrow = content.BestSellersEyebrow,
            BestSellersTitle = content.BestSellersTitle,
            BestSellersLinkLabel = content.BestSellersLinkLabel,
            BestSellersLinkRoute = content.BestSellersLinkRoute,
            ProductCardLinkLabel = content.ProductCardLinkLabel,
            HeroCards = content.HeroCards
                .Where(card => card.IsActive)
                .OrderBy(card => card.DisplayOrder)
                .Select(MapHeroCard)
                .ToList(),
            CategoryCards = content.CategoryCards
                .Where(card => card.IsActive)
                .OrderBy(card => card.DisplayOrder)
                .Select(MapCategoryCard)
                .ToList(),
            Benefits = content.Benefits
                .Where(benefit => benefit.IsActive)
                .OrderBy(benefit => benefit.DisplayOrder)
                .Select(MapBenefitItem)
                .ToList()
        };
    }

    private static StorefrontHeroCardDto MapHeroCard(StorefrontHeroCard card)
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

    private static StorefrontCategoryCardDto MapCategoryCard(StorefrontCategoryCard card)
    {
        return new StorefrontCategoryCardDto
        {
            Id = card.Id,
            Title = card.Title,
            Route = card.Route,
            LinkLabel = card.LinkLabel,
            DisplayOrder = card.DisplayOrder,
            Images = card.Images
                .Where(image => image.IsActive)
                .OrderBy(image => image.DisplayOrder)
                .Select(MapCategoryCardImage)
                .ToList()
        };
    }

    private static StorefrontCategoryCardImageDto MapCategoryCardImage(StorefrontCategoryCardImage image)
    {
        return new StorefrontCategoryCardImageDto
        {
            Id = image.Id,
            ImageUrl = image.ImageUrl,
            ImageAlt = image.ImageAlt,
            DisplayOrder = image.DisplayOrder
        };
    }

    private static StorefrontBenefitItemDto MapBenefitItem(StorefrontBenefitItem benefit)
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

    private static StorefrontCollectionPageDto MapCollectionPage(StorefrontCollectionPage page)
    {
        return new StorefrontCollectionPageDto
        {
            Id = page.Id,
            PageKey = page.PageKey,
            PageName = page.PageName,
            Mode = page.Mode,
            Category = page.Category,
            FilterType = page.FilterType,
            HeroEyebrow = page.HeroEyebrow,
            HeroTitle = page.HeroTitle,
            HeroText = page.HeroText,
            HeroButtonLabel = page.HeroButtonLabel,
            SecondaryButtonLabel = page.SecondaryButtonLabel,
            SecondaryButtonRoute = page.SecondaryButtonRoute,
            CollectionEyebrow = page.CollectionEyebrow,
            CollectionTitle = page.CollectionTitle,
            ProductCardLinkLabel = page.ProductCardLinkLabel,
            EmptyTitle = page.EmptyTitle,
            EmptyText = page.EmptyText,
            NoteEyebrow = page.NoteEyebrow,
            NoteTitle = page.NoteTitle,
            NoteText = page.NoteText,
            DisplayOrder = page.DisplayOrder,
            HeroPoints = page.HeroPoints
                .Where(point => point.IsActive)
                .OrderBy(point => point.DisplayOrder)
                .Select(MapCollectionHeroPoint)
                .ToList(),
            HeroImages = page.HeroImages
                .Where(image => image.IsActive)
                .OrderBy(image => image.DisplayOrder)
                .Select(MapCollectionHeroImage)
                .ToList(),
            Benefits = page.Benefits
                .Where(benefit => benefit.IsActive)
                .OrderBy(benefit => benefit.DisplayOrder)
                .Select(MapCollectionBenefit)
                .ToList()
        };
    }

    private static StorefrontCollectionHeroPointDto MapCollectionHeroPoint(StorefrontCollectionHeroPoint point)
    {
        return new StorefrontCollectionHeroPointDto
        {
            Id = point.Id,
            IconClass = point.IconClass,
            Label = point.Label,
            DisplayOrder = point.DisplayOrder
        };
    }

    private static StorefrontCollectionHeroImageDto MapCollectionHeroImage(StorefrontCollectionHeroImage image)
    {
        return new StorefrontCollectionHeroImageDto
        {
            Id = image.Id,
            ImageUrl = image.ImageUrl,
            ImageAlt = image.ImageAlt,
            DisplayOrder = image.DisplayOrder
        };
    }

    private static StorefrontCollectionBenefitDto MapCollectionBenefit(StorefrontCollectionBenefit benefit)
    {
        return new StorefrontCollectionBenefitDto
        {
            Id = benefit.Id,
            IconClass = benefit.IconClass,
            Title = benefit.Title,
            Text = benefit.Text,
            DisplayOrder = benefit.DisplayOrder
        };
    }

    private static string Clean(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? string.Empty : value.Trim();
    }
}