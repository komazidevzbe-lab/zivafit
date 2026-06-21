using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProductsController(IProductCatalogService productCatalogService) : BaseApiController
{
    // ===============================
    // Get products
    // Public endpoint used by Shop and category collection pages.
    // Supports query filters like category, search, sort, isNew, isBestSeller, and isFeatured.
    // ===============================
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProductListDto>>> GetProducts(
        [FromQuery] ProductParamsDto productParams)
    {
        var products = await productCatalogService.GetProductsAsync(productParams);

        return Ok(products);
    }

    // ===============================
    // Get product by ID
    // Public endpoint used by Product Details.
    // Product details uses ID route params, not slugs.
    // ===============================
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await productCatalogService.GetProductByIdAsync(id);

        if (product == null)
            return NotFound(new { message = "Product not found." });

        return Ok(product);
    }

    // ===============================
    // Get new products
    // Public endpoint used by New In page.
    // ===============================
    [HttpGet("new")]
    public async Task<ActionResult<IReadOnlyList<ProductListDto>>> GetNewProducts()
    {
        var products = await productCatalogService.GetProductsAsync(new ProductParamsDto
        {
            IsNew = true
        });

        return Ok(products);
    }

    // ===============================
    // Get best sellers
    // Public endpoint used by Home best sellers and public collection cards.
    // ===============================
    [HttpGet("best-sellers")]
    public async Task<ActionResult<IReadOnlyList<ProductListDto>>> GetBestSellers()
    {
        var products = await productCatalogService.GetProductsAsync(new ProductParamsDto
        {
            IsBestSeller = true
        });

        return Ok(products);
    }

    // ===============================
    // Get featured products
    // Public endpoint used by featured product sections.
    // ===============================
    [HttpGet("featured")]
    public async Task<ActionResult<IReadOnlyList<ProductListDto>>> GetFeaturedProducts()
    {
        var products = await productCatalogService.GetProductsAsync(new ProductParamsDto
        {
            IsFeatured = true
        });

        return Ok(products);
    }

    // ===============================
    // Get product categories
    // Public endpoint for active product categories.
    // ===============================
    [HttpGet("categories")]
    public async Task<ActionResult<IReadOnlyList<ProductCategoryDto>>> GetCategories()
    {
        var categories = await productCatalogService.GetCategoriesAsync();

        return Ok(categories);
    }
}