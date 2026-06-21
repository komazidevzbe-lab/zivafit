using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateStorefrontCategoryCardImageDto
{
    [Required]
    public string ImageAlt { get; set; } = string.Empty;
}