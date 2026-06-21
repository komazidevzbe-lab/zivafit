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
    // Admin uploads a file from their device instead of typing an image URL.
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
    // Updates Home benefit text and icon class.
    // ===============================
    [HttpPut("benefits/{benefitId:int}")]
    public async Task<ActionResult<StorefrontBenefitItemDto>> UpdateBenefitItem(
        int benefitId,
        UpdateStorefrontBenefitItemDto dto)
    {
        var benefit = await storefrontContentService.UpdateBenefitItemAsync(benefitId, dto);

        if (benefit == null)
            return NotFound(new { message = "Benefit item not found." });

        return Ok(benefit);
    }
}