using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateStorefrontHeroCardDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string ImageAlt { get; set; } = string.Empty;
}