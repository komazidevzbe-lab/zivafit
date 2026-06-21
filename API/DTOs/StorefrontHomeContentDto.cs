namespace API.DTOs;

public class StorefrontHomeContentDto
{
    public int Id { get; set; }

    public string HeroEyebrow { get; set; } = string.Empty;
    public string HeroTitle { get; set; } = string.Empty;
    public string HeroHighlight { get; set; } = string.Empty;
    public string HeroText { get; set; } = string.Empty;

    public string PrimaryButtonLabel { get; set; } = string.Empty;
    public string PrimaryButtonRoute { get; set; } = string.Empty;

    public string SecondaryButtonLabel { get; set; } = string.Empty;
    public string SecondaryButtonRoute { get; set; } = string.Empty;

    public string HeroVisualAriaLabel { get; set; } = string.Empty;
    public string CategorySectionAriaLabel { get; set; } = string.Empty;

    public string BestSellersEyebrow { get; set; } = string.Empty;
    public string BestSellersTitle { get; set; } = string.Empty;
    public string BestSellersLinkLabel { get; set; } = string.Empty;
    public string BestSellersLinkRoute { get; set; } = string.Empty;
    public string ProductCardLinkLabel { get; set; } = string.Empty;

    public List<StorefrontHeroCardDto> HeroCards { get; set; } = [];
    public List<StorefrontCategoryCardDto> CategoryCards { get; set; } = [];
    public List<StorefrontBenefitItemDto> Benefits { get; set; } = [];
}