using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.SeedData;

public static class SeedStorefrontContent
{
    // ===============================
    // Seed storefront content
    // Creates Home and collection page content in the database.
    // ===============================
    public static async Task SeedAsync(DataContext context)
    {
        await SeedHomeContentAsync(context);
        await SeedCollectionPagesAsync(context);
    }

    // ===============================
    // Seed Home content
    // Keeps homepage copy, cards, category images, and benefits out of Angular.
    // ===============================
    private static async Task SeedHomeContentAsync(DataContext context)
    {
        if (await context.StorefrontHomeContents.AnyAsync())
            return;

        var homeContent = new StorefrontHomeContent
        {
            HeroEyebrow = "Confident. Strong. Unstoppable.",
            HeroTitle = "Made for",
            HeroHighlight = "every you.",
            HeroText = "Performance meets confidence in activewear that moves with you and celebrates you.",
            PrimaryButtonLabel = "Shop New Arrivals",
            PrimaryButtonRoute = "/new-in",
            SecondaryButtonLabel = "Shop Collections",
            SecondaryButtonRoute = "/shop",
            HeroVisualAriaLabel = "ZivaFit activewear set previews",
            CategorySectionAriaLabel = "Shop ZivaFit categories",
            BestSellersEyebrow = "Customer favourites",
            BestSellersTitle = "Best Sellers",
            BestSellersLinkLabel = "Shop all best sellers",
            BestSellersLinkRoute = "/shop",
            ProductCardLinkLabel = "View Product",
            IsActive = true,
            HeroCards =
            [
                CreateHeroCard("ZivaFit Set One", "assets/sets1.png", "Woman wearing a ZivaFit activewear set", "card-one", 1),
                CreateHeroCard("ZivaFit Set Two", "assets/sets2.png", "Woman posing in a matching ZivaFit gym set", "card-two", 2),
                CreateHeroCard("ZivaFit Set Three", "assets/sets3.png", "ZivaFit activewear set styled for gym and movement", "card-three", 3),
                CreateHeroCard("ZivaFit Set Four", "assets/sets4.png", "Woman wearing a premium ZivaFit matching set", "card-four", 4)
            ],
            CategoryCards =
            [
                CreateCategoryCard(
                    "Leggings",
                    "/leggings",
                    "Shop Leggings",
                    1,
                    [
                        CreateCategoryImage("assets/leggings1.png", "ZivaFit leggings product preview", 1),
                        CreateCategoryImage("assets/leggings2.png", "ZivaFit high-waist leggings product preview", 2)
                    ]),
                CreateCategoryCard(
                    "Sports Bras",
                    "/sports-bras",
                    "Shop Sports Bras",
                    2,
                    [
                        CreateCategoryImage("assets/bra1.png", "ZivaFit sports bra product preview", 1),
                        CreateCategoryImage("assets/bra2.png", "ZivaFit supportive sports bra", 2)
                    ]),
                CreateCategoryCard(
                    "Tops",
                    "/tops",
                    "Shop Tops",
                    3,
                    [
                        CreateCategoryImage("assets/longsleeveshirt1.png", "ZivaFit long sleeve gym top", 1),
                        CreateCategoryImage("assets/shortsleeveshirt1.png", "ZivaFit short sleeve activewear top", 2)
                    ]),
                CreateCategoryCard(
                    "Sets",
                    "/sets",
                    "Shop Sets",
                    4,
                    [
                        CreateCategoryImage("assets/sets1.png", "ZivaFit matching activewear set", 1),
                        CreateCategoryImage("assets/sets3.png", "ZivaFit premium activewear set", 2)
                    ]),
                CreateCategoryCard(
                    "Shorts",
                    "/shorts",
                    "Shop Shorts",
                    5,
                    [
                        CreateCategoryImage("assets/short1.png", "ZivaFit activewear shorts", 1),
                        CreateCategoryImage("assets/skort1.png", "ZivaFit skort activewear product preview", 2)
                    ]),
                CreateCategoryCard(
                    "Accessories",
                    "/accessories",
                    "Shop Accessories",
                    6,
                    [
                        CreateCategoryImage("assets/gymbag1.png", "ZivaFit gym bag product preview", 1),
                        CreateCategoryImage("assets/gymbag3.png", "ZivaFit gym duffle bag", 2)
                    ])
            ],
            Benefits =
            [
                CreateBenefit("bi bi-truck", "Nationwide Delivery", "Prepared for shipping across South Africa.", 1),
                CreateBenefit("bi bi-shield-check", "Secure Checkout", "Safe shopping experience for every customer.", 2),
                CreateBenefit("bi bi-droplet", "Sweat-Wicking", "Stay cool, dry, and comfortable.", 3),
                CreateBenefit("bi bi-heart", "Designed for Every Body", "Inclusive sizing that celebrates you.", 4)
            ]
        };

        context.StorefrontHomeContents.Add(homeContent);
        await context.SaveChangesAsync();
    }

