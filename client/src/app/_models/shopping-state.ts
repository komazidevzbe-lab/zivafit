import { ProductCatalogItem } from './product-catalog';

export interface CartItem {
  productId: number;
  size: string;
  quantity: number;
}

export interface CartLine {
  product: ProductCatalogItem;
  size: string;
  quantity: number;
  lineTotal: number;
  lineTotalText: string;
}