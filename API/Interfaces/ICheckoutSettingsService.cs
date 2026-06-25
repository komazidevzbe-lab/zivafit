using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface ICheckoutSettingsService
{
    Task<StoreCheckoutSettings> GetActiveSettingsAsync();
    Task<CheckoutTotalsDto> CalculateTotalsAsync(decimal subtotalAmount);
}