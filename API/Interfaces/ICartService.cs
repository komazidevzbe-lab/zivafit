using API.DTOs;

namespace API.Interfaces;

public interface ICartService
{
    Task<CartDto> GetCartAsync(int userId);
    Task<CartDto> AddItemAsync(int userId, AddCartItemDto dto);
    Task<CartDto?> UpdateItemAsync(int userId, int cartItemId, UpdateCartItemDto dto);
    Task<bool> RemoveItemAsync(int userId, int cartItemId);
    Task ClearCartAsync(int userId);
}