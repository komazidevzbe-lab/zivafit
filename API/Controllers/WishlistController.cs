using API.DTOs;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Policy = "RequireCustomerRole")]
public class WishlistController(
    IWishlistService wishlistService
) : BaseApiController
{
    // ===============================
    // Get wishlist
    // Returns the logged-in customer's saved products.
    // ===============================
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<WishlistItemDto>>> GetWishlist()
    {
        var userId = int.Parse(User.GetUserId());

        var wishlist = await wishlistService.GetWishlistAsync(userId);

        return Ok(wishlist);
    }

    // ===============================
    // Add wishlist item
    // Saves a product to the customer's wishlist.
    // ===============================
    [HttpPost("{productId:int}")]
    public async Task<ActionResult<WishlistItemDto>> AddItem(int productId)
    {
        var userId = int.Parse(User.GetUserId());

        var wishlistItem = await wishlistService.AddItemAsync(userId, productId);

        if (wishlistItem == null)
            return NotFound(new { message = "Product not found." });

        return Ok(wishlistItem);
    }

    // ===============================
    // Remove wishlist item
    // Removes a product from the customer's wishlist.
    // ===============================
    [HttpDelete("{productId:int}")]
    public async Task<ActionResult> RemoveItem(int productId)
    {
        var userId = int.Parse(User.GetUserId());

        var removed = await wishlistService.RemoveItemAsync(userId, productId);

        if (!removed)
            return NotFound(new { message = "Wishlist item not found." });

        return Ok(new { message = "Product removed from wishlist." });
    }
}