using API.DTOs;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Policy = "RequireCustomerRole")]
public class CartController(
    ICartService cartService
) : BaseApiController
{
    // ===============================
    // Get cart
    // Returns the logged-in customer's database cart.
    // ===============================
    [HttpGet]
    public async Task<ActionResult<CartDto>> GetCart()
    {
        var userId = int.Parse(User.GetUserId());

        var cart = await cartService.GetCartAsync(userId);

        return Ok(cart);
    }

    // ===============================
    // Add cart item
    // Adds a selected product variant to the customer's cart.
    // ===============================
    [HttpPost("items")]
    public async Task<ActionResult<CartDto>> AddItem(AddCartItemDto dto)
    {
        try
        {
            var userId = int.Parse(User.GetUserId());

            var cart = await cartService.AddItemAsync(userId, dto);

            return Ok(cart);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ===============================
    // Update cart item
    // Updates cart item quantity.
    // ===============================
    [HttpPut("items/{cartItemId:int}")]
    public async Task<ActionResult<CartDto>> UpdateItem(
        int cartItemId,
        UpdateCartItemDto dto)
    {
        try
        {
            var userId = int.Parse(User.GetUserId());

            var cart = await cartService.UpdateItemAsync(userId, cartItemId, dto);

            if (cart == null)
                return NotFound(new { message = "Cart item not found." });

            return Ok(cart);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ===============================
    // Remove cart item
    // Removes one item from the customer's cart.
    // ===============================
    [HttpDelete("items/{cartItemId:int}")]
    public async Task<ActionResult<CartDto>> RemoveItem(int cartItemId)
    {
        var userId = int.Parse(User.GetUserId());

        var removed = await cartService.RemoveItemAsync(userId, cartItemId);

        if (!removed)
            return NotFound(new { message = "Cart item not found." });

        var cart = await cartService.GetCartAsync(userId);

        return Ok(cart);
    }

    // ===============================
    // Clear cart
    // Removes all cart items for the logged-in customer.
    // ===============================
    [HttpDelete]
    public async Task<ActionResult<CartDto>> ClearCart()
    {
        var userId = int.Parse(User.GetUserId());

        await cartService.ClearCartAsync(userId);

        var cart = await cartService.GetCartAsync(userId);

        return Ok(cart);
    }
}