    // ===============================
    // Seed collection page content
    // Keeps Shop, New In, and category page content out of Angular TypeScript files.
    // ===============================
    private static async Task SeedCollectionPagesAsync(DataContext context)
    {
        if (await context.StorefrontCollectionPages.AnyAsync())
            return;

        var collectionPages = new List<StorefrontCollectionPage>
        {
            CreateCollectionPage(
                "shop",
                "Shop",
                "all",
                null,
                "category",
                "ZivaFit Shop",
                "Activewear For Every Move.",
                "Browse the full ZivaFit range, from supportive staples to complete activewear looks.",
                "Shop Products",
                "View New In",
                "/new-in",
                "Browse all",
                "Shop",
                "View Product",
                "No products found",
                "Try another filter to view more ZivaFit products.",
                "Shop note",
                "One catalogue structure for the full store.",
                "This page is powered by the backend product catalogue and shows active products from the database.",
                1,
                [
                    CreateCollectionPoint("bi bi-check2-circle", "Premium everyday fit", 1),
                    CreateCollectionPoint("bi bi-check2-circle", "Warm neutral colours", 2),
                    CreateCollectionPoint("bi bi-check2-circle", "South African store", 3)
                ],
                [
                    CreateCollectionImage("assets/leggings1.png", "ZivaFit leggings product preview", 1),
                    CreateCollectionImage("assets/sets5.png", "ZivaFit matching set product preview", 2),
                    CreateCollectionImage("assets/gymbag5.png", "ZivaFit gym bag product preview", 3)
                ],
                [
                    CreateCollectionBenefit("bi bi-grid", "Full catalogue", "Leggings, sports bras, tops, sets, shorts, and accessories.", 1),
                    CreateCollectionBenefit("bi bi-heart", "Designed for confidence", "Clean, premium pieces for different movement styles.", 2),
                    CreateCollectionBenefit("bi bi-shield-check", "Built for comfort", "Supportive fits for training, errands, and everyday wear.", 3)
                ]),

            CreateCollectionPage(
                "new-in",
                "New In",
                "new",
                null,
                "category",
                "ZivaFit New In",
                "Fresh Activewear Just Landed.",
                "Discover the latest ZivaFit drops across leggings, sports bras, tops, sets, shorts, and accessories.",
                "Shop New In",
                "View All Products",
                "/shop",
                "Latest arrivals",
                "New In",
                "View Product",
                "No new arrivals found",
                "Try another filter to view more ZivaFit products.",
                "New in note",
                "Fresh pieces without changing the ZivaFit feel.",
                "This page is powered by the backend product catalogue and uses the product IsNew flag from the database.",
                2,
                [
                    CreateCollectionPoint("bi bi-check2-circle", "Latest arrivals", 1),
                    CreateCollectionPoint("bi bi-check2-circle", "Inclusive sizing", 2),
                    CreateCollectionPoint("bi bi-check2-circle", "Delivery in South Africa", 3)
                ],
                [
                    CreateCollectionImage("assets/sets1.png", "ZivaFit new matching activewear set", 1),
                    CreateCollectionImage("assets/leggings2.png", "ZivaFit new pocket leggings", 2),
                    CreateCollectionImage("assets/bra1.png", "ZivaFit new sports bra", 3)
                ],
                [
                    CreateCollectionBenefit("bi bi-stars", "Fresh drops", "New colours, updated fits, and fresh outfit ideas.", 1),
                    CreateCollectionBenefit("bi bi-bag-heart", "Full outfits", "Build complete looks from activewear to accessories.", 2),
                    CreateCollectionBenefit("bi bi-truck", "Nationwide delivery", "Prepared for shipping across South Africa.", 3)
                ]),

            CreateCollectionPage(
                "leggings",
                "Leggings",
                "category",
                "Leggings",
                "style",
                "ZivaFit Leggings",
                "Leggings Made To Move.",
                "High-waist, pocket, seamless, and bootleg leggings designed for comfort, confidence, and everyday movement.",
                "Shop Leggings",
                "View All Products",
                "/shop",
                "Shop the collection",
                "Leggings",
                "View Product",
                "No leggings found",
                "Try another filter to view more ZivaFit leggings.",
                "Fit note",
                "Leggings should feel secure, smooth, and easy to move in.",
                "This page is powered by the backend product catalogue and filters active products by the Leggings category.",
                3,
                [
                    CreateCollectionPoint("bi bi-check2-circle", "Squat-proof support", 1),
                    CreateCollectionPoint("bi bi-check2-circle", "Inclusive sizing", 2),
                    CreateCollectionPoint("bi bi-check2-circle", "Delivery in South Africa", 3)
                ],
                [
                    CreateCollectionImage("assets/leggings1.png", "ZivaFit black sculpt leggings", 1),
                    CreateCollectionImage("assets/leggings2.png", "ZivaFit cocoa pocket leggings", 2),
                    CreateCollectionImage("assets/bootlegleggings1.png", "ZivaFit black bootleg leggings", 3)
                ],
                [
                    CreateCollectionBenefit("bi bi-shield-check", "Supportive fits", "Made to hold, smooth, and move with you.", 1),
                    CreateCollectionBenefit("bi bi-droplet-half", "Sweat-wicking comfort", "Designed for gym sessions and everyday wear.", 2),
                    CreateCollectionBenefit("bi bi-stars", "Premium everyday style", "Warm neutrals, bold basics, and flattering cuts.", 3)
                ]),

            CreateCollectionPage(
                "sports-bras",
                "Sports Bras",
                "category",
                "Sports Bras",
                "style",
                "ZivaFit Sports Bras",
                "Support Made To Move.",
                "High-support, medium-support, light-support, and longline sports bras made for comfort, confidence, and movement.",
                "Shop Sports Bras",
                "View All Products",
                "/shop",
                "Shop support",
                "Sports Bras",
                "View Product",
                "No sports bras found",
                "Try another filter to view more ZivaFit sports bras.",
                "Fit note",
                "Support should feel secure, not restrictive.",
                "This page is powered by the backend product catalogue and filters active products by the Sports Bras category.",
                4,
                [
                    CreateCollectionPoint("bi bi-check2-circle", "Supportive fits", 1),
                    CreateCollectionPoint("bi bi-check2-circle", "Soft stretch comfort", 2),
                    CreateCollectionPoint("bi bi-check2-circle", "Inclusive sizing", 3)
                ],
                [
                    CreateCollectionImage("assets/bra5.png", "ZivaFit black support sports bra", 1),
                    CreateCollectionImage("assets/bra1.png", "ZivaFit cocoa sports bra", 2),
                    CreateCollectionImage("assets/bra3.png", "ZivaFit olive sports bra", 3)
                ],
                [
                    CreateCollectionBenefit("bi bi-shield-check", "Secure support", "Designed for training, stretching, and everyday movement.", 1),
                    CreateCollectionBenefit("bi bi-droplet-half", "Sweat-friendly comfort", "Built for movement without losing the premium feel.", 2),
                    CreateCollectionBenefit("bi bi-stars", "Layer-ready style", "Pairs easily with leggings, shorts, and matching sets.", 3)
                ]),

            CreateCollectionPage(
                "tops",
                "Tops",
                "category",
                "Tops",
                "style",
                "ZivaFit Tops",
                "Tops Made To Layer.",
                "Long sleeves, short sleeves, vests, and studio tops designed to feel polished while staying easy to move in.",
                "Shop Tops",
                "View All Products",
                "/shop",
                "Shop activewear tops",
                "Tops",
                "View Product",
                "No tops found",
                "Try another filter to view more ZivaFit tops.",
                "Style note",
                "Made to move, layer, and repeat.",
                "This page is powered by the backend product catalogue and filters active products by the Tops category.",
                5,
                [
                    CreateCollectionPoint("bi bi-check2-circle", "Layer-friendly", 1),
                    CreateCollectionPoint("bi bi-check2-circle", "Soft stretch fits", 2),
                    CreateCollectionPoint("bi bi-check2-circle", "Warm neutral colours", 3)
                ],
                [
                    CreateCollectionImage("assets/longsleeveshirt3.png", "ZivaFit cocoa long sleeve activewear top", 1),
                    CreateCollectionImage("assets/longsleeveshirt1.png", "ZivaFit fitted long sleeve activewear top", 2),
                    CreateCollectionImage("assets/shortsleeveshirt1.png", "ZivaFit short sleeve gym top", 3)
                ],
                [
                    CreateCollectionBenefit("bi bi-layers", "Easy layering", "Wear them over sports bras or under jackets.", 1),
                    CreateCollectionBenefit("bi bi-stars", "Polished activewear", "Clean pieces that work in and out of the gym.", 2),
                    CreateCollectionBenefit("bi bi-heart", "Comfort-first fit", "Soft, simple silhouettes made for everyday movement.", 3)
                ]),

            CreateCollectionPage(
                "sets",
                "Sets",
                "category",
                "Sets",
                "style",
                "ZivaFit Sets",
                "Matching Sets Made Simple.",
                "Coordinated activewear sets for gym sessions, everyday errands, and confident full-look styling.",
                "Shop Sets",
                "View All Products",
                "/shop",
                "Shop complete looks",
                "Sets",
                "View Product",
                "No sets found",
                "Try another filter to view more ZivaFit sets.",
                "Set note",
                "Full looks without overthinking the outfit.",
                "This page is powered by the backend product catalogue and filters active products by the Sets category.",
                6,
                [
                    CreateCollectionPoint("bi bi-check2-circle", "Complete looks", 1),
                    CreateCollectionPoint("bi bi-check2-circle", "Premium matching colours", 2),
                    CreateCollectionPoint("bi bi-check2-circle", "Easy outfit building", 3)
                ],
                [
                    CreateCollectionImage("assets/sets1.png", "ZivaFit cream matching activewear set", 1),
                    CreateCollectionImage("assets/sets5.png", "ZivaFit cocoa studio matching set", 2),
                    CreateCollectionImage("assets/sets3.png", "ZivaFit olive matching activewear set", 3)
                ],
                [
                    CreateCollectionBenefit("bi bi-grid", "Complete outfit", "Matching tops and bottoms for a polished activewear look.", 1),
                    CreateCollectionBenefit("bi bi-stars", "Premium styling", "Warm neutral colours and flattering cuts.", 2),
                    CreateCollectionBenefit("bi bi-heart", "Confidence first", "Designed to help you feel pulled together with less effort.", 3)
                ]),

            CreateCollectionPage(
                "shorts",
                "Shorts",
                "category",
                "Shorts",
                "style",
                "ZivaFit Shorts",
                "Shorts Made To Move.",
                "Bike shorts, pocket shorts, gym shorts, and skorts designed for comfort, coverage, and confident movement.",
                "Shop Shorts",
                "View All Products",
                "/shop",
                "Shop warm-weather movement",
                "Shorts",
                "View Product",
                "No shorts found",
                "Try another filter to view more ZivaFit shorts and skorts.",
                "Fit note",
                "Movement should feel light, covered, and confident.",
                "This page is powered by the backend product catalogue and filters active products by the Shorts category.",
                7,
                [
                    CreateCollectionPoint("bi bi-check2-circle", "Easy movement", 1),
                    CreateCollectionPoint("bi bi-check2-circle", "Shorts and skorts", 2),
                    CreateCollectionPoint("bi bi-check2-circle", "Inclusive sizing", 3)
                ],
                [
                    CreateCollectionImage("assets/short3.png", "ZivaFit black pocket activewear shorts", 1),
                    CreateCollectionImage("assets/skort1.png", "ZivaFit cream activewear skort", 2),
                    CreateCollectionImage("assets/short1.png", "ZivaFit cream bike shorts", 3)
                ],
                [
                    CreateCollectionBenefit("bi bi-shield-check", "Comfortable coverage", "Designed for movement without feeling restricted.", 1),
                    CreateCollectionBenefit("bi bi-stars", "Skort options", "Feminine activewear styling with built-in practicality.", 2),
                    CreateCollectionBenefit("bi bi-droplet-half", "Gym-ready feel", "Easy pieces for training, walking, and everyday wear.", 3)
                ]),

            CreateCollectionPage(
                "accessories",
                "Accessories",
                "category",
                "Accessories",
                "style",
                "ZivaFit Accessories",
                "Carry Every Session.",
                "Gym bags, totes, travel bags, and everyday carry pieces designed to support your active lifestyle.",
                "Shop Accessories",
                "View All Products",
                "/shop",
                "Shop carry pieces",
                "Accessories",
                "View Product",
                "No accessories found",
                "Try another filter to view more ZivaFit accessories.",
                "Accessory note",
                "The full outfit includes what you carry too.",
                "This page is powered by the backend product catalogue and filters active products by the Accessories category.",
                8,
                [
                    CreateCollectionPoint("bi bi-check2-circle", "Gym-ready storage", 1),
                    CreateCollectionPoint("bi bi-check2-circle", "Everyday carry", 2),
                    CreateCollectionPoint("bi bi-check2-circle", "Premium neutral styling", 3)
                ],
                [
                    CreateCollectionImage("assets/gymbag1.png", "ZivaFit cocoa gym bag", 1),
                    CreateCollectionImage("assets/gymbag5.png", "ZivaFit black everyday gym bag", 2),
                    CreateCollectionImage("assets/gymbag3.png", "ZivaFit travel gym bag", 3)
                ],
                [
                    CreateCollectionBenefit("bi bi-bag-heart", "Carry all essentials", "Space for gym, work, and everyday movement needs.", 1),
                    CreateCollectionBenefit("bi bi-stars", "Clean styling", "Neutral accessories that pair with the full ZivaFit range.", 2),
                    CreateCollectionBenefit("bi bi-truck", "Nationwide delivery", "Prepared for delivery across South Africa.", 3)
                ])
        };

        context.StorefrontCollectionPages.AddRange(collectionPages);
        await context.SaveChangesAsync();
    }

