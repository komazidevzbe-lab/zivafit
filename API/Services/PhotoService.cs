using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services;

public class PhotoService(IOptions<CloudinarySettings> cloudinaryOptions) : IPhotoService
{
    private readonly CloudinarySettings _cloudinarySettings = cloudinaryOptions.Value;

    // ===============================
    // Upload product image
    // Uploads an admin product image to Cloudinary and returns the secure URL.
    // ===============================
    public async Task<PhotoUploadResult> UploadProductImageAsync(IFormFile file)
    {
        return await UploadImageAsync(file, "zivafit/products");
    }

    // ===============================
    // Upload storefront image
    // Uploads Home/storefront images that are managed by admin.
    // Admin uploads a file and never types an image URL.
    // ===============================
    public async Task<PhotoUploadResult> UploadStorefrontImageAsync(IFormFile file)
    {
        return await UploadImageAsync(file, "zivafit/storefront");
    }

    // ===============================
    // Delete product image
    // Removes an uploaded Cloudinary image using its public ID.
    // Seeded local asset images have no public ID and are ignored.
    // ===============================
    public async Task DeleteProductImageAsync(string? publicId)
    {
        if (string.IsNullOrWhiteSpace(publicId))
            return;

        ValidateCloudinarySettings();

        var account = new Account(
            _cloudinarySettings.CloudName,
            _cloudinarySettings.ApiKey,
            _cloudinarySettings.ApiSecret
        );

        var cloudinary = new Cloudinary(account);

        var deleteParams = new DeletionParams(publicId);

        await cloudinary.DestroyAsync(deleteParams);
    }

    // ===============================
    // Upload image
    // Shared Cloudinary upload helper used by product and storefront uploads.
    // ===============================
    private async Task<PhotoUploadResult> UploadImageAsync(IFormFile file, string folder)
    {
        ValidateCloudinarySettings();

        if (file.Length == 0)
            throw new Exception("Image file is empty.");

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

        if (!allowedExtensions.Contains(extension))
            throw new Exception("Only JPG, JPEG, PNG, and WEBP images are allowed.");

        var account = new Account(
            _cloudinarySettings.CloudName,
            _cloudinarySettings.ApiKey,
            _cloudinarySettings.ApiSecret
        );

        var cloudinary = new Cloudinary(account);

        await using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = folder,
            UseFilename = false,
            UniqueFilename = true,
            Overwrite = false
        };

        var uploadResult = await cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
            throw new Exception(uploadResult.Error.Message);

        return new PhotoUploadResult
        {
            Url = uploadResult.SecureUrl.AbsoluteUri,
            PublicId = uploadResult.PublicId
        };
    }

    // ===============================
    // Validate Cloudinary settings
    // Prevents silent upload failures when settings are missing.
    // ===============================
    private void ValidateCloudinarySettings()
    {
        if (string.IsNullOrWhiteSpace(_cloudinarySettings.CloudName))
            throw new Exception("Cloudinary setting CloudName is missing.");

        if (string.IsNullOrWhiteSpace(_cloudinarySettings.ApiKey))
            throw new Exception("Cloudinary setting ApiKey is missing.");

        if (string.IsNullOrWhiteSpace(_cloudinarySettings.ApiSecret))
            throw new Exception("Cloudinary setting ApiSecret is missing.");
    }
}