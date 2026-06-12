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
        }
    }
}