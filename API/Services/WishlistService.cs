using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class WishlistService(DataContext context) : IWishlistService
{
    // ===============================
    // Get wishlist
    // Returns products saved by the logged-in customer.
    // ===============================
    public async Task<IReadOnlyList<WishlistItemDto>> GetWishlistAsync(int userId)
    {
        var wishlistItems = await context.WishlistItems
            .Include(w => w.Product)
                .ThenInclude(p => p.Category)
            .Include(w => w.Product)
                .ThenInclude(p => p.Images)
            .Where(w => w.AppUserId == userId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();

        return wishlistItems.Select(MapWishlistItemToDto).ToList();
    }

    // ===============================
    // Add wishlist item
    // Saves a product to the logged-in customer's wishlist.
    // ===============================
    public async Task<WishlistItemDto?> AddItemAsync(int userId, int productId)
    {
        var product = await context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == productId && p.IsActive);

        if (product == null)
            return null;

        var existingItem = await context.WishlistItems
            .Include(w => w.Product)
                .ThenInclude(p => p.Category)
            .Include(w => w.Product)
                .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(w =>
                w.AppUserId == userId &&
                w.ProductId == productId);

        if (existingItem != null)
            return MapWishlistItemToDto(existingItem);

        var wishlistItem = new WishlistItem
        {
            AppUserId = userId,
            ProductId = productId,
            CreatedAt = DateTime.UtcNow
        };

        context.WishlistItems.Add(wishlistItem);
        await context.SaveChangesAsync();

        wishlistItem.Product = product;

        return MapWishlistItemToDto(wishlistItem);
    }

    // ===============================
    // Remove wishlist item
    // Removes a product from the logged-in customer's wishlist.
    // ===============================
    public async Task<bool> RemoveItemAsync(int userId, int productId)
    {
        var wishlistItem = await context.WishlistItems
            .FirstOrDefaultAsync(w =>
                w.AppUserId == userId &&
                w.ProductId == productId);

        if (wishlistItem == null)
            return false;

        context.WishlistItems.Remove(wishlistItem);
        await context.SaveChangesAsync();

        return true;
    }

    private static WishlistItemDto MapWishlistItemToDto(WishlistItem wishlistItem)
    {
        var mainImage = wishlistItem.Product.Images
            .OrderByDescending(i => i.IsMain)
            .ThenBy(i => i.DisplayOrder)
            .FirstOrDefault();

        return new WishlistItemDto
        {
            Id = wishlistItem.Id,
            ProductId = wishlistItem.ProductId,
            Name = wishlistItem.Product.Name,
            Category = wishlistItem.Product.Category.Name,
            FitType = wishlistItem.Product.FitType,
            Price = wishlistItem.Product.Price,
            PriceText = FormatPrice(wishlistItem.Product.Price),
            Colour = wishlistItem.Product.Colour,
            Badge = wishlistItem.Product.Badge,
            ImageUrl = mainImage?.ImageUrl ?? "assets/product-placeholder.png",
            ImageAlt = mainImage?.ImageAlt ?? wishlistItem.Product.Name,
            IsNew = wishlistItem.Product.IsNew,
            IsBestSeller = wishlistItem.Product.IsBestSeller,
            IsFeatured = wishlistItem.Product.IsFeatured,
            CreatedAt = wishlistItem.CreatedAt
        };
    }

    private static string FormatPrice(decimal price)
    {
        return $"R{price:0.00}";
    }
}