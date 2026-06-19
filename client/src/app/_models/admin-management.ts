import { ProductCategory, ProductFilterType, ProductCollectionMode } from './product-catalog';

export interface AdminImage {
  imageUrl: string;
  imageAlt: string;
}

export interface AdminHeroCard {
  title: string;
  imageUrl: string;
  imageAlt: string;
  cardClass: string;
}

export interface AdminHomeCategoryCard {
  title: string;
  route: string;
  displayOrder: number;
  images: AdminImage[];
}

export interface AdminBenefitItem {
  iconClass: string;
  title: string;
  text: string;
}

export interface AdminHomeContent {
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroText: string;
  primaryButtonLabel: string;
  primaryButtonRoute: string;
  secondaryButtonLabel: string;
  secondaryButtonRoute: string;
  heroCards: AdminHeroCard[];
  categoryCards: AdminHomeCategoryCard[];
  benefits: AdminBenefitItem[];
  bestSellersEyebrow: string;
  bestSellersTitle: string;
  bestSellersLinkLabel: string;
}

export interface AdminCollectionHeroPoint {
  iconClass: string;
  label: string;
}

export interface AdminCollectionPageContent {
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
  heroPoints: AdminCollectionHeroPoint[];
  heroImages: AdminImage[];
  benefits: AdminBenefitItem[];
  collectionEyebrow: string;
  collectionTitle: string;
  emptyTitle: string;
  emptyText: string;
  noteEyebrow: string;
  noteTitle: string;
  noteText: string;
}

export interface AdminFooterContent {
  newsletterHeading: string;
  newsletterText: string;
  footerBrandText: string;
  supportEmail: string;
  supportHours: string;
  shippingText: string;
  instagramUrl: string;
  tiktokUrl: string;
  pinterestUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
}

export interface AdminProductImage {
  imageUrl: string;
  imageAlt: string;
  displayOrder: number;
  isMain: boolean;
}

export interface AdminProductVariant {
  id: number;
  productId: number;
  colour: string;
  size: string;
  stockQuantity: number;
  sku: string;
  isActive: boolean;
}

export interface AdminProduct {
  id: number;
  name: string;
  category: ProductCategory;
  fitType: string;
  description: string;
  price: number;
  colour: string;
  badge: string;
  sizes: string[];
  imageUrl: string;
  imageAlt: string;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  images: AdminProductImage[];
}

export interface AdminProductCategory {
  id: number;
  name: ProductCategory;
  description: string;
  imageUrl: string;
  imageAlt: string;
  displayOrder: number;
  showInNavbar: boolean;
  isActive: boolean;
}

export type AdminOrderStatus = 'Pending' | 'Paid' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
export type AdminPaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface AdminOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  total: number;
  paymentStatus: AdminPaymentStatus;
  orderStatus: AdminOrderStatus;
  itemCount: number;
}

export interface AdminCustomer {
  id: number;
  fullName: string;
  email: string;
  joinDate: string;
  orderCount: number;
  totalSpend: number;
  isActive: boolean;
}

export type AdminReviewStatus = 'Pending' | 'Approved' | 'Hidden';

export interface AdminReview {
  id: number;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  reviewDate: string;
  status: AdminReviewStatus;
}

export interface AdminNewsletterSubscriber {
  id: number;
  email: string;
  subscribedDate: string;
  isActive: boolean;
}

export interface AdminStoreSettings {
  storeName: string;
  supportEmail: string;
  businessHours: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  shippingMessage: string;
  currencyCode: string;
  country: string;
}