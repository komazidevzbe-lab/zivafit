export type ProductCategory = string;

export type ProductSort = 'featured' | 'priceLow' | 'priceHigh' | 'name';

export type ProductCollectionMode = 'all' | 'new' | 'category';

export type ProductFilterType = 'category' | 'style';

export interface ProductCatalogImage {
  id: number;
  productId: number;
  imageUrl: string;
  imageAlt: string;
  displayOrder: number;
  isMain: boolean;
}

export interface ProductCatalogVariant {
  id: number;
  productId: number;
  size: string;
  colour: string;
  sku: string;
  stockQuantity: number;
  isActive: boolean;
}

export interface ProductCatalogCategory {
  id: number;
  name: ProductCategory;
  description: string;
  imageUrl: string;
  imageAlt: string;
  displayOrder: number;
  showInNavbar: boolean;
  isActive: boolean;
}

export interface ProductCatalogItem {
  id: number;
  name: string;
  category: ProductCategory;
  fitType: string;
  description?: string;
  price: number;
  priceText: string;
  colour: string;
  badge: string;
  imageUrl: string;
  imageAlt: string;
  sizes: string[];
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  totalStock: number;
  images?: ProductCatalogImage[];
  variants?: ProductCatalogVariant[];
}

export interface ProductCatalogParams {
  category?: ProductCategory;
  search?: string;
  sort?: ProductSort | string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
}

export interface CreateProductRequest {
  name: string;
  category: ProductCategory;
  fitType: string;
  description: string;
  price: number;
  colour: string;
  badge: string;
  sizes: string[];
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

export interface UpdateProductRequest {
  name: string;
  category: ProductCategory;
  fitType: string;
  description: string;
  price: number;
  colour: string;
  badge: string;
  sizes: string[];
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

export interface CreateProductVariantRequest {
  size: string;
  colour: string;
  sku: string;
  stockQuantity: number;
  isActive: boolean;
}

export interface UpdateProductVariantRequest {
  size: string;
  colour: string;
  sku: string;
  stockQuantity: number;
  isActive: boolean;
}

export interface CreateProductImageRequest {
  imageAlt: string;
  isMain: boolean;
}

export interface UpdateProductImageRequest {
  imageAlt: string;
  isMain: boolean;
}