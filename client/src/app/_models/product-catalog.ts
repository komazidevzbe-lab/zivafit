export type ProductCategory =
  | 'Leggings'
  | 'Sports Bras'
  | 'Tops'
  | 'Sets'
  | 'Shorts'
  | 'Accessories';

export type ProductSort = 'featured' | 'priceLow' | 'priceHigh' | 'name';

export type ProductCollectionMode = 'all' | 'new' | 'category';

export type ProductFilterType = 'category' | 'style';

export interface ProductCatalogItem {
  id: number;
  name: string;
  category: ProductCategory;
  fitType: string;
  price: number;
  priceText: string;
  colour: string;
  imageUrl: string;
  imageAlt: string;
  badge: string;
  sizes: string[];
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface CollectionHeroImage {
  imageUrl: string;
  imageAlt: string;
}

export interface CollectionHeroPoint {
  iconClass: string;
  label: string;
}

export interface CollectionBenefit {
  iconClass: string;
  title: string;
  text: string;
}

export interface ShopCollectionConfig {
  pageKey: string;
  mode: ProductCollectionMode;
  category?: ProductCategory;
  filterType: ProductFilterType;

  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  heroButtonLabel: string;
  secondaryButtonLabel: string;
  secondaryButtonRoute: string;
  heroPoints: CollectionHeroPoint[];
  heroImages: CollectionHeroImage[];

  benefits: CollectionBenefit[];

  collectionEyebrow: string;
  collectionTitle: string;

  emptyTitle: string;
  emptyText: string;

  noteEyebrow: string;
  noteTitle: string;
  noteText: string;
}