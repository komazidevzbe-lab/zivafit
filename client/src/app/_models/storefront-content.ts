export interface StorefrontHeroCard {
  id: number;
  title: string;
  imageUrl: string;
  imageAlt: string;
  cardClass: string;
  displayOrder: number;
}

export interface StorefrontCategoryCardImage {
  id: number;
  imageUrl: string;
  imageAlt: string;
  displayOrder: number;
}

export interface StorefrontCategoryCard {
  id: number;
  title: string;
  route: string;
  linkLabel: string;
  displayOrder: number;
  images: StorefrontCategoryCardImage[];
}

export interface StorefrontBenefitItem {
  id: number;
  iconClass: string;
  title: string;
  text: string;
  displayOrder: number;
}

export interface StorefrontHomeContent {
  id: number;

  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroText: string;

  primaryButtonLabel: string;
  primaryButtonRoute: string;

  secondaryButtonLabel: string;
  secondaryButtonRoute: string;

  bestSellersEyebrow: string;
  bestSellersTitle: string;
  bestSellersLinkLabel: string;
  bestSellersLinkRoute: string;
  productCardLinkLabel: string;

  heroCards: StorefrontHeroCard[];
  categoryCards: StorefrontCategoryCard[];
  benefits: StorefrontBenefitItem[];
}

export interface UpdateStorefrontHomeContentRequest {
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroText: string;

  primaryButtonLabel: string;
  secondaryButtonLabel: string;

  bestSellersEyebrow: string;
  bestSellersTitle: string;
  bestSellersLinkLabel: string;
  productCardLinkLabel: string;
}

export interface UpdateStorefrontHeroCardRequest {
  title: string;
  imageAlt: string;
}

export interface UpdateStorefrontCategoryCardImageRequest {
  imageAlt: string;
}

export interface UpdateStorefrontBenefitItemRequest {
  iconClass: string;
  title: string;
  text: string;
}