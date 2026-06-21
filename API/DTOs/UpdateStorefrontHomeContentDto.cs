using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateStorefrontHomeContentDto
{
    [Required]
    public string HeroEyebrow { get; set; } = string.Empty;

    [Required]
    public string HeroTitle { get; set; } = string.Empty;

    [Required]
    public string HeroHighlight { get; set; } = string.Empty;

    [Required]
    public string HeroText { get; set; } = string.Empty;

    [Required]
    public string PrimaryButtonLabel { get; set; } = string.Empty;

    [Required]
    public string SecondaryButtonLabel { get; set; } = string.Empty;

    [Required]
    public string HeroVisualAriaLabel { get; set; } = string.Empty;

    [Required]
    public string CategorySectionAriaLabel { get; set; } = string.Empty;

    [Required]
    public string BestSellersEyebrow { get; set; } = string.Empty;

    [Required]
    public string BestSellersTitle { get; set; } = string.Empty;

    [Required]
    public string BestSellersLinkLabel { get; set; } = string.Empty;

    [Required]
    public string ProductCardLinkLabel { get; set; } = string.Empty;
}