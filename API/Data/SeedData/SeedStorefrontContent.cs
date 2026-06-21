using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.SeedData;

public static class SeedStorefrontContent
{
    // ===============================
    // Seed storefront content
    // Creates Home page content in the database so Angular does not hardcode it.
    // ===============================
    public static async Task SeedAsync(DataContext context)
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
                CreateHeroCard(
                    "ZivaFit Set One",
                    "assets/sets1.png",
                    "Woman wearing a ZivaFit activewear set",
                    "card-one",
                    1),

                CreateHeroCard(
                    "ZivaFit Set Two",
                    "assets/sets2.png",
                    "Woman posing in a matching ZivaFit gym set",
                    "card-two",
                    2),

                CreateHeroCard(
                    "ZivaFit Set Three",
                    "assets/sets3.png",
                    "ZivaFit activewear set styled for gym and movement",
                    "card-three",
                    3),

                CreateHeroCard(
                    "ZivaFit Set Four",
                    "assets/sets4.png",
                    "Woman wearing a premium ZivaFit matching set",
                    "card-four",
                    4)
            ],
            CategoryCards =
            [
                CreateCategoryCard(
                    "Leggings",
                    "/leggings",
                    "Shop Now",
                    1,
                    [
                        CreateCategoryImage("assets/leggings1.png", "ZivaFit leggings product preview", 1),
                        CreateCategoryImage("assets/leggings2.png", "ZivaFit high-waist leggings product preview", 2),
                        CreateCategoryImage("assets/bootlegleggings1.png", "ZivaFit bootleg leggings product preview", 3),
                        CreateCategoryImage("assets/bootlegleggings2.png", "ZivaFit bootleg activewear leggings", 4)
                    ]),

                CreateCategoryCard(
                    "Sports Bras",
                    "/sports-bras",
                    "Shop Now",
                    2,
                    [
                        CreateCategoryImage("assets/bra1.png", "ZivaFit sports bra product preview", 1),
                        CreateCategoryImage("assets/bra2.png", "ZivaFit supportive sports bra", 2),
                        CreateCategoryImage("assets/bra3.png", "ZivaFit sports bra in activewear styling", 3),
                        CreateCategoryImage("assets/bra4.png", "ZivaFit gym sports bra product image", 4)
                    ]),

                CreateCategoryCard(
                    "Tops",
                    "/tops",
                    "Shop Now",
                    3,
                    [
                        CreateCategoryImage("assets/longsleeveshirt1.png", "ZivaFit long sleeve gym top", 1),
                        CreateCategoryImage("assets/longsleeveshirt2.png", "ZivaFit fitted long sleeve activewear top", 2),
                        CreateCategoryImage("assets/shortsleeveshirt1.png", "ZivaFit short sleeve activewear top", 3),
                        CreateCategoryImage("assets/shortsleeveshirt2.png", "ZivaFit gym top product preview", 4)
                    ]),

                CreateCategoryCard(
                    "Sets",
                    "/sets",
                    "Shop Now",
                    4,
                    [
                        CreateCategoryImage("assets/sets1.png", "ZivaFit matching activewear set", 1),
                        CreateCategoryImage("assets/sets2.png", "ZivaFit coordinated gym set", 2),
                        CreateCategoryImage("assets/sets3.png", "ZivaFit premium activewear set", 3),
                        CreateCategoryImage("assets/sets4.png", "ZivaFit matching set product preview", 4)
                    ]),

                CreateCategoryCard(
                    "Shorts",
                    "/shorts",
                    "Shop Now",
                    5,
                    [
                        CreateCategoryImage("assets/short1.png", "ZivaFit activewear shorts", 1),
                        CreateCategoryImage("assets/short2.png", "ZivaFit gym shorts product preview", 2),
                        CreateCategoryImage("assets/skort1.png", "ZivaFit skort activewear product preview", 3),
                        CreateCategoryImage("assets/skort2.png", "ZivaFit skirt shorts product preview", 4)
                    ]),

                CreateCategoryCard(
                    "Accessories",
                    "/accessories",
                    "Shop Now",
                    6,
                    [
                        CreateCategoryImage("assets/gymbag1.png", "ZivaFit gym bag product preview", 1),
                        CreateCategoryImage("assets/gymbag2.png", "ZivaFit neutral gym bag", 2),
                        CreateCategoryImage("assets/gymbag3.png", "ZivaFit duffle bag product preview", 3),
                        CreateCategoryImage("assets/gymbag5.png", "ZivaFit black gym bag", 4)
                    ])
            ],
            Benefits =
            [
                CreateBenefit("bi bi-leaf", "Sustainably Made", "Thoughtful fabrics for a better planet.", 1),
                CreateBenefit("bi bi-stars", "Squat-Proof Confidence", "Feel covered and supported always.", 2),
                CreateBenefit("bi bi-droplet", "Sweat-Wicking", "Stay cool, dry, and comfortable.", 3),
                CreateBenefit("bi bi-heart", "Designed for Every Body", "Inclusive sizing that celebrates you.", 4)
            ]
        };

        context.StorefrontHomeContents.Add(homeContent);

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
}