namespace API.DTOs;

public class StorefrontCollectionPageDto
{
    public int Id { get; set; }

    public string PageKey { get; set; } = string.Empty;
    public string PageName { get; set; } = string.Empty;

    public string Mode { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string FilterType { get; set; } = string.Empty;

    public string HeroEyebrow { get; set; } = string.Empty;
    public string HeroTitle { get; set; } = string.Empty;
    public string HeroText { get; set; } = string.Empty;
    public string HeroButtonLabel { get; set; } = string.Empty;

    public string SecondaryButtonLabel { get; set; } = string.Empty;
    public string SecondaryButtonRoute { get; set; } = string.Empty;

    public string CollectionEyebrow { get; set; } = string.Empty;
    public string CollectionTitle { get; set; } = string.Empty;
    public string ProductCardLinkLabel { get; set; } = string.Empty;

    public string EmptyTitle { get; set; } = string.Empty;
    public string EmptyText { get; set; } = string.Empty;

    public string NoteEyebrow { get; set; } = string.Empty;
    public string NoteTitle { get; set; } = string.Empty;
    public string NoteText { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }

    public List<StorefrontCollectionHeroPointDto> HeroPoints { get; set; } = [];
    public List<StorefrontCollectionHeroImageDto> HeroImages { get; set; } = [];
    public List<StorefrontCollectionBenefitDto> Benefits { get; set; } = [];
}