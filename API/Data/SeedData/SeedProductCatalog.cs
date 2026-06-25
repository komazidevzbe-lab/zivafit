using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.SeedData;

public static class SeedProductCatalog
{
    private static readonly string[] ApparelSizes = ["XS", "S", "M", "L", "XL"];
    private static readonly string[] ExtendedApparelSizes = ["XS", "S", "M", "L", "XL", "XXL"];
    private static readonly string[] OneSize = ["One Size"];

    private static readonly string[] LeggingsImages =
    [
        "assets/leggings1.png",
        "assets/leggings2.png",
        "assets/leggings3.png",
        "assets/leggings4.png",
        "assets/leggings5.png",
        "assets/leggings6.png",
        "assets/leggings8.png",
        "assets/leggings9.png",
        "assets/leggings10.png"
    ];

    private static readonly string[] BootlegLeggingsImages =
    [
        "assets/bootlegleggings1.png",
        "assets/bootlegleggings2.png",
        "assets/bootlegleggings3.png",
        "assets/bootlegleggings4.png",
        "assets/bootlegleggings5.png",
        "assets/bootlegleggings6.png",
        "assets/bootlegleggings7.png",
        "assets/bootlegleggings8.png",
        "assets/bootlegleggings9.png",
        "assets/bootlegleggings10.png"
    ];

    private static readonly string[] BraImages =
    [
        "assets/bra1.png",
        "assets/bra2.png",
        "assets/bra3.png",
        "assets/bra4.png",
        "assets/bra5.png",
        "assets/bra6.png",
        "assets/bra7.png",
        "assets/bra8.png",
        "assets/bra9.png",
        "assets/bra10.png"
    ];

    private static readonly string[] GymBagImages =
    [
        "assets/gymbag1.png",
        "assets/gymbag2.png",
        "assets/gymbag3.png",
        "assets/gymbag4.png",
        "assets/gymbag5.png",
        "assets/gymbag6.png",
        "assets/gymbag7.png",
        "assets/gymbag8.png",
        "assets/gymbag9.png",
        "assets/gymbag10.png"
    ];

    private static readonly string[] LongSleeveShirtImages =
    [
        "assets/longsleeveshirt1.png",
        "assets/longsleeveshirt2.png",
        "assets/longsleeveshirt3.png",
        "assets/longsleeveshirt4.png",
        "assets/longsleeveshirt5.png",
        "assets/longsleeveshirt6.png",
        "assets/longsleeveshirt7.png",
        "assets/longsleeveshirt8.png",
        "assets/longsleeveshirt9.png",
        "assets/longsleeveshirt10.png"
    ];

    private static readonly string[] SetImages =
    [
        "assets/sets1.png",
        "assets/sets2.png",
        "assets/sets3.png",
        "assets/sets4.png",
        "assets/sets5.png",
        "assets/sets6.png",
        "assets/sets7.png",
        "assets/sets8.png",
        "assets/sets9.png",
        "assets/sets10.png"
    ];

    private static readonly string[] ShortImages =
    [
        "assets/short1.png",
        "assets/short2.png",
        "assets/short3.png",
        "assets/short4.png",
        "assets/short5.png",
        "assets/short6.png",
        "assets/short7.png",
        "assets/short8.png",
        "assets/short9.png",
        "assets/short10.png"
    ];

    private static readonly string[] ShortSleeveShirtImages =
    [
        "assets/shortsleeveshirt1.png",
        "assets/shortsleeveshirt2.png",
        "assets/shortsleeveshirt3.png",
        "assets/shortsleeveshirt4.png",
        "assets/shortsleeveshirt5.png",
        "assets/shortsleeveshirt6.png",
        "assets/shortsleeveshirt7.png",
        "assets/shortsleeveshirt8.png",
        "assets/shortsleeveshirt9.png",
        "assets/shortsleeveshirt10.png"
    ];

    private static readonly string[] SkortImages =
    [
        "assets/skort1.png",
        "assets/skort2.png",
        "assets/skort3.png",
        "assets/skort4.png",
        "assets/skort5.png",
        "assets/skort6.png",
        "assets/skort7.png",
        "assets/skort8.png",
        "assets/skort9.png"
    ];

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

        var products = BuildSeedProducts(categories);

        context.Products.AddRange(products);

