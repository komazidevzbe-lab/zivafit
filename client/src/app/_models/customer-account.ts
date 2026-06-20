import { ProductCategory } from './product-catalog';

export type CustomerOrderStatus =
  | 'Processing'
  | 'Packed'
  | 'Out for delivery'
  | 'Delivered'
  | 'Cancelled';

export type CustomerPaymentStatus =
  | 'Paid'
  | 'Pending'
  | 'Failed'
  | 'Refunded';

export type CustomerPaymentMethod =
  | 'PayFast'
  | 'Card'
  | 'EFT';

export interface CustomerAddress {
  id: number;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export interface CustomerOrderLine {
  productId: number;
  name: string;
  category: ProductCategory;
  fitType: string;
  colour: string;
  size: string;
  quantity: number;
  price: number;
  priceText: string;
  lineTotal: number;
  lineTotalText: string;
  imageUrl: string;
  imageAlt: string;
}

export interface CustomerOrder {
  id: number;
  orderNumber: string;
  orderDate: string;
  status: CustomerOrderStatus;
  paymentStatus: CustomerPaymentStatus;
  paymentMethod: CustomerPaymentMethod;
  contactEmail: string;
  contactPhone: string;
  deliveryAddress: CustomerAddress;
  subtotal: number;
  subtotalText: string;
  deliveryFee: number;
  deliveryFeeText: string;
  total: number;
  totalText: string;
  orderNote: string;
  lines: CustomerOrderLine[];
}