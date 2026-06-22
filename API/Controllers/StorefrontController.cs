using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class StorefrontController(IStorefrontContentService storefrontContentService) : BaseApiController
{
    // ===============================
    // Get Home content
    // Public endpoint used by the Home page.
    // Returns seeded/database Home content instead of hardcoded Angular data.
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
    // Get collection pages
    // Public endpoint used when Angular needs the available public collection pages.
    // ===============================
    [HttpGet("collections")]
    public async Task<ActionResult<IReadOnlyList<StorefrontCollectionPageDto>>> GetCollectionPages()
    {
        var pages = await storefrontContentService.GetCollectionPagesAsync();

        return Ok(pages);
    }

    // ===============================
    // Get collection page by key
    // Public endpoint used by Shop, New In, Leggings, Sports Bras, Tops, Sets, Shorts, and Accessories.
    // Page keys are internal content keys, not customer/admin editable slugs.
    // ===============================
    [HttpGet("collections/{pageKey}")]
    public async Task<ActionResult<StorefrontCollectionPageDto>> GetCollectionPage(string pageKey)
    {
        var page = await storefrontContentService.GetCollectionPageAsync(pageKey);

        if (page == null)
            return NotFound(new { message = "Collection page content has not been configured." });

        return Ok(page);
    }
}