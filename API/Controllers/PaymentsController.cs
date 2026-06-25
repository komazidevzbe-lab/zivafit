using API.DTOs;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class PaymentsController(
    IPaymentService paymentService,
    ILogger<PaymentsController> logger
) : BaseApiController
{
    // ===============================
    // Initiate PayFast order payment
    // Authenticated customer starts PayFast payment for a pending order.
    // ===============================
    [Authorize(Policy = "RequireCustomerRole")]
    [HttpPost("payfast/initiate")]
    public async Task<ActionResult<PayFastPaymentResponseDto>> InitiatePayFastPayment(
        InitiatePayFastPaymentDto dto)
    {
        try
        {
            var userId = int.Parse(User.GetUserId());

            var payment = await paymentService.InitiatePayFastOrderPaymentAsync(userId, dto);

            return Ok(payment);
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogWarning(ex, "PayFast initiation failed because the order was not found.");

            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            logger.LogWarning(ex, "PayFast initiation failed because the request was invalid.");

            return BadRequest(new { message = ex.Message });
        }
    }

    // ===============================
    // PayFast notify
    // Anonymous because PayFast calls this endpoint directly.
    // This is the source of truth for marking orders as paid/failed/cancelled.
    // ===============================
    [AllowAnonymous]
    [HttpPost("payfast/notify")]
    public async Task<ActionResult> PayFastNotify()
    {
        if (!Request.HasFormContentType)
            return BadRequest(new { message = "PayFast notify request must be form content." });

        var formFields = Request.Form.ToDictionary(
            item => item.Key,
            item => item.Value.ToString());

        try
        {
            await paymentService.ProcessPayFastNotificationAsync(formFields);

            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogWarning(
                ex,
                "PayFast notify could not find the matching order. PayFast fields: {@PayFastFields}",
                GetSafePayFastLogFields(formFields));

            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            logger.LogWarning(
                ex,
                "PayFast notify was rejected by validation. PayFast fields: {@PayFastFields}",
                GetSafePayFastLogFields(formFields));

            return BadRequest(new { message = ex.Message });
        }
    }

    // ===============================
    // Cancel PayFast order payment
    // Authenticated customer cancels a pending payment order.
    // ===============================
    [Authorize(Policy = "RequireCustomerRole")]
    [HttpPost("payfast/cancel/{orderId:int}")]
    public async Task<ActionResult> CancelPayFastPayment(int orderId)
    {
        try
        {
            var userId = int.Parse(User.GetUserId());

            var cancelled = await paymentService.MarkPayFastOrderPaymentCancelledAsync(userId, orderId);

            if (!cancelled)
                return NotFound(new { message = "Order not found." });

            return Ok(new { message = "Payment cancelled successfully." });
        }
        catch (ArgumentException ex)
        {
            logger.LogWarning(ex, "PayFast cancellation failed because the request was invalid.");

            return BadRequest(new { message = ex.Message });
        }
    }

    private static Dictionary<string, string> GetSafePayFastLogFields(
        Dictionary<string, string> formFields)
    {
        return formFields.ToDictionary(
            field => field.Key,
            field =>
            {
                var key = field.Key.ToLowerInvariant();

                if (key.Contains("signature") || key.Contains("key") || key.Contains("passphrase"))
                    return "[hidden]";

                return field.Value;
            });
    }
}