import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../environments/environment';
import { InitiatePayFastPayment, PayFastPaymentResponse } from '../_models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // ===============================
  // Initiate PayFast payment
  // Requests signed PayFast form fields from the backend.
  // ===============================
  initiatePayFastPayment(model: InitiatePayFastPayment) {
    return this.http.post<PayFastPaymentResponse>(
      this.baseUrl + 'payments/payfast/initiate',
      model
    );
  }

  // ===============================
  // Cancel PayFast payment
  // Marks a pending-payment order as cancelled.
  // ===============================
  cancelPayFastPayment(orderId: number) {
    return this.http.post<{ message: string }>(
      this.baseUrl + `payments/payfast/cancel/${orderId}`,
      {}
    );
  }

  // ===============================
  // Submit PayFast form
  // PayFast requires POST form submission, so Angular builds a hidden form.
  // ===============================
  submitPayFastForm(payment: PayFastPaymentResponse) {
    const form = document.createElement('form');

    form.method = 'POST';
    form.action = payment.paymentUrl;
    form.style.display = 'none';

    Object.entries(payment.formFields).forEach(([key, value]) => {
      const input = document.createElement('input');

      input.type = 'hidden';
      input.name = key;
      input.value = value;

      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
}