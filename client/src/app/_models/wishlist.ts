export interface WishlistItem {
  id: number;

  productId: number;

  name: string;
  category: string;
  fitType: string;

  price: number;
  priceText: string;

  colour: string;
  badge: string;

  imageUrl: string;
  imageAlt: string;

  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;

  createdAt: string;
}