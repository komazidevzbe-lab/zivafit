using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class ProductCatalogService(
    DataContext context,
    IPhotoService photoService
) : IProductCatalogService
{
    // ===============================
    // Get products
    // Used by public Shop, New In, category pages, and admin product management.
    // Public requests only receive active products.
    // Admin requests can include inactive products.
    // ===============================
    public async Task<IReadOnlyList<ProductListDto>> GetProductsAsync(
        ProductParamsDto productParams,
        bool includeInactive = false)
    {
        var query = context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .AsQueryable();

        if (!includeInactive)
        {
            query = query.Where(p => p.IsActive && p.Category.IsActive);
        }

        query = ApplyProductFilters(query, productParams);
        query = ApplyProductSorting(query, productParams.Sort);

        var products = await query
            .AsNoTracking()
            .ToListAsync();

        return products.Select(MapProductToListDto).ToList();
    }

    // ===============================
    // Get product by ID
    // Used by Product Details and admin edit view.
    // Product details use IDs, not slugs.
    // ===============================
    public async Task<ProductDto?> GetProductByIdAsync(int id, bool includeInactive = false)
    {
        var query = context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .AsQueryable();

        if (!includeInactive)
        {
            query = query.Where(p => p.IsActive && p.Category.IsActive);
        }

        var product = await query
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return null;

        return MapProductToDto(product);
    }

    // ===============================
    // Get categories
    // Used by public category lists and admin category view.
    // ===============================
    public async Task<IReadOnlyList<ProductCategoryDto>> GetCategoriesAsync(bool includeInactive = false)
    {
        var query = context.ProductCategories.AsQueryable();

        if (!includeInactive)
        {
            query = query.Where(c => c.IsActive);
        }

        var categories = await query
            .OrderBy(c => c.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();

        return categories.Select(MapCategoryToDto).ToList();
    }

    // ===============================
    // Create product
    // Admin creates product details first.
    // Images are uploaded separately from the Images tab.
    // ===============================
    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
    {
        var category = await GetCategoryByNameAsync(dto.Category);

        if (category == null)
            throw new Exception($"Category '{dto.Category}' was not found.");

        var product = new Product
        {
            Name = dto.Name.Trim(),
            CategoryId = category.Id,
            FitType = dto.FitType.Trim(),
            Description = dto.Description.Trim(),
            Price = dto.Price,
            Colour = dto.Colour.Trim(),
            Badge = dto.Badge?.Trim() ?? string.Empty,
            IsNew = dto.IsNew,
            IsBestSeller = dto.IsBestSeller,
            IsFeatured = dto.IsFeatured,
            IsActive = dto.IsActive,
            DisplayOrder = dto.DisplayOrder,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        AddMissingSizeVariants(product, CleanSizes(dto.Sizes));

        context.Products.Add(product);

        await context.SaveChangesAsync();

        var createdProduct = await GetProductByIdAsync(product.Id, includeInactive: true);

        return createdProduct!;
    }

    // ===============================
    // Update product
    // Updates product details only.
    // Product image URLs are not typed or edited by admin.
    // ===============================
    public async Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto dto)
    {
        var product = await context.Products
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return null;

        var category = await GetCategoryByNameAsync(dto.Category);

        if (category == null)
            throw new Exception($"Category '{dto.Category}' was not found.");

        product.Name = dto.Name.Trim();
        product.CategoryId = category.Id;
        product.FitType = dto.FitType.Trim();
        product.Description = dto.Description.Trim();
        product.Price = dto.Price;
        product.Colour = dto.Colour.Trim();
        product.Badge = dto.Badge?.Trim() ?? string.Empty;
        product.IsNew = dto.IsNew;
        product.IsBestSeller = dto.IsBestSeller;
        product.IsFeatured = dto.IsFeatured;
        product.IsActive = dto.IsActive;
        product.DisplayOrder = dto.DisplayOrder;
        product.UpdatedAt = DateTime.UtcNow;

        AddMissingSizeVariants(product, CleanSizes(dto.Sizes));

        await context.SaveChangesAsync();

        return await GetProductByIdAsync(product.Id, includeInactive: true);
    }

    // ===============================
    // Delete product
    // Deletes product, variants, and images.
    // Uploaded Cloudinary images are also deleted when public IDs exist.
    // ===============================
    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await context.Products
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return false;

        foreach (var image in product.Images)
        {
            await photoService.DeleteProductImageAsync(image.PublicId);
        }

        context.Products.Remove(product);

        await context.SaveChangesAsync();

        return true;
    }

    // ===============================
    // Create variant
    // Adds a size, colour, SKU, and stock row to a product.
    // ===============================
    public async Task<ProductVariantDto?> CreateVariantAsync(int productId, CreateProductVariantDto dto)
    {
        var product = await context.Products.FindAsync(productId);

        if (product == null)
            return null;

        var variant = new ProductVariant
        {
            ProductId = productId,
            Size = dto.Size.Trim(),
            Colour = dto.Colour.Trim(),
            Sku = dto.Sku.Trim(),
            StockQuantity = dto.StockQuantity,
            IsActive = dto.IsActive
        };

        context.ProductVariants.Add(variant);

        await context.SaveChangesAsync();

        return MapVariantToDto(variant);
    }

    // ===============================
    // Update variant
    // Updates an existing size/colour/SKU/stock row.
    // ===============================
    public async Task<ProductVariantDto?> UpdateVariantAsync(int variantId, UpdateProductVariantDto dto)
    {
        var variant = await context.ProductVariants.FindAsync(variantId);

        if (variant == null)
            return null;

        variant.Size = dto.Size.Trim();
        variant.Colour = dto.Colour.Trim();
        variant.Sku = dto.Sku.Trim();
        variant.StockQuantity = dto.StockQuantity;
        variant.IsActive = dto.IsActive;

        await context.SaveChangesAsync();

        return MapVariantToDto(variant);
    }

    // ===============================
    // Delete variant
    // Removes one product variant.
    // ===============================
    public async Task<bool> DeleteVariantAsync(int variantId)
    {
        var variant = await context.ProductVariants.FindAsync(variantId);

        if (variant == null)
            return false;

        context.ProductVariants.Remove(variant);

        await context.SaveChangesAsync();

        return true;
    }

    // ===============================
    // Create uploaded image
    // Attaches an uploaded Cloudinary image to a product.
    // Admin uploads files and never types image URLs manually.
    // ===============================
    public async Task<ProductImageDto?> CreateUploadedImageAsync(
        int productId,
        string imageUrl,
        string? publicId,
        string imageAlt,
        bool isMain)
    {
        var product = await context.Products
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == productId);

        if (product == null)
            return null;

        var shouldBeMain = isMain || !product.Images.Any();

        if (shouldBeMain)
        {
            foreach (var existingImage in product.Images)
            {
                existingImage.IsMain = false;
            }
        }

        var nextDisplayOrder = product.Images.Any()
            ? product.Images.Max(i => i.DisplayOrder) + 1
            : 1;

        var image = new ProductImage
        {
            ProductId = productId,
            ImageUrl = imageUrl.Trim(),
            ImageAlt = string.IsNullOrWhiteSpace(imageAlt) ? product.Name : imageAlt.Trim(),
            PublicId = publicId,
            DisplayOrder = nextDisplayOrder,
            IsMain = shouldBeMain
        };

        context.ProductImages.Add(image);

        await context.SaveChangesAsync();

        return MapImageToDto(image);
    }

    // ===============================
    // Update image
    // Updates alt text, display order, and main-image flag only.
    // Image URL is intentionally not editable by admin.
    // ===============================
    public async Task<ProductImageDto?> UpdateImageAsync(int imageId, UpdateProductImageDto dto)
    {
        var image = await context.ProductImages
            .Include(i => i.Product)
            .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(i => i.Id == imageId);

        if (image == null)
            return null;

        image.ImageAlt = dto.ImageAlt.Trim();
        image.DisplayOrder = dto.DisplayOrder;

        if (dto.IsMain)
        {
            foreach (var existingImage in image.Product.Images)
            {
                existingImage.IsMain = false;
            }

            image.IsMain = true;
        }

        await context.SaveChangesAsync();

        return MapImageToDto(image);
    }

    // ===============================
    // Set main image
    // Makes one image the main image for public product cards.
    // ===============================
    public async Task<ProductImageDto?> SetMainImageAsync(int imageId)
    {
        var image = await context.ProductImages
            .Include(i => i.Product)
            .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(i => i.Id == imageId);

        if (image == null)
            return null;

        foreach (var existingImage in image.Product.Images)
        {
            existingImage.IsMain = false;
        }

        image.IsMain = true;

        await context.SaveChangesAsync();

        return MapImageToDto(image);
    }

    // ===============================
    // Delete image
    // Deletes one product image.
    // If the deleted image was main, the next available image becomes main.
    // ===============================
    public async Task<bool> DeleteImageAsync(int imageId)
    {
        var image = await context.ProductImages
            .Include(i => i.Product)
            .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(i => i.Id == imageId);

        if (image == null)
            return false;

        var product = image.Product;
        var wasMain = image.IsMain;

        await photoService.DeleteProductImageAsync(image.PublicId);

        context.ProductImages.Remove(image);

        await context.SaveChangesAsync();

        if (wasMain)
        {
            var nextImage = await context.ProductImages
                .Where(i => i.ProductId == product.Id)
                .OrderBy(i => i.DisplayOrder)
                .FirstOrDefaultAsync();

            if (nextImage != null)
            {
                nextImage.IsMain = true;
                await context.SaveChangesAsync();
            }
        }

        return true;
    }

    private async Task<ProductCategory?> GetCategoryByNameAsync(string categoryName)
    {
        var cleanName = categoryName.Trim();

        return await context.ProductCategories
            .FirstOrDefaultAsync(c => c.Name == cleanName);
    }

    private static IQueryable<Product> ApplyProductFilters(
        IQueryable<Product> query,
        ProductParamsDto productParams)
    {
        if (!string.IsNullOrWhiteSpace(productParams.Category))
        {
            var category = productParams.Category.Trim();
            query = query.Where(p => p.Category.Name == category);
        }

        if (!string.IsNullOrWhiteSpace(productParams.Search))
        {
            var search = productParams.Search.Trim().ToLower();

            query = query.Where(p =>
                p.Name.ToLower().Contains(search) ||
                p.Description.ToLower().Contains(search) ||
                p.FitType.ToLower().Contains(search) ||
                p.Colour.ToLower().Contains(search) ||
                p.Category.Name.ToLower().Contains(search));
        }

        if (productParams.IsNew.HasValue)
            query = query.Where(p => p.IsNew == productParams.IsNew.Value);

        if (productParams.IsBestSeller.HasValue)
            query = query.Where(p => p.IsBestSeller == productParams.IsBestSeller.Value);

        if (productParams.IsFeatured.HasValue)
            query = query.Where(p => p.IsFeatured == productParams.IsFeatured.Value);

        return query;
    }

    private static IQueryable<Product> ApplyProductSorting(
        IQueryable<Product> query,
        string? sort)
    {
        return sort switch
        {
            "priceLow" => query.OrderBy(p => p.Price).ThenBy(p => p.DisplayOrder),
            "priceHigh" => query.OrderByDescending(p => p.Price).ThenBy(p => p.DisplayOrder),
            "name" => query.OrderBy(p => p.Name),
            _ => query.OrderByDescending(p => p.IsFeatured)
                .ThenByDescending(p => p.IsBestSeller)
                .ThenBy(p => p.DisplayOrder)
        };
    }

    private static ProductListDto MapProductToListDto(Product product)
    {
        var images = product.Images
            .OrderByDescending(i => i.IsMain)
            .ThenBy(i => i.DisplayOrder)
            .ToList();

        var mainImage = images.FirstOrDefault();

        var activeVariants = product.Variants
            .Where(v => v.IsActive)
            .OrderBy(v => OrderSize(v.Size))
            .ThenBy(v => v.Size)
            .ToList();

        return new ProductListDto
        {
            Id = product.Id,
            Name = product.Name,
            Category = product.Category.Name,
            FitType = product.FitType,
            Price = product.Price,
            PriceText = FormatPrice(product.Price),
            Colour = product.Colour,
            Badge = product.Badge,
            ImageUrl = mainImage?.ImageUrl ?? string.Empty,
            ImageAlt = mainImage?.ImageAlt ?? product.Name,
            Sizes = activeVariants
                .Select(v => v.Size)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray(),
            IsNew = product.IsNew,
            IsBestSeller = product.IsBestSeller,
            IsFeatured = product.IsFeatured,
            IsActive = product.IsActive,
            DisplayOrder = product.DisplayOrder,
            TotalStock = activeVariants.Sum(v => v.StockQuantity)
        };
    }

    private static ProductDto MapProductToDto(Product product)
    {
        var listDto = MapProductToListDto(product);

        return new ProductDto
        {
            Id = listDto.Id,
            Name = listDto.Name,
            Category = listDto.Category,
            FitType = listDto.FitType,
            Description = product.Description,
            Price = listDto.Price,
            PriceText = listDto.PriceText,
            Colour = listDto.Colour,
            Badge = listDto.Badge,
            ImageUrl = listDto.ImageUrl,
            ImageAlt = listDto.ImageAlt,
            Sizes = listDto.Sizes,
            IsNew = listDto.IsNew,
            IsBestSeller = listDto.IsBestSeller,
            IsFeatured = listDto.IsFeatured,
            IsActive = listDto.IsActive,
            DisplayOrder = listDto.DisplayOrder,
            TotalStock = listDto.TotalStock,
            Images = product.Images
                .OrderByDescending(i => i.IsMain)
                .ThenBy(i => i.DisplayOrder)
                .Select(MapImageToDto)
                .ToList(),
            Variants = product.Variants
                .OrderBy(v => OrderSize(v.Size))
                .ThenBy(v => v.Size)
                .Select(MapVariantToDto)
                .ToList()
        };
    }

    private static ProductCategoryDto MapCategoryToDto(ProductCategory category)
    {
        return new ProductCategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ImageUrl = category.ImageUrl,
            ImageAlt = category.ImageAlt,
            DisplayOrder = category.DisplayOrder,
            ShowInNavbar = category.ShowInNavbar,
            IsActive = category.IsActive
        };
    }

    private static ProductVariantDto MapVariantToDto(ProductVariant variant)
    {
        return new ProductVariantDto
        {
            Id = variant.Id,
            ProductId = variant.ProductId,
            Size = variant.Size,
            Colour = variant.Colour,
            Sku = variant.Sku,
            StockQuantity = variant.StockQuantity,
            IsActive = variant.IsActive
        };
    }

    private static ProductImageDto MapImageToDto(ProductImage image)
    {
        return new ProductImageDto
        {
            Id = image.Id,
            ProductId = image.ProductId,
            ImageUrl = image.ImageUrl,
            ImageAlt = image.ImageAlt,
            DisplayOrder = image.DisplayOrder,
            IsMain = image.IsMain
        };
    }

    private static void AddMissingSizeVariants(Product product, string[] cleanedSizes)
    {
        if (cleanedSizes.Length == 0)
            return;

        var existingSizes = product.Variants
            .Select(v => v.Size)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var size in cleanedSizes.Where(size => !existingSizes.Contains(size)))
        {
            product.Variants.Add(new ProductVariant
            {
                ProductId = product.Id,
                Size = size,
                Colour = product.Colour,
                Sku = CreateSku(product.Name, product.Colour, size),
                StockQuantity = 10,
                IsActive = true
            });
        }
    }

    private static string[] CleanSizes(string[] sizes)
    {
        return sizes
            .Where(size => !string.IsNullOrWhiteSpace(size))
            .Select(size => size.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();
    }

    private static string CreateSku(string name, string colour, string size)
    {
        static string Clean(string value)
        {
            var clean = new string(value
                .Where(char.IsLetterOrDigit)
                .Take(8)
                .ToArray());

            return string.IsNullOrWhiteSpace(clean) ? "ZVF" : clean.ToUpperInvariant();
        }

        return $"ZVF-{Clean(name)}-{Clean(colour)}-{Clean(size)}-{Guid.NewGuid().ToString("N")[..5].ToUpperInvariant()}";
    }

    private static string FormatPrice(decimal price)
    {
        return $"R{price.ToString("N0").Replace(",", " ")}";
    }

    private static int OrderSize(string size)
    {
        return size.ToUpperInvariant() switch
        {
            "XXS" => 1,
            "XS" => 2,
            "S" => 3,
            "M" => 4,
            "L" => 5,
            "XL" => 6,
            "XXL" => 7,
            "ONE SIZE" => 8,
            _ => 99
        };
    }
}