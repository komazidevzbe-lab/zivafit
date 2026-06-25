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

        public DbSet<StoreCheckoutSettings> StoreCheckoutSettings { get; set; } = null!;

        public DbSet<CartItem> CartItems { get; set; } = null!;
        public DbSet<WishlistItem> WishlistItems { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderItem> OrderItems { get; set; } = null!;
        public DbSet<OrderPayment> OrderPayments { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppUser>(b =>
            {
                b.HasMany(u => u.UserRoles)
                    .WithOne(ur => ur.User)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();
            });

            builder.Entity<AppRole>(b =>
            {
                b.HasMany(r => r.UserRoles)
                    .WithOne(ur => ur.Role)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();
            });

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

            builder.Entity<StorefrontHomeContent>(b =>
            {
                b.HasKey(h => h.Id);

                b.Property(h => h.HeroEyebrow).IsRequired().HasMaxLength(160);
                b.Property(h => h.HeroTitle).IsRequired().HasMaxLength(160);
                b.Property(h => h.HeroHighlight).IsRequired().HasMaxLength(160);
                b.Property(h => h.HeroText).IsRequired().HasMaxLength(600);
                b.Property(h => h.PrimaryButtonLabel).IsRequired().HasMaxLength(80);
                b.Property(h => h.PrimaryButtonRoute).IsRequired().HasMaxLength(160);
                b.Property(h => h.SecondaryButtonLabel).IsRequired().HasMaxLength(80);
                b.Property(h => h.SecondaryButtonRoute).IsRequired().HasMaxLength(160);
                b.Property(h => h.HeroVisualAriaLabel).IsRequired().HasMaxLength(160);
                b.Property(h => h.CategorySectionAriaLabel).IsRequired().HasMaxLength(160);
                b.Property(h => h.BestSellersEyebrow).IsRequired().HasMaxLength(160);
                b.Property(h => h.BestSellersTitle).IsRequired().HasMaxLength(160);
                b.Property(h => h.BestSellersLinkLabel).IsRequired().HasMaxLength(80);
                b.Property(h => h.BestSellersLinkRoute).IsRequired().HasMaxLength(160);
                b.Property(h => h.ProductCardLinkLabel).IsRequired().HasMaxLength(80);
                b.Property(h => h.IsActive).IsRequired();

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

            builder.Entity<StorefrontHeroCard>(b =>
            {
                b.HasKey(c => c.Id);

                b.Property(c => c.Title).IsRequired().HasMaxLength(120);
                b.Property(c => c.ImageUrl).IsRequired().HasMaxLength(700);
                b.Property(c => c.ImageAlt).IsRequired().HasMaxLength(250);
                b.Property(c => c.CardClass).IsRequired().HasMaxLength(80);
                b.Property(c => c.DisplayOrder).IsRequired();
                b.Property(c => c.IsActive).IsRequired();
            });

            builder.Entity<StorefrontCategoryCard>(b =>
            {
                b.HasKey(c => c.Id);

                b.Property(c => c.Title).IsRequired().HasMaxLength(120);
                b.Property(c => c.Route).IsRequired().HasMaxLength(160);
                b.Property(c => c.LinkLabel).IsRequired().HasMaxLength(80);
                b.Property(c => c.DisplayOrder).IsRequired();
                b.Property(c => c.IsActive).IsRequired();

                b.HasMany(c => c.Images)
                    .WithOne(i => i.CategoryCard)
                    .HasForeignKey(i => i.CategoryCardId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<StorefrontCategoryCardImage>(b =>
            {
                b.HasKey(i => i.Id);

                b.Property(i => i.ImageUrl).IsRequired().HasMaxLength(700);
                b.Property(i => i.ImageAlt).IsRequired().HasMaxLength(250);
                b.Property(i => i.DisplayOrder).IsRequired();
                b.Property(i => i.IsActive).IsRequired();
            });

            builder.Entity<StorefrontBenefitItem>(b =>
            {
                b.HasKey(i => i.Id);

                b.Property(i => i.IconClass).IsRequired().HasMaxLength(80);
                b.Property(i => i.Title).IsRequired().HasMaxLength(120);
                b.Property(i => i.Text).IsRequired().HasMaxLength(250);
                b.Property(i => i.DisplayOrder).IsRequired();
                b.Property(i => i.IsActive).IsRequired();
            });

            builder.Entity<StorefrontCollectionPage>(b =>
            {
                b.HasKey(p => p.Id);

                b.Property(p => p.PageKey).IsRequired().HasMaxLength(80);
                b.Property(p => p.PageName).IsRequired().HasMaxLength(120);
                b.Property(p => p.Mode).IsRequired().HasMaxLength(40);
                b.Property(p => p.Category).HasMaxLength(80);
                b.Property(p => p.FilterType).IsRequired().HasMaxLength(40);
                b.Property(p => p.HeroEyebrow).IsRequired().HasMaxLength(160);
                b.Property(p => p.HeroTitle).IsRequired().HasMaxLength(180);
                b.Property(p => p.HeroText).IsRequired().HasMaxLength(700);
                b.Property(p => p.HeroButtonLabel).IsRequired().HasMaxLength(80);
                b.Property(p => p.SecondaryButtonLabel).IsRequired().HasMaxLength(80);
                b.Property(p => p.SecondaryButtonRoute).IsRequired().HasMaxLength(160);
                b.Property(p => p.CollectionEyebrow).IsRequired().HasMaxLength(160);
                b.Property(p => p.CollectionTitle).IsRequired().HasMaxLength(160);
                b.Property(p => p.ProductCardLinkLabel).IsRequired().HasMaxLength(80);
                b.Property(p => p.EmptyTitle).IsRequired().HasMaxLength(160);
                b.Property(p => p.EmptyText).IsRequired().HasMaxLength(300);
                b.Property(p => p.NoteEyebrow).IsRequired().HasMaxLength(160);
                b.Property(p => p.NoteTitle).IsRequired().HasMaxLength(200);
                b.Property(p => p.NoteText).IsRequired().HasMaxLength(900);
                b.Property(p => p.DisplayOrder).IsRequired();
                b.Property(p => p.IsActive).IsRequired();

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

            builder.Entity<StorefrontCollectionHeroPoint>(b =>
            {
                b.HasKey(p => p.Id);

                b.Property(p => p.IconClass).IsRequired().HasMaxLength(80);
                b.Property(p => p.Label).IsRequired().HasMaxLength(120);
                b.Property(p => p.DisplayOrder).IsRequired();
                b.Property(p => p.IsActive).IsRequired();
            });

            builder.Entity<StorefrontCollectionHeroImage>(b =>
            {
                b.HasKey(i => i.Id);

                b.Property(i => i.ImageUrl).IsRequired().HasMaxLength(700);
                b.Property(i => i.ImageAlt).IsRequired().HasMaxLength(250);
                b.Property(i => i.DisplayOrder).IsRequired();
                b.Property(i => i.IsActive).IsRequired();
            });

            builder.Entity<StorefrontCollectionBenefit>(b =>
            {
                b.HasKey(i => i.Id);

                b.Property(i => i.IconClass).IsRequired().HasMaxLength(80);
                b.Property(i => i.Title).IsRequired().HasMaxLength(120);
                b.Property(i => i.Text).IsRequired().HasMaxLength(250);
                b.Property(i => i.DisplayOrder).IsRequired();
                b.Property(i => i.IsActive).IsRequired();
            });

            builder.Entity<StoreCheckoutSettings>(b =>
            {
                b.HasKey(s => s.Id);

                b.Property(s => s.SettingsName)
                    .IsRequired()
                    .HasMaxLength(120);

                b.Property(s => s.DeliveryMethodName)
                    .IsRequired()
                    .HasMaxLength(80);

                b.Property(s => s.DeliveryMessage)
                    .IsRequired()
                    .HasMaxLength(250);

                b.Property(s => s.DeliveryRuleText)
                    .IsRequired()
                    .HasMaxLength(600);

                b.Property(s => s.SmallOrderDeliveryFee)
                    .HasColumnType("decimal(18,2)");

                b.Property(s => s.MediumDeliveryThreshold)
                    .HasColumnType("decimal(18,2)");

                b.Property(s => s.MediumOrderDeliveryFee)
                    .HasColumnType("decimal(18,2)");

                b.Property(s => s.FreeDeliveryThreshold)
                    .HasColumnType("decimal(18,2)");

                b.Property(s => s.IsActive)
                    .IsRequired();

                b.Property(s => s.CreatedAt)
                    .IsRequired();

                b.Property(s => s.UpdatedAt)
                    .IsRequired();

                b.HasIndex(s => s.IsActive);
            });

            builder.Entity<CartItem>(b =>
            {
                b.HasKey(c => c.Id);

                b.Property(c => c.Quantity).IsRequired();
                b.Property(c => c.CreatedAt).IsRequired();
                b.Property(c => c.UpdatedAt).IsRequired();

                b.HasOne(c => c.AppUser)
                    .WithMany()
                    .HasForeignKey(c => c.AppUserId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(c => c.Product)
                    .WithMany()
                    .HasForeignKey(c => c.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);

                b.HasOne(c => c.ProductVariant)
                    .WithMany()
                    .HasForeignKey(c => c.ProductVariantId)
                    .OnDelete(DeleteBehavior.Restrict);

                b.HasIndex(c => new { c.AppUserId, c.ProductVariantId })
                    .IsUnique();
            });

            builder.Entity<WishlistItem>(b =>
            {
                b.HasKey(w => w.Id);

                b.Property(w => w.CreatedAt).IsRequired();

                b.HasOne(w => w.AppUser)
                    .WithMany()
                    .HasForeignKey(w => w.AppUserId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(w => w.Product)
                    .WithMany()
                    .HasForeignKey(w => w.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasIndex(w => new { w.AppUserId, w.ProductId })
                    .IsUnique();
            });

            builder.Entity<Order>(b =>
            {
                b.HasKey(o => o.Id);

                b.Property(o => o.OrderNumber).IsRequired().HasMaxLength(80);
                b.Property(o => o.OrderStatus).IsRequired().HasMaxLength(80);
                b.Property(o => o.PaymentStatus).IsRequired().HasMaxLength(80);

                b.Property(o => o.FirstName).IsRequired().HasMaxLength(80);
                b.Property(o => o.LastName).IsRequired().HasMaxLength(80);
                b.Property(o => o.Email).IsRequired().HasMaxLength(160);
                b.Property(o => o.PhoneNumber).IsRequired().HasMaxLength(40);

                b.Property(o => o.AddressLine1).IsRequired().HasMaxLength(180);
                b.Property(o => o.AddressLine2).HasMaxLength(180);
                b.Property(o => o.Suburb).IsRequired().HasMaxLength(120);
                b.Property(o => o.City).IsRequired().HasMaxLength(120);
                b.Property(o => o.Province).IsRequired().HasMaxLength(120);
                b.Property(o => o.PostalCode).IsRequired().HasMaxLength(20);
                b.Property(o => o.DeliveryMethod).IsRequired().HasMaxLength(80);
                b.Property(o => o.CustomerNote).HasMaxLength(600);

                b.Property(o => o.SubtotalAmount).HasColumnType("decimal(18,2)");
                b.Property(o => o.DeliveryFee).HasColumnType("decimal(18,2)");
                b.Property(o => o.TotalAmount).HasColumnType("decimal(18,2)");

                b.Property(o => o.CreatedAt).IsRequired();
                b.Property(o => o.UpdatedAt).IsRequired();

                b.HasOne(o => o.AppUser)
                    .WithMany()
                    .HasForeignKey(o => o.AppUserId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasMany(o => o.Items)
                    .WithOne(i => i.Order)
                    .HasForeignKey(i => i.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasMany(o => o.Payments)
                    .WithOne(p => p.Order)
                    .HasForeignKey(p => p.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasIndex(o => o.OrderNumber)
                    .IsUnique();

                b.HasIndex(o => new { o.AppUserId, o.CreatedAt });
            });

            builder.Entity<OrderItem>(b =>
            {
                b.HasKey(i => i.Id);

                b.Property(i => i.ProductName).IsRequired().HasMaxLength(160);
                b.Property(i => i.Category).IsRequired().HasMaxLength(80);
                b.Property(i => i.Size).IsRequired().HasMaxLength(40);
                b.Property(i => i.Colour).IsRequired().HasMaxLength(80);
                b.Property(i => i.Sku).IsRequired().HasMaxLength(120);
                b.Property(i => i.ImageUrl).IsRequired().HasMaxLength(700);
                b.Property(i => i.ImageAlt).IsRequired().HasMaxLength(250);

                b.Property(i => i.UnitPrice).HasColumnType("decimal(18,2)");
                b.Property(i => i.LineTotal).HasColumnType("decimal(18,2)");
                b.Property(i => i.Quantity).IsRequired();

                b.HasOne(i => i.Product)
                    .WithMany()
                    .HasForeignKey(i => i.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);

                b.HasOne(i => i.ProductVariant)
                    .WithMany()
                    .HasForeignKey(i => i.ProductVariantId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<OrderPayment>(b =>
            {
                b.HasKey(p => p.Id);

                b.Property(p => p.Provider).IsRequired().HasMaxLength(80);
                b.Property(p => p.Status).IsRequired().HasMaxLength(80);
                b.Property(p => p.Amount).HasColumnType("decimal(18,2)");
                b.Property(p => p.MerchantReference).IsRequired().HasMaxLength(120);
                b.Property(p => p.GatewayPaymentId).HasMaxLength(160);
                b.Property(p => p.RawGatewayResponse).HasColumnType("nvarchar(max)");
                b.Property(p => p.CreatedAt).IsRequired();

                b.HasIndex(p => p.MerchantReference);
                b.HasIndex(p => p.GatewayPaymentId);
            });
        }
    }
}