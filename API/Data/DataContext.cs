using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int,
        IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
        IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options) { }

        public DbSet<PasswordResetCode> PasswordResetCodes { get; set; } = null!;

        public DbSet<ProductCategory> ProductCategories { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<ProductVariant> ProductVariants { get; set; } = null!;
        public DbSet<ProductImage> ProductImages { get; set; } = null!;

        public DbSet<StorefrontHomeContent> StorefrontHomeContents { get; set; } = null!;
        public DbSet<StorefrontHeroCard> StorefrontHeroCards { get; set; } = null!;
        public DbSet<StorefrontCategoryCard> StorefrontCategoryCards { get; set; } = null!;
        public DbSet<StorefrontCategoryCardImage> StorefrontCategoryCardImages { get; set; } = null!;
        public DbSet<StorefrontBenefitItem> StorefrontBenefitItems { get; set; } = null!;

        public DbSet<StorefrontCollectionPage> StorefrontCollectionPages { get; set; } = null!;
        public DbSet<StorefrontCollectionHeroPoint> StorefrontCollectionHeroPoints { get; set; } = null!;
        public DbSet<StorefrontCollectionHeroImage> StorefrontCollectionHeroImages { get; set; } = null!;
        public DbSet<StorefrontCollectionBenefit> StorefrontCollectionBenefits { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // ===============================
            // AppUser -> AppUserRole
            // Connects users to their roles through the custom join entity.
            // ===============================
            builder.Entity<AppUser>(b =>
            {
                b.HasMany(u => u.UserRoles)
                    .WithOne(ur => ur.User)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();
            });

            // ===============================
            // AppRole -> AppUserRole
            // Connects roles to users through the custom join entity.
            // ===============================
            builder.Entity<AppRole>(b =>
            {
                b.HasMany(r => r.UserRoles)
                    .WithOne(ur => ur.Role)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();
            });

            // ===============================
            // PasswordResetCode
            // Stores hashed password reset codes for real forgot-password flow.
            // ===============================
            builder.Entity<PasswordResetCode>(b =>
            {
                b.HasKey(prc => prc.Id);

                b.Property(prc => prc.CodeHash)
                    .IsRequired();

                b.Property(prc => prc.CreatedAt)
                    .IsRequired();

                b.Property(prc => prc.ExpiresAt)
                    .IsRequired();

                b.Property(prc => prc.IsUsed)
                    .IsRequired();

                b.HasOne(prc => prc.AppUser)
                    .WithMany()
                    .HasForeignKey(prc => prc.AppUserId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasIndex(prc => new { prc.AppUserId, prc.IsUsed, prc.ExpiresAt });
            });

            // ===============================
            // ProductCategory
            // Stores fixed store categories used by public shop pages and admin product forms.
            // No slug is stored because Angular routes and API filters handle navigation.
            // ===============================
            builder.Entity<ProductCategory>(b =>
            {
                b.HasKey(c => c.Id);

                b.Property(c => c.Name)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(c => c.Description)
                    .IsRequired()
                    .HasMaxLength(600);

                b.Property(c => c.ImageUrl)
                    .IsRequired()
                    .HasMaxLength(700);

                b.Property(c => c.ImageAlt)
                    .IsRequired()
                    .HasMaxLength(250);

                b.Property(c => c.DisplayOrder)
                    .IsRequired();

                b.Property(c => c.ShowInNavbar)
                    .IsRequired();

                b.Property(c => c.IsActive)
                    .IsRequired();

                b.HasIndex(c => c.Name)
                    .IsUnique();
            });

            // ===============================
            // Product
            // Stores catalogue products shown publicly and managed by admin.
            // ===============================
            builder.Entity<Product>(b =>
            {
                b.HasKey(p => p.Id);

                b.Property(p => p.Name)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(p => p.FitType)
                    .IsRequired()
                    .HasMaxLength(120);

                b.Property(p => p.Description)
                    .IsRequired()
                    .HasMaxLength(1400);

                b.Property(p => p.Price)
                    .HasColumnType("decimal(18,2)");

                b.Property(p => p.Colour)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(p => p.Badge)
                    .HasMaxLength(80);

                b.Property(p => p.DisplayOrder)
                    .IsRequired();

                b.Property(p => p.CreatedAt)
                    .IsRequired();

                b.Property(p => p.UpdatedAt)
                    .IsRequired();

                b.HasOne(p => p.Category)
                    .WithMany(c => c.Products)
                    .HasForeignKey(p => p.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                b.HasMany(p => p.Images)
                    .WithOne(i => i.Product)
                    .HasForeignKey(i => i.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasMany(p => p.Variants)
                    .WithOne(v => v.Product)
                    .HasForeignKey(v => v.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ===============================
            // ProductVariant
            // Stores product sizes, colours, SKU, and stock.
            // ===============================
            builder.Entity<ProductVariant>(b =>
            {
                b.HasKey(v => v.Id);

                b.Property(v => v.Size)
                    .IsRequired()
                    .HasMaxLength(40);

                b.Property(v => v.Colour)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(v => v.Sku)
                    .IsRequired()
                    .HasMaxLength(120);

                b.Property(v => v.StockQuantity)
                    .IsRequired();

                b.Property(v => v.IsActive)
                    .IsRequired();

                b.HasIndex(v => v.Sku)
                    .IsUnique();
            });

            // ===============================
            // ProductImage
            // Stores product image URLs and main image state.
            // ===============================
            builder.Entity<ProductImage>(b =>
            {
                b.HasKey(i => i.Id);

                b.Property(i => i.ImageUrl)
                    .IsRequired()
                    .HasMaxLength(700);

                b.Property(i => i.ImageAlt)
                    .IsRequired()
                    .HasMaxLength(250);

                b.Property(i => i.PublicId)
                    .HasMaxLength(250);

                b.Property(i => i.DisplayOrder)
                    .IsRequired();

                b.Property(i => i.IsMain)
                    .IsRequired();
            });

            // ===============================
            // StorefrontHomeContent
            // Stores Home page content so Angular does not hardcode it.
            // ===============================
            builder.Entity<StorefrontHomeContent>(b =>
            {
                b.HasKey(h => h.Id);

                b.Property(h => h.HeroEyebrow)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(h => h.HeroTitle)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(h => h.HeroHighlight)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(h => h.HeroText)
                    .IsRequired()
                    .HasMaxLength(600);

                b.Property(h => h.PrimaryButtonLabel)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(h => h.PrimaryButtonRoute)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(h => h.SecondaryButtonLabel)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(h => h.SecondaryButtonRoute)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(h => h.HeroVisualAriaLabel)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(h => h.CategorySectionAriaLabel)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(h => h.BestSellersEyebrow)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(h => h.BestSellersTitle)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(h => h.BestSellersLinkLabel)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(h => h.BestSellersLinkRoute)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(h => h.ProductCardLinkLabel)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(h => h.IsActive)
                    .IsRequired();

                b.HasMany(h => h.HeroCards)
                    .WithOne(c => c.HomeContent)
                    .HasForeignKey(c => c.HomeContentId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasMany(h => h.CategoryCards)
                    .WithOne(c => c.HomeContent)
                    .HasForeignKey(c => c.HomeContentId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasMany(h => h.Benefits)
                    .WithOne(bi => bi.HomeContent)
                    .HasForeignKey(bi => bi.HomeContentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ===============================
            // StorefrontHeroCard
            // Stores Home hero visual cards.
            // ===============================
            builder.Entity<StorefrontHeroCard>(b =>
            {
                b.HasKey(c => c.Id);

                b.Property(c => c.Title)
                    .IsRequired()
                    .HasMaxLength(120);

                b.Property(c => c.ImageUrl)
                    .IsRequired()
                    .HasMaxLength(700);

                b.Property(c => c.ImageAlt)
                    .IsRequired()
                    .HasMaxLength(250);

                b.Property(c => c.CardClass)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(c => c.DisplayOrder)
                    .IsRequired();

                b.Property(c => c.IsActive)
                    .IsRequired();
            });

            // ===============================
            // StorefrontCategoryCard
            // Stores Home category cards and fixed Angular routes.
            // These are not slugs and are not customer-managed.
            // ===============================
            builder.Entity<StorefrontCategoryCard>(b =>
            {
                b.HasKey(c => c.Id);

                b.Property(c => c.Title)
                    .IsRequired()
                    .HasMaxLength(120);

                b.Property(c => c.Route)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(c => c.LinkLabel)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(c => c.DisplayOrder)
                    .IsRequired();

                b.Property(c => c.IsActive)
                    .IsRequired();

                b.HasMany(c => c.Images)
                    .WithOne(i => i.CategoryCard)
                    .HasForeignKey(i => i.CategoryCardId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ===============================
            // StorefrontCategoryCardImage
            // Stores rotating images inside Home category cards.
            // ===============================
            builder.Entity<StorefrontCategoryCardImage>(b =>
            {
                b.HasKey(i => i.Id);

                b.Property(i => i.ImageUrl)
                    .IsRequired()
                    .HasMaxLength(700);

                b.Property(i => i.ImageAlt)
                    .IsRequired()
                    .HasMaxLength(250);

                b.Property(i => i.DisplayOrder)
                    .IsRequired();

                b.Property(i => i.IsActive)
                    .IsRequired();
            });

            // ===============================
            // StorefrontBenefitItem
            // Stores Home benefits.
            // ===============================
            builder.Entity<StorefrontBenefitItem>(b =>
            {
                b.HasKey(i => i.Id);

                b.Property(i => i.IconClass)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(i => i.Title)
                    .IsRequired()
                    .HasMaxLength(120);

                b.Property(i => i.Text)
                    .IsRequired()
                    .HasMaxLength(250);

                b.Property(i => i.DisplayOrder)
                    .IsRequired();

                b.Property(i => i.IsActive)
                    .IsRequired();
            });

            // ===============================
            // StorefrontCollectionPage
            // Stores public Shop, New In, and category page content.
            // PageKey is an internal content key, not a customer/admin editable slug.
            // ===============================
            builder.Entity<StorefrontCollectionPage>(b =>
            {
                b.HasKey(p => p.Id);

                b.Property(p => p.PageKey)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(p => p.PageName)
                    .IsRequired()
                    .HasMaxLength(120);

                b.Property(p => p.Mode)
                    .IsRequired()
                    .HasMaxLength(40);

                b.Property(p => p.Category)
                    .HasMaxLength(80);

                b.Property(p => p.FilterType)
                    .IsRequired()
                    .HasMaxLength(40);

                b.Property(p => p.HeroEyebrow)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(p => p.HeroTitle)
                    .IsRequired()
                    .HasMaxLength(180);

                b.Property(p => p.HeroText)
                    .IsRequired()
                    .HasMaxLength(700);

                b.Property(p => p.HeroButtonLabel)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(p => p.SecondaryButtonLabel)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(p => p.SecondaryButtonRoute)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(p => p.CollectionEyebrow)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(p => p.CollectionTitle)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(p => p.ProductCardLinkLabel)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(p => p.EmptyTitle)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(p => p.EmptyText)
                    .IsRequired()
                    .HasMaxLength(300);

                b.Property(p => p.NoteEyebrow)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(p => p.NoteTitle)
                    .IsRequired()
                    .HasMaxLength(200);

                b.Property(p => p.NoteText)
                    .IsRequired()
                    .HasMaxLength(900);

                b.Property(p => p.DisplayOrder)
                    .IsRequired();

                b.Property(p => p.IsActive)
                    .IsRequired();

                b.HasIndex(p => p.PageKey)
                    .IsUnique();

                b.HasMany(p => p.HeroPoints)
                    .WithOne(point => point.CollectionPage)
                    .HasForeignKey(point => point.CollectionPageId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasMany(p => p.HeroImages)
                    .WithOne(image => image.CollectionPage)
                    .HasForeignKey(image => image.CollectionPageId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasMany(p => p.Benefits)
                    .WithOne(benefit => benefit.CollectionPage)
                    .HasForeignKey(benefit => benefit.CollectionPageId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ===============================
            // StorefrontCollectionHeroPoint
            // Stores collection hero point chips.
            // ===============================
            builder.Entity<StorefrontCollectionHeroPoint>(b =>
            {
                b.HasKey(p => p.Id);

                b.Property(p => p.IconClass)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(p => p.Label)
                    .IsRequired()
                    .HasMaxLength(120);

                b.Property(p => p.DisplayOrder)
                    .IsRequired();

                b.Property(p => p.IsActive)
                    .IsRequired();
            });

            // ===============================
            // StorefrontCollectionHeroImage
            // Stores collection hero images.
            // ===============================
            builder.Entity<StorefrontCollectionHeroImage>(b =>
            {
                b.HasKey(i => i.Id);

                b.Property(i => i.ImageUrl)
                    .IsRequired()
                    .HasMaxLength(700);

                b.Property(i => i.ImageAlt)
                    .IsRequired()
                    .HasMaxLength(250);

                b.Property(i => i.DisplayOrder)
                    .IsRequired();

                b.Property(i => i.IsActive)
                    .IsRequired();
            });

            // ===============================
            // StorefrontCollectionBenefit
            // Stores collection benefit cards.
            // ===============================
            builder.Entity<StorefrontCollectionBenefit>(b =>
            {
                b.HasKey(i => i.Id);

                b.Property(i => i.IconClass)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(i => i.Title)
                    .IsRequired()
                    .HasMaxLength(120);

                b.Property(i => i.Text)
                    .IsRequired()
                    .HasMaxLength(300);

                b.Property(i => i.DisplayOrder)
                    .IsRequired();

                b.Property(i => i.IsActive)
                    .IsRequired();
            });
        }
    }
}