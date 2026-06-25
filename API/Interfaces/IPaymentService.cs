using API.DTOs;

namespace API.Interfaces;

public interface IPaymentService
{
    Task<PayFastPaymentResponseDto> InitiatePayFastOrderPaymentAsync(int userId, InitiatePayFastPaymentDto dto);
    Task ProcessPayFastNotificationAsync(Dictionary<string, string> formFields);
    Task<bool> MarkPayFastOrderPaymentCancelledAsync(int userId, int orderId);
}