using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.SeedData;

public static class SeedProductCatalog
{
    // ===============================
    // Seed product catalogue
    // Creates the starter ecommerce categories, products, variants, and product images.
    // Product seed data is used so the frontend does not need hardcoded product data.
    // ===============================
    public static async Task SeedAsync(DataContext context)
    {
        await SeedCategoriesAsync(context);

        if (await context.Products.AnyAsync())
            return;

        var categories = await context.ProductCategories.ToListAsync();

        var products = new List<Product>
        {
            CreateProduct(
                "Cocoa Sculpt High-Waist Leggings",
                FindCategory(categories, "Leggings"),
                "High-Waist",
                "Soft sculpting leggings with a secure high-rise fit for training and everyday movement.",
                699,
                "Cocoa",
                "Best Seller",
                "assets/leggings1.png",
                "ZivaFit cocoa high-waist leggings",
                ["XS", "S", "M", "L", "XL", "XXL"],
                isNew: true,
                isBestSeller: true,
                isFeatured: true,
                displayOrder: 1),

            CreateProduct(
                "Black Pocket Training Leggings",
                FindCategory(categories, "Leggings"),
                "Pocket",
                "Supportive black leggings with side pocket detail and a smooth training fit.",
                749,
                "Black",
                "New In",
                "assets/leggings2.png",
                "ZivaFit black pocket leggings",
                ["XS", "S", "M", "L", "XL"],
                isNew: true,
                isBestSeller: false,
                isFeatured: true,
                displayOrder: 2),

            CreateProduct(
                "Black Bootleg Studio Leggings",
                FindCategory(categories, "Leggings"),
                "Bootleg",
                "Bootleg activewear leggings with a polished studio-to-street shape.",
                799,
                "Black",
                "Limited",
                "assets/bootlegleggings1.png",
                "ZivaFit black bootleg leggings",
                ["S", "M", "L", "XL"],
                isNew: false,
                isBestSeller: false,
                isFeatured: false,
                displayOrder: 3),

            CreateProduct(
                "Cocoa Support Sports Bra",
                FindCategory(categories, "Sports Bras"),
                "Medium Support",
                "A supportive cocoa sports bra with soft stretch and everyday comfort.",
                499,
                "Cocoa",
                "New In",
                "assets/bra1.png",
                "ZivaFit cocoa sports bra",
                ["XS", "S", "M", "L", "XL"],
                isNew: true,
                isBestSeller: true,
                isFeatured: true,
                displayOrder: 4),

            CreateProduct(
                "Black Longline Sports Bra",
                FindCategory(categories, "Sports Bras"),
                "Longline",
                "Clean black longline sports bra made for layering and secure movement.",
                549,
                "Black",
                "Best Seller",
                "assets/bra5.png",
                "ZivaFit black longline sports bra",
                ["XS", "S", "M", "L", "XL"],
                isNew: false,
                isBestSeller: true,
                isFeatured: false,
                displayOrder: 5),

            CreateProduct(
                "Olive Light Support Sports Bra",
                FindCategory(categories, "Sports Bras"),
                "Light Support",
                "Soft olive sports bra designed for low-impact movement and casual wear.",
                459,
                "Olive",
                "",
                "assets/bra3.png",
                "ZivaFit olive sports bra",
                ["XS", "S", "M", "L"],
                isNew: false,
                isBestSeller: false,
                isFeatured: false,
                displayOrder: 6),

            CreateProduct(
                "Cocoa Long Sleeve Active Top",
                FindCategory(categories, "Tops"),
                "Long Sleeve",
                "A fitted long sleeve activewear top for layering, training, and everyday errands.",
                599,
                "Cocoa",
                "New In",
                "assets/longsleeveshirt3.png",
                "ZivaFit cocoa long sleeve activewear top",
                ["XS", "S", "M", "L", "XL"],
                isNew: true,
                isBestSeller: false,
                isFeatured: true,
                displayOrder: 7),

            CreateProduct(
                "Cream Short Sleeve Training Top",
                FindCategory(categories, "Tops"),
                "Short Sleeve",
                "Breathable short sleeve gym top with a clean premium finish.",
                429,
                "Cream",
                "",
                "assets/shortsleeveshirt1.png",
                "ZivaFit cream short sleeve gym top",
                ["XS", "S", "M", "L", "XL"],
                isNew: false,
                isBestSeller: false,
                isFeatured: false,
                displayOrder: 8),

            CreateProduct(
                "Cream Studio Matching Set",
                FindCategory(categories, "Sets"),
                "Matching Set",
                "Coordinated cream activewear set for a polished full-look outfit.",
                1200,
                "Cream",
                "Best Seller",
                "assets/sets1.png",
                "ZivaFit cream matching activewear set",
                ["XS", "S", "M", "L", "XL"],
                isNew: true,
                isBestSeller: true,
                isFeatured: true,
                displayOrder: 9),

            CreateProduct(
                "Cocoa Everyday Matching Set",
                FindCategory(categories, "Sets"),
                "Matching Set",
                "Warm cocoa matching activewear set designed for confidence and easy styling.",
                1250,
                "Cocoa",
                "New In",
                "assets/sets5.png",
                "ZivaFit cocoa matching activewear set",
                ["XS", "S", "M", "L", "XL"],
                isNew: true,
                isBestSeller: false,
                isFeatured: true,
                displayOrder: 10),

            CreateProduct(
                "Black Pocket Active Shorts",
                FindCategory(categories, "Shorts"),
                "Pocket Shorts",
                "Black activewear shorts with practical pocket detail and easy movement.",
                499,
                "Black",
                "New In",
                "assets/short3.png",
                "ZivaFit black pocket activewear shorts",
                ["XS", "S", "M", "L", "XL"],
                isNew: true,
                isBestSeller: false,
                isFeatured: true,
                displayOrder: 11),

            CreateProduct(
                "Cream Bike Shorts",
                FindCategory(categories, "Shorts"),
                "Bike Shorts",
                "Cream bike shorts with a smooth supportive fit for training and walking.",
                459,
                "Cream",
                "",
                "assets/short1.png",
                "ZivaFit cream bike shorts",
                ["XS", "S", "M", "L", "XL"],
                isNew: false,
                isBestSeller: true,
                isFeatured: false,
                displayOrder: 12),

            CreateProduct(
                "Cream Active Skort",
                FindCategory(categories, "Shorts"),
                "Skort",
                "Feminine active skort with built-in comfort for light movement and daily styling.",
                549,
                "Cream",
                "Limited",
                "assets/skort1.png",
                "ZivaFit cream activewear skort",
                ["XS", "S", "M", "L"],
                isNew: false,
                isBestSeller: false,
                isFeatured: false,
                displayOrder: 13),

            CreateProduct(
                "Cocoa Everyday Gym Bag",
                FindCategory(categories, "Accessories"),
                "Gym Bag",
                "Spacious gym bag for carrying training, work, and everyday essentials.",
                699,
                "Cocoa",
                "Best Seller",
                "assets/gymbag1.png",
                "ZivaFit cocoa gym bag",
                ["One Size"],
                isNew: true,
                isBestSeller: true,
                isFeatured: true,
                displayOrder: 14),

            CreateProduct(
                "Black Travel Duffel Bag",
                FindCategory(categories, "Accessories"),
                "Duffel Bag",
                "Black duffel gym bag designed for travel, training, and daily carry.",
                799,
                "Black",
                "",
                "assets/gymbag5.png",
                "ZivaFit black gym duffel bag",
                ["One Size"],
                isNew: false,
                isBestSeller: false,
                isFeatured: false,
                displayOrder: 15)
        };

        context.Products.AddRange(products);

        await context.SaveChangesAsync();
    }

