export interface CartItem {
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

  availableStock: number;
}

export interface Cart {
  items: CartItem[];

  totalItems: number;

  subtotalAmount: number;
  subtotalText: string;

  deliveryMethod: string;
  deliveryMessage: string;
  deliveryRuleText: string;

  deliveryFee: number;
  deliveryFeeText: string;

  freeDeliveryThreshold: number;
  freeDeliveryThresholdText: string;

  amountUntilFreeDelivery: number;
  amountUntilFreeDeliveryText: string;

  isFreeDelivery: boolean;

  totalAmount: number;
  totalText: string;
}

export interface AddCartItem {
  productId: number;
  productVariantId: number;
  quantity: number;
}

export interface UpdateCartItem {
  quantity: number;
}