    private static StorefrontHeroCard CreateHeroCard(
        string title,
        string imageUrl,
        string imageAlt,
        string cardClass,
        int displayOrder)
    {
        return new StorefrontHeroCard
        {
            Title = title,
            ImageUrl = imageUrl,
            ImageAlt = imageAlt,
            CardClass = cardClass,
            DisplayOrder = displayOrder,
            IsActive = true
        };
    }

    private static StorefrontCategoryCard CreateCategoryCard(
        string title,
        string route,
        string linkLabel,
        int displayOrder,
        List<StorefrontCategoryCardImage> images)
    {
        return new StorefrontCategoryCard
        {
            Title = title,
            Route = route,
            LinkLabel = linkLabel,
            DisplayOrder = displayOrder,
            IsActive = true,
            Images = images
        };
    }

    private static StorefrontCategoryCardImage CreateCategoryImage(
        string imageUrl,
        string imageAlt,
        int displayOrder)
    {
        return new StorefrontCategoryCardImage
        {
            ImageUrl = imageUrl,
            ImageAlt = imageAlt,
            DisplayOrder = displayOrder,
            IsActive = true
        };
    }

    private static StorefrontBenefitItem CreateBenefit(
        string iconClass,
        string title,
        string text,
        int displayOrder)
    {
        return new StorefrontBenefitItem
        {
            IconClass = iconClass,
            Title = title,
            Text = text,
            DisplayOrder = displayOrder,
            IsActive = true
        };
    }

