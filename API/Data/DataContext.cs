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
            // Plain reset codes are never stored in the database.
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
            // Stores the fixed store categories used by public shop pages and admin product forms.
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
            // Main catalogue product table.
            // Products connect to category, images, and variants.
            // ===============================
            builder.Entity<Product>(b =>
            {
                b.HasKey(p => p.Id);

                b.Property(p => p.Name)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(p => p.FitType)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(p => p.Description)
                    .IsRequired()
                    .HasMaxLength(1200);

                b.Property(p => p.Price)
                    .IsRequired()
                    .HasColumnType("decimal(18,2)");

                b.Property(p => p.Colour)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(p => p.Badge)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(p => p.IsNew)
                    .IsRequired();

                b.Property(p => p.IsBestSeller)
                    .IsRequired();

                b.Property(p => p.IsFeatured)
                    .IsRequired();

                b.Property(p => p.IsActive)
                    .IsRequired();

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

                b.HasMany(p => p.Variants)
                    .WithOne(v => v.Product)
                    .HasForeignKey(v => v.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasMany(p => p.Images)
                    .WithOne(i => i.Product)
                    .HasForeignKey(i => i.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasIndex(p => p.CategoryId);
                b.HasIndex(p => new { p.IsActive, p.DisplayOrder });
            });

            // ===============================
            // ProductVariant
            // Stores size, colour, SKU, and stock for each product.
            // ===============================
            builder.Entity<ProductVariant>(b =>
            {
                b.HasKey(v => v.Id);

                b.Property(v => v.Size)
                    .IsRequired()
                    .HasMaxLength(30);

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
            // Stores product images and optional Cloudinary public IDs.
            // The main image is used for product cards.
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
                    .HasMaxLength(500);

                b.Property(i => i.DisplayOrder)
                    .IsRequired();

                b.Property(i => i.IsMain)
                    .IsRequired();

                b.HasIndex(i => new { i.ProductId, i.DisplayOrder });
            });

            // ===============================
            // StorefrontHomeContent
            // Stores Home page hero text, buttons, category cards, benefits, and best seller labels.
            // This removes Home page hardcoding from Angular.
            // ===============================
            builder.Entity<StorefrontHomeContent>(b =>
            {
                b.HasKey(h => h.Id);

                b.Property(h => h.HeroEyebrow)
                    .IsRequired()
                    .HasMaxLength(120);

                b.Property(h => h.HeroTitle)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(h => h.HeroHighlight)
                    .IsRequired()
                    .HasMaxLength(160);

                b.Property(h => h.HeroText)
                    .IsRequired()
                    .HasMaxLength(700);

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
                    .HasMaxLength(200);

                b.Property(h => h.CategorySectionAriaLabel)
                    .IsRequired()
                    .HasMaxLength(200);

                b.Property(h => h.BestSellersEyebrow)
                    .IsRequired()
                    .HasMaxLength(120);

                b.Property(h => h.BestSellersTitle)
                    .IsRequired()
                    .HasMaxLength(120);

                b.Property(h => h.BestSellersLinkLabel)
                    .IsRequired()
                    .HasMaxLength(120);

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
            // Stores the hero visual cards for the Home page.
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
            // Stores the Home category cards and their fixed Angular routes.
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
            // Stores the rotating images inside each Home category card.
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
            // Stores the Home benefits strip.
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
        }
    }
}