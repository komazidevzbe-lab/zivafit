import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Order, OrderParams } from '../../_models/order';
import { OrderService } from '../../_services/order.service';

@Component({
  selector: 'app-admin-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-order-management.component.html',
  styleUrl: './admin-order-management.component.css'
})
export class AdminOrderManagementComponent implements OnInit {
  private orderService = inject(OrderService);

  orders: Order[] = [];
  selectedOrder?: Order;

  isLoadingOrders = false;
  isLoadingDetails = false;
  isSavingStatus = false;

  loadingOrderId?: number;

  errorMessage = '';
  successMessage = '';

  filters: OrderParams = {
    search: '',
    orderStatus: '',
    paymentStatus: ''
  };

  readonly orderStatuses = [
    'PendingPayment',
    'Processing',
    'Packed',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Failed'
  ];

  readonly paymentStatuses = [
    'PendingPayment',
    'Paid',
    'Failed',
    'Cancelled'
  ];

  selectedStatus = '';

  // ===============================
  // Page setup
  // Loads backend orders for admin.
  // ===============================
  ngOnInit(): void {
    this.loadOrders();
  }

  // ===============================
  // Load orders
  // Loads admin order list from the database using the active filters.
  // ===============================
  loadOrders(): void {
    this.isLoadingOrders = true;
    this.errorMessage = '';

    this.orderService.getAdminOrders(this.cleanFilters()).subscribe({
      next: orders => {
        this.orders = orders;
        this.isLoadingOrders = false;

        if (!this.selectedOrder) {
          return;
        }

        const refreshedOrder = orders.find(order => order.id === this.selectedOrder?.id);

        if (!refreshedOrder) {
          this.selectedOrder = undefined;
          this.selectedStatus = '';
          return;
        }

        this.selectedOrder = {
          ...this.selectedOrder,
          ...refreshedOrder
        };

        this.selectedStatus = this.selectedOrder.orderStatus;
      },
      error: error => {
        this.isLoadingOrders = false;
        this.errorMessage = error?.error?.message || 'Could not load orders.';
      }
    });
  }

  // ===============================
  // Toggle order details
  // Opens the selected order inline under the row instead of using a vertical side panel.
  // ===============================
  toggleOrderDetails(order: Order): void {
    if (this.selectedOrder?.id === order.id && !this.isLoadingDetails) {
      this.selectedOrder = undefined;
      this.selectedStatus = '';
      return;
    }

    this.selectOrder(order);
  }

  // ===============================
  // Select order
  // Loads one full backend order for admin details.
  // ===============================
  selectOrder(order: Order): void {
    this.isLoadingDetails = true;
    this.loadingOrderId = order.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.orderService.getAdminOrder(order.id).subscribe({
      next: fullOrder => {
        this.selectedOrder = fullOrder;
        this.selectedStatus = fullOrder.orderStatus;
        this.isLoadingDetails = false;
        this.loadingOrderId = undefined;
      },
      error: error => {
        this.isLoadingDetails = false;
        this.loadingOrderId = undefined;
        this.errorMessage = error?.error?.message || 'Could not load order details.';
      }
    });
  }

  // ===============================
  // Update status
  // Admin updates fulfilment status through the backend.
  // ===============================
  updateStatus(): void {
    if (!this.selectedOrder || !this.selectedStatus) {
      return;
    }

    this.isSavingStatus = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.orderService.updateOrderStatus(this.selectedOrder.id, {
      orderStatus: this.selectedStatus
    }).subscribe({
      next: order => {
        this.selectedOrder = order;
        this.selectedStatus = order.orderStatus;

        this.orders = this.orders.map(item =>
          item.id === order.id ? order : item
        );

        this.isSavingStatus = false;
        this.successMessage = 'Order status updated successfully.';
      },
      error: error => {
        this.isSavingStatus = false;
        this.errorMessage = error?.error?.message || 'Could not update order status.';
      }
    });
  }

  // ===============================
  // Clear filters
  // Resets admin order filters and reloads database orders.
  // ===============================
  clearFilters(): void {
    this.filters = {
      search: '',
      orderStatus: '',
      paymentStatus: ''
    };

    this.loadOrders();
  }

  get paidOrders(): number {
    return this.orders.filter(order => order.paymentStatus === 'Paid').length;
  }

  get pendingPaymentOrders(): number {
    return this.orders.filter(order => order.paymentStatus === 'PendingPayment').length;
  }

  get processingOrders(): number {
    return this.orders.filter(order => order.orderStatus === 'Processing').length;
  }

  get visibleOrderValueText(): string {
    const total = this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    return this.formatPrice(total);
  }

  statusLabel(status: string): string {
    if (!status) {
      return '';
    }

    return status.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  getStatusClass(status: string): string {
    return status
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }

  trackByOrderId(index: number, order: Order): number {
    return order.id;
  }

  trackByOrderItemId(index: number, item: { id: number }): number {
    return item.id;
  }

  trackByPaymentId(index: number, payment: { id: number }): number {
    return payment.id;
  }

  private cleanFilters(): OrderParams {
    return {
      search: this.filters.search?.trim() || undefined,
      orderStatus: this.filters.orderStatus || undefined,
      paymentStatus: this.filters.paymentStatus || undefined
    };
  }

  private formatPrice(amount: number): string {
    return `R${amount.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }
}