    private static StorefrontCollectionPage CreateCollectionPage(
        string pageKey,
        string pageName,
        string mode,
        string? category,
        string filterType,
        string heroEyebrow,
        string heroTitle,
        string heroText,
        string heroButtonLabel,
        string secondaryButtonLabel,
        string secondaryButtonRoute,
        string collectionEyebrow,
        string collectionTitle,
        string productCardLinkLabel,
        string emptyTitle,
        string emptyText,
        string noteEyebrow,
        string noteTitle,
        string noteText,
        int displayOrder,
        List<StorefrontCollectionHeroPoint> heroPoints,
        List<StorefrontCollectionHeroImage> heroImages,
        List<StorefrontCollectionBenefit> benefits)
    {
        return new StorefrontCollectionPage
        {
            PageKey = pageKey,
            PageName = pageName,
            Mode = mode,
            Category = category,
            FilterType = filterType,
            HeroEyebrow = heroEyebrow,
            HeroTitle = heroTitle,
            HeroText = heroText,
            HeroButtonLabel = heroButtonLabel,
            SecondaryButtonLabel = secondaryButtonLabel,
            SecondaryButtonRoute = secondaryButtonRoute,
            CollectionEyebrow = collectionEyebrow,
            CollectionTitle = collectionTitle,
            ProductCardLinkLabel = productCardLinkLabel,
            EmptyTitle = emptyTitle,
            EmptyText = emptyText,
            NoteEyebrow = noteEyebrow,
            NoteTitle = noteTitle,
            NoteText = noteText,
            DisplayOrder = displayOrder,
            IsActive = true,
            HeroPoints = heroPoints,
            HeroImages = heroImages,
            Benefits = benefits
        };
    }

    private static StorefrontCollectionHeroPoint CreateCollectionPoint(
        string iconClass,
        string label,
        int displayOrder)
    {
        return new StorefrontCollectionHeroPoint
        {
            IconClass = iconClass,
            Label = label,
            DisplayOrder = displayOrder,
            IsActive = true
        };
    }

    private static StorefrontCollectionHeroImage CreateCollectionImage(
        string imageUrl,
        string imageAlt,
        int displayOrder)
    {
        return new StorefrontCollectionHeroImage
        {
            ImageUrl = imageUrl,
            ImageAlt = imageAlt,
            DisplayOrder = displayOrder,
            IsActive = true
        };
    }

    private static StorefrontCollectionBenefit CreateCollectionBenefit(
        string iconClass,
        string title,
        string text,
        int displayOrder)
    {
        return new StorefrontCollectionBenefit
        {
            IconClass = iconClass,
            Title = title,
            Text = text,
            DisplayOrder = displayOrder,
            IsActive = true
        };
    }
}