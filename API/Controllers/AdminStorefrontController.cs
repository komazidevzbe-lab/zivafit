using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Policy = "RequireAdminRole")]
public class AdminStorefrontController(
    IStorefrontContentService storefrontContentService
) : BaseApiController
{
    // ===============================
    // Get Home content for admin
    // Admin edits content values only.
    // Routes and navigation remain controlled by Angular routes and backend APIs.
    // ===============================
    [HttpGet("home")]
    public async Task<ActionResult<StorefrontHomeContentDto>> GetHomeContent()
    {
        var homeContent = await storefrontContentService.GetHomeContentAsync();

        if (homeContent == null)
            return NotFound(new { message = "Home content has not been configured." });

        return Ok(homeContent);
    }

    // ===============================
    // Update Home content
    // Updates copy and labels only.
    // Button routes are intentionally not accepted from admin.
    // ===============================
    [HttpPut("home")]
    public async Task<ActionResult<StorefrontHomeContentDto>> UpdateHomeContent(
        UpdateStorefrontHomeContentDto dto)
    {
        var homeContent = await storefrontContentService.UpdateHomeContentAsync(dto);

        if (homeContent == null)
            return NotFound(new { message = "Home content has not been configured." });

        return Ok(homeContent);
    }

    // ===============================
    // Get collection pages for admin
    // Admin sees seeded public collection pages from the database.
    // ===============================
    [HttpGet("collections")]
    public async Task<ActionResult<IReadOnlyList<StorefrontCollectionPageDto>>> GetCollectionPages()
    {
        var pages = await storefrontContentService.GetCollectionPagesAsync(includeInactive: true);

        return Ok(pages);
    }

    // ===============================
    // Get collection page by page key
    // Page key is an internal content key, not a slug field for admin editing.
    // ===============================
    [HttpGet("collections/{pageKey}")]
    public async Task<ActionResult<StorefrontCollectionPageDto>> GetCollectionPage(string pageKey)
    {
        var page = await storefrontContentService.GetCollectionPageAsync(
            pageKey,
            includeInactive: true);

        if (page == null)
            return NotFound(new { message = "Collection page content was not found." });

        return Ok(page);
    }

    // ===============================
    // Update collection page content
    // Updates public collection page text only.
    // Page key, mode, category, and routes are not editable here.
    // ===============================
    [HttpPut("collection-pages/{collectionPageId:int}")]
    public async Task<ActionResult<StorefrontCollectionPageDto>> UpdateCollectionPage(
        int collectionPageId,
        UpdateStorefrontCollectionPageDto dto)
    {
        var page = await storefrontContentService.UpdateCollectionPageAsync(collectionPageId, dto);

        if (page == null)
            return NotFound(new { message = "Collection page content was not found." });

        return Ok(page);
    }

    // ===============================
    // Update collection hero point
    // Updates icon and label for one collection hero point.
    // ===============================
    [HttpPut("collection-hero-points/{heroPointId:int}")]
    public async Task<ActionResult<StorefrontCollectionHeroPointDto>> UpdateCollectionHeroPoint(
        int heroPointId,
        UpdateStorefrontCollectionHeroPointDto dto)
    {
        var point = await storefrontContentService.UpdateCollectionHeroPointAsync(heroPointId, dto);

        if (point == null)
            return NotFound(new { message = "Collection hero point was not found." });

        return Ok(point);
    }

    // ===============================
    // Update collection hero image
    // Updates alt text only.
    // Admin cannot type or edit image URLs manually.
    // ===============================
    [HttpPut("collection-hero-images/{heroImageId:int}")]
    public async Task<ActionResult<StorefrontCollectionHeroImageDto>> UpdateCollectionHeroImage(
        int heroImageId,
        UpdateStorefrontCollectionHeroImageDto dto)
    {
        var image = await storefrontContentService.UpdateCollectionHeroImageAsync(heroImageId, dto);

        if (image == null)
            return NotFound(new { message = "Collection hero image was not found." });

        return Ok(image);
    }

    // ===============================
    // Upload collection hero image
    // Admin uploads a replacement file instead of typing image URLs.
    // ===============================
    [HttpPost("collection-hero-images/{heroImageId:int}/image/upload")]
    public async Task<ActionResult<StorefrontCollectionHeroImageDto>> UploadCollectionHeroImage(
        int heroImageId,
        [FromForm] IFormFile file,
        [FromForm] string? imageAlt)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Image file is required." });

        var image = await storefrontContentService.UploadCollectionHeroImageAsync(
            heroImageId,
            file,
            imageAlt);

        if (image == null)
            return NotFound(new { message = "Collection hero image was not found." });

        return Ok(image);
    }

    // ===============================
    // Update collection benefit
    // Updates a benefit card used by one public collection page.
    // ===============================
    [HttpPut("collection-benefits/{collectionBenefitId:int}")]
    public async Task<ActionResult<StorefrontCollectionBenefitDto>> UpdateCollectionBenefit(
        int collectionBenefitId,
        UpdateStorefrontCollectionBenefitDto dto)
    {
        var benefit = await storefrontContentService.UpdateCollectionBenefitAsync(
            collectionBenefitId,
            dto);

        if (benefit == null)
            return NotFound(new { message = "Collection benefit was not found." });

        return Ok(benefit);
    }

    // ===============================
    // Update hero card
    // Updates title and alt text only.
    // Image file replacement uses the upload endpoint.
    // ===============================
    [HttpPut("hero-cards/{heroCardId:int}")]
    public async Task<ActionResult<StorefrontHeroCardDto>> UpdateHeroCard(
        int heroCardId,
        UpdateStorefrontHeroCardDto dto)
    {
        var heroCard = await storefrontContentService.UpdateHeroCardAsync(heroCardId, dto);

        if (heroCard == null)
            return NotFound(new { message = "Hero card not found." });

        return Ok(heroCard);
    }

    // ===============================
    // Upload hero card image
    // Admin uploads a file from their device instead of typing an image URL.
    // ===============================
    [HttpPost("hero-cards/{heroCardId:int}/image/upload")]
    public async Task<ActionResult<StorefrontHeroCardDto>> UploadHeroCardImage(
        int heroCardId,
        [FromForm] IFormFile file,
        [FromForm] string? imageAlt)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Image file is required." });

        var heroCard = await storefrontContentService.UploadHeroCardImageAsync(
            heroCardId,
            file,
            imageAlt);

        if (heroCard == null)
            return NotFound(new { message = "Hero card not found." });

        return Ok(heroCard);
    }

    // ===============================
    // Update category card image
    // Updates image alt text only.
    // Admin cannot manually type or edit image URLs.
    // ===============================
    [HttpPut("category-card-images/{imageId:int}")]
    public async Task<ActionResult<StorefrontCategoryCardImageDto>> UpdateCategoryCardImage(
        int imageId,
        UpdateStorefrontCategoryCardImageDto dto)
    {
        var image = await storefrontContentService.UpdateCategoryCardImageAsync(imageId, dto);

        if (image == null)
            return NotFound(new { message = "Category image not found." });

        return Ok(image);
    }

    // ===============================
    // Upload category card image
    // Admin uploads a replacement image file for Home category cards.
    // ===============================
    [HttpPost("category-card-images/{imageId:int}/image/upload")]
    public async Task<ActionResult<StorefrontCategoryCardImageDto>> UploadCategoryCardImage(
        int imageId,
        [FromForm] IFormFile file,
        [FromForm] string? imageAlt)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Image file is required." });

        var image = await storefrontContentService.UploadCategoryCardImageAsync(
            imageId,
            file,
            imageAlt);

        if (image == null)
            return NotFound(new { message = "Category image not found." });

        return Ok(image);
    }

    // ===============================
    // Update benefit item
    // Updates one Home benefit item.
    // ===============================
    [HttpPut("benefits/{benefitId:int}")]
    public async Task<ActionResult<StorefrontBenefitItemDto>> UpdateBenefit(
        int benefitId,
        UpdateStorefrontBenefitItemDto dto)
    {
        var benefit = await storefrontContentService.UpdateBenefitItemAsync(benefitId, dto);

        if (benefit == null)
            return NotFound(new { message = "Benefit item not found." });

        return Ok(benefit);
    }
}