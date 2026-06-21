using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Policy = "RequireAdminRole")]
public class AdminProductsController(
    IProductCatalogService productCatalogService,
    IPhotoService photoService
) : BaseApiController
{
    // ===============================
    // Get admin products
    // Admin receives active and inactive products.
    // ===============================
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProductListDto>>> GetProducts(
        [FromQuery] ProductParamsDto productParams)
    {
        var products = await productCatalogService.GetProductsAsync(
            productParams,
            includeInactive: true);

        return Ok(products);
    }

    // ===============================
    // Get admin product by ID
    // Used by admin edit screens after saving products, variants, or images.
    // ===============================
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await productCatalogService.GetProductByIdAsync(
            id,
            includeInactive: true);

        if (product == null)
            return NotFound(new { message = "Product not found." });

        return Ok(product);
    }

    // ===============================
    // Get admin categories
    // Used by admin product forms.
    // ===============================
    [HttpGet("categories")]
    public async Task<ActionResult<IReadOnlyList<ProductCategoryDto>>> GetCategories()
    {
        var categories = await productCatalogService.GetCategoriesAsync(includeInactive: true);

        return Ok(categories);
    }

    // ===============================
    // Create product
    // Admin creates product details first.
    // Product images are uploaded separately from the Images tab.
    // ===============================
    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto dto)
    {
        var product = await productCatalogService.CreateProductAsync(dto);

        return Ok(product);
    }

    // ===============================
    // Update product
    // Admin updates product details only.
    // Product image URLs are never typed or edited manually.
    // ===============================
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductDto>> UpdateProduct(int id, UpdateProductDto dto)
    {
        var product = await productCatalogService.UpdateProductAsync(id, dto);

        if (product == null)
            return NotFound(new { message = "Product not found." });

        return Ok(product);
    }

    // ===============================
    // Delete product
    // Admin deletes a product and its related variants/images.
    // ===============================
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var deleted = await productCatalogService.DeleteProductAsync(id);

        if (!deleted)
            return NotFound(new { message = "Product not found." });

        return Ok(new { message = "Product deleted successfully." });
    }

    // ===============================
    // Create product variant
    // Adds size/colour/stock/SKU to a product.
    // ===============================
    [HttpPost("{productId:int}/variants")]
    public async Task<ActionResult<ProductVariantDto>> CreateVariant(
        int productId,
        CreateProductVariantDto dto)
    {
        var variant = await productCatalogService.CreateVariantAsync(productId, dto);

        if (variant == null)
            return NotFound(new { message = "Product not found." });

        return Ok(variant);
    }

    // ===============================
    // Update product variant
    // Updates size/colour/stock/SKU for an existing variant.
    // ===============================
    [HttpPut("variants/{variantId:int}")]
    public async Task<ActionResult<ProductVariantDto>> UpdateVariant(
        int variantId,
        UpdateProductVariantDto dto)
    {
        var variant = await productCatalogService.UpdateVariantAsync(variantId, dto);

        if (variant == null)
            return NotFound(new { message = "Variant not found." });

        return Ok(variant);
    }

    // ===============================
    // Delete product variant
    // Removes one variant record.
    // ===============================
    [HttpDelete("variants/{variantId:int}")]
    public async Task<ActionResult> DeleteVariant(int variantId)
    {
        var deleted = await productCatalogService.DeleteVariantAsync(variantId);

        if (!deleted)
            return NotFound(new { message = "Variant not found." });

        return Ok(new { message = "Variant deleted successfully." });
    }

    // ===============================
    // Upload product image
    // Admin uploads an image from their device.
    // There is no endpoint for manually typing an image URL.
    // ===============================
    [HttpPost("{productId:int}/images/upload")]
    public async Task<ActionResult<ProductImageDto>> UploadImage(
        int productId,
        [FromForm] IFormFile file,
        [FromForm] string? imageAlt,
        [FromForm] bool isMain = false)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Image file is required." });

        var uploadResult = await photoService.UploadProductImageAsync(file);

        var image = await productCatalogService.CreateUploadedImageAsync(
            productId,
            uploadResult.Url,
            uploadResult.PublicId,
            string.IsNullOrWhiteSpace(imageAlt)
                ? "ZivaFit product image"
                : imageAlt.Trim(),
            isMain);

        if (image == null)
            return NotFound(new { message = "Product not found." });

        return Ok(image);
    }

    // ===============================
    // Update product image details
    // Admin can update alt text, display order, and main image status.
    // Admin cannot edit the stored image URL manually.
    // ===============================
    [HttpPut("images/{imageId:int}")]
    public async Task<ActionResult<ProductImageDto>> UpdateImage(
        int imageId,
        UpdateProductImageDto dto)
    {
        var image = await productCatalogService.UpdateImageAsync(imageId, dto);

        if (image == null)
            return NotFound(new { message = "Image not found." });

        return Ok(image);
    }

    // ===============================
    // Set main product image
    // Makes the selected image the main image used on product cards.
    // ===============================
    [HttpPut("images/{imageId:int}/main")]
    public async Task<ActionResult<ProductImageDto>> SetMainImage(int imageId)
    {
        var image = await productCatalogService.SetMainImageAsync(imageId);

        if (image == null)
            return NotFound(new { message = "Image not found." });

        return Ok(image);
    }

    // ===============================
    // Delete product image
    // Removes an image from the product.
    // ===============================
    [HttpDelete("images/{imageId:int}")]
    public async Task<ActionResult> DeleteImage(int imageId)
    {
        var deleted = await productCatalogService.DeleteImageAsync(imageId);

        if (!deleted)
            return NotFound(new { message = "Image not found." });

        return Ok(new { message = "Image deleted successfully." });
    }
}