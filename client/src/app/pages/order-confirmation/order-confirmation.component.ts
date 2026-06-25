import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Order } from '../../_models/order';
import { OrderService } from '../../_services/order.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order?: Order;

  isLoading = false;
  errorMessage = '';
  waitingForPayment = false;

  private retryCount = 0;
  private readonly maxRetries = 8;
  private retryTimer?: ReturnType<typeof setTimeout>;

  // ===============================
  // Page setup
  // Reads orderId from PayFast return URL or session storage.
  // ===============================
  ngOnInit(): void {
    const orderIdFromQuery = this.route.snapshot.queryParamMap.get('orderId');
    const orderIdFromStorage = sessionStorage.getItem('lastOrderId');
    const orderId = Number(orderIdFromQuery || orderIdFromStorage);

    if (!orderId) {
      this.errorMessage = 'Order confirmation could not find an order ID.';
      return;
    }

    this.loadOrder(orderId);
  }

  ngOnDestroy(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  // ===============================
  // Load order
  // Retries while PayFast notify is still updating the backend.
  // ===============================
  loadOrder(orderId: number) {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getMyOrder(orderId).subscribe({
      next: order => {
        this.order = order;
        this.isLoading = false;

        if (order.paymentStatus === 'PendingPayment' && this.retryCount < this.maxRetries) {
          this.waitingForPayment = true;
          this.retryCount++;

          this.retryTimer = setTimeout(() => {
            this.loadOrder(orderId);
          }, 2500);

          return;
        }

        this.waitingForPayment = false;

        if (order.paymentStatus !== 'PendingPayment') {
          sessionStorage.removeItem('lastOrderId');
        }
      },
      error: error => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Could not load order confirmation.';
      }
    });
  }

  get isPaid() {
    return this.order?.paymentStatus === 'Paid';
  }

  get isFailed() {
    return this.order?.paymentStatus === 'Failed';
  }

  get isCancelled() {
    return this.order?.paymentStatus === 'Cancelled';
  }
}