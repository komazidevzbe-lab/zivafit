export interface InitiatePayFastPayment {
  orderId: number;
}

export interface PayFastPaymentResponse {
  orderId: number;

  orderNumber: string;
  paymentProvider: string;

  amount: number;
  amountText: string;

  paymentUrl: string;

  formFields: Record<string, string>;
}