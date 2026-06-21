using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateStorefrontBenefitItemDto
{
    [Required]
    public string IconClass { get; set; } = string.Empty;

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Text { get; set; } = string.Empty;
}