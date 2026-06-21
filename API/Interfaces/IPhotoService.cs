namespace API.Interfaces;

public class PhotoUploadResult
{
    public string Url { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
}

public interface IPhotoService
{
    Task<PhotoUploadResult> UploadProductImageAsync(IFormFile file);
    Task<PhotoUploadResult> UploadStorefrontImageAsync(IFormFile file);
    Task DeleteProductImageAsync(string? publicId);
}