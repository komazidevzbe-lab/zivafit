using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<DataContext>(opt =>
        {
            opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
        });

        services.AddCors();
        services.AddControllers();

        // ===============================
        // AutoMapper
        // Registers mapping profiles for DTO/entity mapping.
        // ===============================
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        // ===============================
        // Core services
        // TokenService creates JWT tokens for authenticated users.
        // ===============================
        services.AddScoped<ITokenService, TokenService>();

        // ===============================
        // Password reset services
        // Generates hashed reset codes and sends them through email.
        // ===============================
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IPasswordResetCodeService, PasswordResetCodeService>();

        // ===============================
        // Product catalogue services
        // Handles public products, admin product management, variants, stock, and images.
        // ===============================
        services.AddScoped<IProductCatalogService, ProductCatalogService>();

        // ===============================
        // Storefront content services
        // Handles seeded Home page content so the Home page is not hardcoded in Angular.
        // ===============================
        services.AddScoped<IStorefrontContentService, StorefrontContentService>();

        // ===============================
        // Photo service
        // Handles product image uploads and deletes through Cloudinary.
        // ===============================
        services.AddScoped<IPhotoService, PhotoService>();

        // ===============================
        // Cloudinary settings
        // Used by the product image upload service.
        // ===============================
        services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));

        // ===============================
        // Email settings
        // Used by Gmail SMTP for real password reset emails.
        // ===============================
        services.Configure<EmailSettings>(config.GetSection("EmailSettings"));

        return services;
    }
}