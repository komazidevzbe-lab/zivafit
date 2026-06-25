export interface CreateOrder {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

  addressLine1: string;
  addressLine2: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;

  deliveryMethod: string;
  customerNote: string;
}

export interface OrderItem {
  id: number;

  productId: number;
  productVariantId: number;

  productName: string;
  category: string;
  size: string;
  colour: string;
  sku: string;

  imageUrl: string;
  imageAlt: string;

  unitPrice: number;
  unitPriceText: string;

  quantity: number;

  lineTotal: number;
  lineTotalText: string;
}

export interface OrderPayment {
  id: number;

  provider: string;
  status: string;

  amount: number;
  amountText: string;

  merchantReference: string;
  gatewayPaymentId: string;

  createdAt: string;
  paidAt?: string | null;
  failedAt?: string | null;
  cancelledAt?: string | null;
}

export interface Order {
  id: number;

  orderNumber: string;

  orderStatus: string;
  paymentStatus: string;

  firstName: string;
  lastName: string;
  fullName: string;

  email: string;
  phoneNumber: string;

  addressLine1: string;
  addressLine2: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;

  deliveryMethod: string;
  customerNote: string;

  subtotalAmount: number;
  subtotalText: string;

  deliveryFee: number;
  deliveryFeeText: string;

  totalAmount: number;
  totalText: string;

  totalItems: number;

  createdAt: string;
  updatedAt: string;
  paidAt?: string | null;
  cancelledAt?: string | null;
  failedAt?: string | null;

  items: OrderItem[];
  payments: OrderPayment[];
}

export interface OrderParams {
  search?: string;
  orderStatus?: string;
  paymentStatus?: string;
}

export interface UpdateOrderStatus {
  orderStatus: string;
}