    // ===============================
    // Seed categories
    // Categories are shared by public pages, filters, product forms, and admin views.
    // ===============================
    private static async Task SeedCategoriesAsync(DataContext context)
    {
        var categories = new List<ProductCategory>
        {
            new()
            {
                Name = "Leggings",
                Description = "High-waist, pocket, seamless, and bootleg leggings for confident movement.",
                ImageUrl = "assets/leggings1.png",
                ImageAlt = "ZivaFit leggings category",
                DisplayOrder = 1,
                ShowInNavbar = true,
                IsActive = true
            },
            new()
            {
                Name = "Sports Bras",
                Description = "Supportive sports bras for light, medium, and confident movement.",
                ImageUrl = "assets/bra1.png",
                ImageAlt = "ZivaFit sports bras category",
                DisplayOrder = 2,
                ShowInNavbar = true,
                IsActive = true
            },
            new()
            {
                Name = "Tops",
                Description = "Long sleeve tops, short sleeve tops, vests, and activewear layers.",
                ImageUrl = "assets/longsleeveshirt1.png",
                ImageAlt = "ZivaFit tops category",
                DisplayOrder = 3,
                ShowInNavbar = true,
                IsActive = true
            },
            new()
            {
                Name = "Sets",
                Description = "Matching activewear sets for complete looks.",
                ImageUrl = "assets/sets1.png",
                ImageAlt = "ZivaFit sets category",
                DisplayOrder = 4,
                ShowInNavbar = true,
                IsActive = true
            },
            new()
            {
                Name = "Shorts",
                Description = "Bike shorts, pocket shorts, gym shorts, and skorts.",
                ImageUrl = "assets/short1.png",
                ImageAlt = "ZivaFit shorts category",
                DisplayOrder = 5,
                ShowInNavbar = true,
                IsActive = true
            },
            new()
            {
                Name = "Accessories",
                Description = "Gym bags, towels, gloves, and movement accessories.",
                ImageUrl = "assets/gymbag1.png",
                ImageAlt = "ZivaFit accessories category",
                DisplayOrder = 6,
                ShowInNavbar = true,
                IsActive = true
            }
        };

        foreach (var category in categories)
        {
            var exists = await context.ProductCategories.AnyAsync(c => c.Name == category.Name);

            if (!exists)
                context.ProductCategories.Add(category);
        }

        await context.SaveChangesAsync();
    }

