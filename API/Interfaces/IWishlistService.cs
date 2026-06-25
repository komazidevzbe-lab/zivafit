using API.DTOs;

namespace API.Interfaces;

public interface IWishlistService
{
    Task<IReadOnlyList<WishlistItemDto>> GetWishlistAsync(int userId);
    Task<WishlistItemDto?> AddItemAsync(int userId, int productId);
    Task<bool> RemoveItemAsync(int userId, int productId);
}