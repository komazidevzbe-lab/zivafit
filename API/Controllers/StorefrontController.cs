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
}