import {
  ProductCategory,
  ProductCollectionMode,
  ProductFilterType
} from './product-catalog';

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

export interface StorefrontCollectionHeroPoint {
  id: number;
  iconClass: string;
  label: string;
  displayOrder: number;
}

export interface StorefrontCollectionHeroImage {
  id: number;
  imageUrl: string;
  imageAlt: string;
  displayOrder: number;
}

export interface StorefrontCollectionBenefit {
  id: number;
  iconClass: string;
  title: string;
  text: string;
  displayOrder: number;
}

export interface StorefrontCollectionPage {
  id: number;

  pageKey: string;
  pageName: string;

  mode: ProductCollectionMode;
  category?: ProductCategory;
  filterType: ProductFilterType;

  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  heroButtonLabel: string;

  secondaryButtonLabel: string;
  secondaryButtonRoute: string;

  collectionEyebrow: string;
  collectionTitle: string;
  productCardLinkLabel: string;

  emptyTitle: string;
  emptyText: string;

  noteEyebrow: string;
  noteTitle: string;
  noteText: string;

  displayOrder: number;

  heroPoints: StorefrontCollectionHeroPoint[];
  heroImages: StorefrontCollectionHeroImage[];
  benefits: StorefrontCollectionBenefit[];
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

export interface UpdateStorefrontCollectionPageRequest {
  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  heroButtonLabel: string;

  secondaryButtonLabel: string;

  collectionEyebrow: string;
  collectionTitle: string;
  productCardLinkLabel: string;

  emptyTitle: string;
  emptyText: string;

  noteEyebrow: string;
  noteTitle: string;
  noteText: string;
}

export interface UpdateStorefrontCollectionHeroPointRequest {
  iconClass: string;
  label: string;
}

export interface UpdateStorefrontCollectionHeroImageRequest {
  imageAlt: string;
}

export interface UpdateStorefrontCollectionBenefitRequest {
  iconClass: string;
  title: string;
  text: string;
}