    // ===============================
    // Create seeded product
    // Keeps the repeated product, image, and variant creation in one place.
    // ===============================
    private static Product CreateProduct(
        string name,
        ProductCategory category,
        string fitType,
        string description,
        decimal price,
        string colour,
        string badge,
        string imageUrl,
        string imageAlt,
        string[] sizes,
        bool isNew,
        bool isBestSeller,
        bool isFeatured,
        int displayOrder)
    {
        var product = new Product
        {
            Name = name,
            Category = category,
            FitType = fitType,
            Description = description,
            Price = price,
            Colour = colour,
            Badge = badge,
            IsNew = isNew,
            IsBestSeller = isBestSeller,
            IsFeatured = isFeatured,
            IsActive = true,
            DisplayOrder = displayOrder,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Images =
            [
                new ProductImage
                {
                    ImageUrl = imageUrl,
                    ImageAlt = imageAlt,
                    DisplayOrder = 1,
                    IsMain = true
                }
            ]
        };

        foreach (var size in sizes)
        {
            product.Variants.Add(new ProductVariant
            {
                Size = size,
                Colour = colour,
                Sku = CreateSeedSku(name, colour, size, displayOrder),
                StockQuantity = size == "One Size" ? 20 : 12,
                IsActive = true
            });
        }

        return product;
    }

    private static ProductCategory FindCategory(List<ProductCategory> categories, string name)
    {
        return categories.First(c => c.Name == name);
    }

    private static string CreateSeedSku(string name, string colour, string size, int displayOrder)
    {
        static string Clean(string value)
        {
            var clean = new string(value
                .Where(char.IsLetterOrDigit)
                .Take(8)
                .ToArray());

            return string.IsNullOrWhiteSpace(clean) ? "ZVF" : clean.ToUpperInvariant();
        }

        return $"ZVF-{displayOrder:D2}-{Clean(name)}-{Clean(colour)}-{Clean(size)}";
    }
}