        await context.SaveChangesAsync();
    }

    private static List<Product> BuildSeedProducts(List<ProductCategory> categories)
    {
        var products = new List<Product>();

        products.AddRange(CreateProductSeries(
            categories,
            "Leggings",
            LeggingsImages,
            [
                new ProductSeedItem("Cocoa Sculpt High-Waist Leggings", "High-Waist", "Soft sculpting leggings with a secure high-rise fit for training and everyday movement.", 699, "Cocoa", "Best Seller", ExtendedApparelSizes, true, true, true),
                new ProductSeedItem("Black Pocket Training Leggings", "Pocket", "Supportive black leggings with side pocket detail and a smooth training fit.", 749, "Black", "New In", ApparelSizes, true, false, true),
                new ProductSeedItem("Cream Seamless Sculpt Leggings", "Seamless", "Cream seamless leggings with a soft sculpt fit for everyday training.", 729, "Cream", "", ExtendedApparelSizes, false, false, false),
                new ProductSeedItem("Olive Contour High-Waist Leggings", "High-Waist", "Olive high-waist leggings with a smooth contour finish and secure support.", 699, "Olive", "New In", ExtendedApparelSizes, true, false, false),
                new ProductSeedItem("Charcoal Everyday Training Leggings", "Training", "Charcoal leggings designed for gym sessions, walking, and daily styling.", 679, "Charcoal", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Cocoa Ribbed Studio Leggings", "Ribbed", "Ribbed cocoa studio leggings with a flattering stretch fit.", 759, "Cocoa", "Limited", ApparelSizes, false, false, false),
                new ProductSeedItem("Cream Pocket Training Leggings", "Pocket", "Cream training leggings with pocket detail and a supportive high-rise fit.", 749, "Cream", "New In", ApparelSizes, true, false, true),
                new ProductSeedItem("Olive High-Rise Everyday Leggings", "High-Rise", "Olive high-rise leggings with an easy everyday activewear feel.", 689, "Olive", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Black Seamless Core Leggings", "Seamless", "Black seamless core leggings with clean lines and reliable comfort.", 719, "Black", "Best Seller", ExtendedApparelSizes, false, true, true)
            ],
            1));

        products.AddRange(CreateProductSeries(
            categories,
            "Leggings",
            BootlegLeggingsImages,
            [
                new ProductSeedItem("Black Bootleg Studio Leggings", "Bootleg", "Bootleg activewear leggings with a polished studio-to-street shape.", 799, "Black", "Limited", ApparelSizes, false, false, false),
                new ProductSeedItem("Cocoa Bootleg Lounge Leggings", "Bootleg", "Cocoa bootleg leggings with a comfortable lounge-to-studio fit.", 789, "Cocoa", "New In", ApparelSizes, true, false, true),
                new ProductSeedItem("Cream Bootleg Training Leggings", "Bootleg", "Cream bootleg leggings designed for movement with a softly flared finish.", 799, "Cream", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Olive Bootleg Studio Leggings", "Bootleg", "Olive bootleg studio leggings with a clean activewear silhouette.", 799, "Olive", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Charcoal Bootleg Active Leggings", "Bootleg", "Charcoal bootleg leggings with a smooth active fit for daily wear.", 779, "Charcoal", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Black Ribbed Bootleg Leggings", "Ribbed Bootleg", "Ribbed black bootleg leggings with stretch support and a flattering shape.", 829, "Black", "Best Seller", ApparelSizes, false, true, true),
                new ProductSeedItem("Cocoa Sculpt Bootleg Leggings", "Sculpt Bootleg", "Cocoa sculpt bootleg leggings with a soft hold and premium finish.", 819, "Cocoa", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Cream Everyday Bootleg Leggings", "Bootleg", "Cream everyday bootleg leggings made for easy styling and comfort.", 789, "Cream", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Brown Studio Bootleg Leggings", "Bootleg", "Brown studio bootleg leggings with a refined activewear look.", 799, "Brown", "Limited", ApparelSizes, false, false, false),
                new ProductSeedItem("Black Flare Bootleg Leggings", "Flare Bootleg", "Black flare bootleg leggings with a sleek studio-to-street finish.", 849, "Black", "New In", ApparelSizes, true, false, true)
            ],
            10));

        products.AddRange(CreateProductSeries(
            categories,
            "Sports Bras",
            BraImages,
            [
                new ProductSeedItem("Cocoa Support Sports Bra", "Medium Support", "A supportive cocoa sports bra with soft stretch and everyday comfort.", 499, "Cocoa", "New In", ApparelSizes, true, true, true),
                new ProductSeedItem("Cream Everyday Sports Bra", "Medium Support", "Cream sports bra with an easy everyday fit and soft support.", 479, "Cream", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Olive Light Support Sports Bra", "Light Support", "Soft olive sports bra designed for low-impact movement and casual wear.", 459, "Olive", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Charcoal Crossback Sports Bra", "Crossback", "Charcoal crossback sports bra with clean support for training days.", 529, "Charcoal", "New In", ApparelSizes, true, false, true),
                new ProductSeedItem("Black Longline Sports Bra", "Longline", "Clean black longline sports bra made for layering and secure movement.", 549, "Black", "Best Seller", ApparelSizes, false, true, false),
                new ProductSeedItem("Cocoa Longline Sports Bra", "Longline", "Cocoa longline sports bra with soft support and a smooth finish.", 549, "Cocoa", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Cream Ribbed Sports Bra", "Ribbed", "Cream ribbed sports bra with a soft textured activewear finish.", 499, "Cream", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Black Medium Support Sports Bra", "Medium Support", "Black sports bra with dependable support for gym and studio sessions.", 519, "Black", "Best Seller", ApparelSizes, false, true, true),
                new ProductSeedItem("Olive Seamless Sports Bra", "Seamless", "Olive seamless sports bra with smooth comfort for low-impact movement.", 489, "Olive", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Cocoa Minimal Sports Bra", "Minimal", "Minimal cocoa sports bra with a clean look for layering and light training.", 459, "Cocoa", "Limited", ApparelSizes, false, false, false)
            ],
            20));

        products.AddRange(CreateProductSeries(
            categories,
            "Tops",
            LongSleeveShirtImages,
            [
                new ProductSeedItem("Black Long Sleeve Active Top", "Long Sleeve", "Black fitted long sleeve activewear top for layering and training.", 599, "Black", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Cream Long Sleeve Active Top", "Long Sleeve", "Cream long sleeve active top with a smooth premium fit.", 599, "Cream", "New In", ApparelSizes, true, false, true),
                new ProductSeedItem("Cocoa Long Sleeve Active Top", "Long Sleeve", "A fitted long sleeve activewear top for layering, training, and everyday errands.", 599, "Cocoa", "New In", ApparelSizes, true, false, true),
                new ProductSeedItem("Olive Long Sleeve Training Top", "Long Sleeve", "Olive long sleeve training top with breathable comfort and stretch.", 579, "Olive", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Charcoal Long Sleeve Studio Top", "Long Sleeve", "Charcoal studio top with a fitted shape and clean activewear finish.", 599, "Charcoal", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Black Ribbed Long Sleeve Top", "Ribbed Long Sleeve", "Black ribbed long sleeve top designed for layering and daily styling.", 629, "Black", "Best Seller", ApparelSizes, false, true, true),
                new ProductSeedItem("Cocoa Cropped Long Sleeve Top", "Cropped Long Sleeve", "Cocoa cropped long sleeve top with a soft stretch active fit.", 579, "Cocoa", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Cream Fitted Long Sleeve Top", "Fitted Long Sleeve", "Cream fitted long sleeve top with a clean premium finish.", 589, "Cream", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Olive Ribbed Long Sleeve Top", "Ribbed Long Sleeve", "Olive ribbed long sleeve active top for easy movement and layering.", 619, "Olive", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Black Zip Detail Long Sleeve Top", "Zip Detail", "Black long sleeve top with a sleek zip detail and studio-ready feel.", 649, "Black", "Limited", ApparelSizes, false, false, false)
            ],
            30));

        products.AddRange(CreateProductSeries(
            categories,
            "Tops",
            ShortSleeveShirtImages,
            [
                new ProductSeedItem("Cream Short Sleeve Training Top", "Short Sleeve", "Breathable short sleeve gym top with a clean premium finish.", 429, "Cream", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Black Short Sleeve Training Top", "Short Sleeve", "Black short sleeve training top with a lightweight everyday active fit.", 429, "Black", "Best Seller", ApparelSizes, false, true, true),
                new ProductSeedItem("Cocoa Short Sleeve Active Top", "Short Sleeve", "Cocoa short sleeve active top designed for movement and comfort.", 439, "Cocoa", "New In", ApparelSizes, true, false, true),
                new ProductSeedItem("Olive Short Sleeve Gym Top", "Short Sleeve", "Olive gym top with a breathable feel and relaxed activewear shape.", 419, "Olive", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Charcoal Short Sleeve Studio Top", "Short Sleeve", "Charcoal studio top with a clean fit for training and errands.", 429, "Charcoal", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Cream Cropped Training Tee", "Cropped Tee", "Cream cropped training tee with a soft and lightweight finish.", 399, "Cream", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Black Relaxed Active Tee", "Relaxed Tee", "Black relaxed active tee made for casual movement and daily wear.", 409, "Black", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Cocoa Fitted Training Tee", "Fitted Tee", "Cocoa fitted training tee with a smooth stretch feel.", 429, "Cocoa", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Olive Everyday Active Tee", "Everyday Tee", "Olive everyday active tee with a clean versatile finish.", 399, "Olive", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Black Premium Training Tee", "Premium Tee", "Black premium training tee with a polished activewear look.", 459, "Black", "Limited", ApparelSizes, false, false, false)
            ],
            40));

        products.AddRange(CreateProductSeries(
            categories,
            "Sets",
            SetImages,
            [
                new ProductSeedItem("Cream Studio Matching Set", "Matching Set", "Coordinated cream activewear set for a polished full-look outfit.", 1200, "Cream", "Best Seller", ApparelSizes, true, true, true),
                new ProductSeedItem("Black Core Matching Set", "Matching Set", "Black matching activewear set with a clean gym-to-street look.", 1199, "Black", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Olive Everyday Matching Set", "Matching Set", "Olive activewear set made for easy styling and comfortable movement.", 1180, "Olive", "New In", ApparelSizes, true, false, true),
                new ProductSeedItem("Charcoal Training Matching Set", "Matching Set", "Charcoal training set with supportive pieces and a premium finish.", 1250, "Charcoal", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Cocoa Everyday Matching Set", "Matching Set", "Warm cocoa matching activewear set designed for confidence and easy styling.", 1250, "Cocoa", "New In", ApparelSizes, true, false, true),
                new ProductSeedItem("Cream Ribbed Matching Set", "Ribbed Set", "Cream ribbed matching set with soft texture and a flattering fit.", 1299, "Cream", "Limited", ApparelSizes, false, false, false),
                new ProductSeedItem("Black Longline Matching Set", "Longline Set", "Black longline matching set with sleek support and clean styling.", 1299, "Black", "Best Seller", ApparelSizes, false, true, true),
                new ProductSeedItem("Cocoa Sculpt Matching Set", "Sculpt Set", "Cocoa sculpt matching set designed for training and everyday confidence.", 1320, "Cocoa", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Olive Studio Matching Set", "Studio Set", "Olive studio matching set with a calm premium activewear finish.", 1240, "Olive", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Black Premium Matching Set", "Premium Set", "Black premium matching set with a refined full-outfit activewear look.", 1399, "Black", "Limited", ApparelSizes, false, false, false)
            ],
            50));

        products.AddRange(CreateProductSeries(
            categories,
            "Shorts",
            ShortImages,
            [
                new ProductSeedItem("Cream Bike Shorts", "Bike Shorts", "Cream bike shorts with a smooth supportive fit for training and walking.", 459, "Cream", "", ExtendedApparelSizes, false, true, false),
                new ProductSeedItem("Cocoa Bike Shorts", "Bike Shorts", "Cocoa bike shorts with a soft stretch fit and easy everyday comfort.", 469, "Cocoa", "New In", ExtendedApparelSizes, true, false, true),
                new ProductSeedItem("Black Pocket Active Shorts", "Pocket Shorts", "Black activewear shorts with practical pocket detail and easy movement.", 499, "Black", "New In", ApparelSizes, true, false, true),
                new ProductSeedItem("Olive Training Shorts", "Training Shorts", "Olive training shorts made for gym sessions and warm days.", 459, "Olive", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Charcoal Everyday Shorts", "Everyday Shorts", "Charcoal everyday shorts with a clean comfortable active fit.", 449, "Charcoal", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Black High-Waist Bike Shorts", "High-Waist Bike Shorts", "Black high-waist bike shorts with supportive stretch and a sleek look.", 489, "Black", "Best Seller", ExtendedApparelSizes, false, true, true),
                new ProductSeedItem("Cream Pocket Active Shorts", "Pocket Shorts", "Cream activewear shorts with pocket detail and a smooth waistband.", 499, "Cream", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Cocoa Ribbed Bike Shorts", "Ribbed Bike Shorts", "Cocoa ribbed bike shorts with a soft textured training finish.", 489, "Cocoa", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Olive Soft Sculpt Shorts", "Soft Sculpt Shorts", "Olive soft sculpt shorts made for confident movement and comfort.", 479, "Olive", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Black Premium Training Shorts", "Premium Shorts", "Black premium training shorts with a polished activewear feel.", 529, "Black", "Limited", ApparelSizes, false, false, false)
            ],
            60));

        products.AddRange(CreateProductSeries(
            categories,
            "Shorts",
            SkortImages,
            [
                new ProductSeedItem("Cream Active Skort", "Skort", "Feminine active skort with built-in comfort for light movement and daily styling.", 549, "Cream", "Limited", ApparelSizes, false, false, false),
                new ProductSeedItem("Black Active Skort", "Skort", "Black active skort with a clean fit and easy movement.", 559, "Black", "Best Seller", ApparelSizes, false, true, true),
                new ProductSeedItem("Cocoa Studio Skort", "Skort", "Cocoa studio skort designed for light movement and everyday styling.", 549, "Cocoa", "New In", ApparelSizes, true, false, true),
                new ProductSeedItem("Olive Everyday Skort", "Skort", "Olive everyday skort with built-in comfort and a soft finish.", 539, "Olive", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Charcoal Training Skort", "Training Skort", "Charcoal training skort with a practical activewear fit.", 559, "Charcoal", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Cream Pleated Active Skort", "Pleated Skort", "Cream pleated active skort with a feminine studio-inspired shape.", 579, "Cream", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Black Pocket Active Skort", "Pocket Skort", "Black active skort with pocket detail and comfortable built-in support.", 589, "Black", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Cocoa Soft Movement Skort", "Soft Movement Skort", "Cocoa skort made for soft movement, walking, and daily wear.", 549, "Cocoa", "", ApparelSizes, false, false, false),
                new ProductSeedItem("Olive Premium Active Skort", "Premium Skort", "Olive premium active skort with a clean and polished finish.", 599, "Olive", "Limited", ApparelSizes, false, false, false)
            ],
            70));

        products.AddRange(CreateProductSeries(
            categories,
            "Accessories",
            GymBagImages,
            [
                new ProductSeedItem("Cocoa Everyday Gym Bag", "Gym Bag", "Spacious gym bag for carrying training, work, and everyday essentials.", 699, "Cocoa", "Best Seller", OneSize, true, true, true),
                new ProductSeedItem("Cream Everyday Gym Bag", "Gym Bag", "Cream gym bag with spacious storage and a clean premium finish.", 699, "Cream", "New In", OneSize, true, false, true),
                new ProductSeedItem("Olive Studio Gym Bag", "Gym Bag", "Olive studio gym bag designed for active days and daily carrying.", 679, "Olive", "", OneSize, false, false, false),
                new ProductSeedItem("Charcoal Training Gym Bag", "Gym Bag", "Charcoal gym bag with practical space for training essentials.", 689, "Charcoal", "", OneSize, false, false, false),
                new ProductSeedItem("Black Travel Duffel Bag", "Duffel Bag", "Black duffel gym bag designed for travel, training, and daily carry.", 799, "Black", "", OneSize, false, false, false),
                new ProductSeedItem("Cocoa Weekend Duffel Bag", "Duffel Bag", "Cocoa weekend duffel bag with roomy storage and an active lifestyle feel.", 829, "Cocoa", "Limited", OneSize, false, false, false),
                new ProductSeedItem("Cream Compact Gym Bag", "Compact Gym Bag", "Cream compact gym bag for light training days and everyday essentials.", 649, "Cream", "", OneSize, false, false, false),
                new ProductSeedItem("Black Premium Gym Bag", "Premium Gym Bag", "Black premium gym bag with a sleek finish and practical carry space.", 849, "Black", "Best Seller", OneSize, false, true, true),
                new ProductSeedItem("Olive Everyday Duffel Bag", "Duffel Bag", "Olive everyday duffel bag made for movement, errands, and travel.", 779, "Olive", "", OneSize, false, false, false),
                new ProductSeedItem("Charcoal Large Gym Bag", "Large Gym Bag", "Charcoal large gym bag with generous storage for busy active days.", 899, "Charcoal", "New In", OneSize, true, false, true)
            ],
            79));

        return products
            .OrderBy(p => p.DisplayOrder)
            .ToList();
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

    private static IEnumerable<Product> CreateProductSeries(
        List<ProductCategory> categories,
        string categoryName,
        string[] imageUrls,
        ProductSeedItem[] items,
        int startingDisplayOrder)
    {
        if (imageUrls.Length != items.Length)
            throw new InvalidOperationException($"{categoryName} seed images and product items must have the same number of records.");

        var category = FindCategory(categories, categoryName);

        for (var i = 0; i < items.Length; i++)
        {
            var item = items[i];

            yield return CreateProduct(
                item.Name,
                category,
                item.FitType,
                item.Description,
                item.Price,
                item.Colour,
                item.Badge,
                imageUrls[i],
                $"ZivaFit {item.Name}",
                item.Sizes,
                item.IsNew,
                item.IsBestSeller,
                item.IsFeatured,
                startingDisplayOrder + i);
        }
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

    private sealed record ProductSeedItem(
        string Name,
        string FitType,
        string Description,
        decimal Price,
        string Colour,
        string Badge,
        string[] Sizes,
        bool IsNew,
        bool IsBestSeller,
        bool IsFeatured);
}