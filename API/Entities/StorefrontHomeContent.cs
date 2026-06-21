namespace API.Entities;

public class StorefrontHomeContent
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

    public bool IsActive { get; set; } = true;

    public ICollection<StorefrontHeroCard> HeroCards { get; set; } = new List<StorefrontHeroCard>();
    public ICollection<StorefrontCategoryCard> CategoryCards { get; set; } = new List<StorefrontCategoryCard>();
    public ICollection<StorefrontBenefitItem> Benefits { get; set; } = new List<StorefrontBenefitItem>();
}