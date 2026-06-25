using API.DTOs;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Policy = "RequireCustomerRole")]
public class OrdersController(
    IOrderService orderService
) : BaseApiController
{
    // ===============================
    // Create order from cart
    // Creates a pending-payment order from the logged-in customer's cart.
    // ===============================
    [HttpPost("checkout")]
    public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto dto)
    {
        try
        {
            var userId = int.Parse(User.GetUserId());

            var order = await orderService.CreateOrderFromCartAsync(userId, dto);

            return Ok(order);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ===============================
    // Get my orders
    // Returns orders for the logged-in customer.
    // ===============================
    [HttpGet("my-orders")]
    public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetMyOrders()
    {
        var userId = int.Parse(User.GetUserId());

        var orders = await orderService.GetUserOrdersAsync(userId);

        return Ok(orders);
    }

    // ===============================
    // Get my order by ID
    // Returns one order if it belongs to the logged-in customer.
    // ===============================
    [HttpGet("{orderId:int}")]
    public async Task<ActionResult<OrderDto>> GetMyOrder(int orderId)
    {
        var userId = int.Parse(User.GetUserId());

        var order = await orderService.GetUserOrderByIdAsync(userId, orderId);

        if (order == null)
            return NotFound(new { message = "Order not found." });

        return Ok(order);
    }
}