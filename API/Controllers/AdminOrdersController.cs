using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Policy = "RequireAdminRole")]
public class AdminOrdersController(
    IOrderService orderService
) : BaseApiController
{
    // ===============================
    // Get admin orders
    // Admin can view and filter customer orders.
    // ===============================
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetOrders(
        [FromQuery] OrderParamsDto orderParams)
    {
        var orders = await orderService.GetAdminOrdersAsync(orderParams);

        return Ok(orders);
    }

    // ===============================
    // Get admin order by ID
    // Admin can view full order details.
    // ===============================
    [HttpGet("{orderId:int}")]
    public async Task<ActionResult<OrderDto>> GetOrder(int orderId)
    {
        var order = await orderService.GetAdminOrderByIdAsync(orderId);

        if (order == null)
            return NotFound(new { message = "Order not found." });

        return Ok(order);
    }

    // ===============================
    // Update order status
    // Admin updates fulfilment status.
    // ===============================
    [HttpPut("{orderId:int}/status")]
    public async Task<ActionResult<OrderDto>> UpdateOrderStatus(
        int orderId,
        UpdateOrderStatusDto dto)
    {
        try
        {
            var order = await orderService.UpdateOrderStatusAsync(orderId, dto);

            if (order == null)
                return NotFound(new { message = "Order not found." });

            return Ok(order);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}