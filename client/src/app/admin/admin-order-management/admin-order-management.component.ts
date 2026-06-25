import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Order, OrderParams } from '../../_models/order';
import { OrderService } from '../../_services/order.service';

@Component({
  selector: 'app-admin-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  errorMessage = '';
  successMessage = '';

  filters: OrderParams = {
    search: '',
    orderStatus: '',
    paymentStatus: ''
  };

  orderStatuses = [
    'PendingPayment',
    'Processing',
    'Packed',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Failed'
  ];

  paymentStatuses = [
    'PendingPayment',
    'Paid',
    'Failed',
    'Cancelled'
  ];

  selectedStatus = '';

  // ===============================
  // Page setup
  // Loads all orders for admin.
  // ===============================
  ngOnInit(): void {
    this.loadOrders();
  }

  // ===============================
  // Load orders
  // Loads admin order list using filters.
  // ===============================
  loadOrders() {
    this.isLoadingOrders = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.orderService.getAdminOrders(this.cleanFilters()).subscribe({
      next: orders => {
        this.orders = orders;
        this.isLoadingOrders = false;

        if (this.selectedOrder) {
          const refreshed = orders.find(order => order.id === this.selectedOrder?.id);
          this.selectedOrder = refreshed || this.selectedOrder;
          this.selectedStatus = this.selectedOrder.orderStatus;
        }
      },
      error: error => {
        this.isLoadingOrders = false;
        this.errorMessage = error?.error?.message || 'Could not load orders.';
      }
    });
  }

  // ===============================
  // Select order
  // Loads one full order for the details panel.
  // ===============================
  selectOrder(order: Order) {
    this.isLoadingDetails = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.orderService.getAdminOrder(order.id).subscribe({
      next: fullOrder => {
        this.selectedOrder = fullOrder;
        this.selectedStatus = fullOrder.orderStatus;
        this.isLoadingDetails = false;
      },
      error: error => {
        this.isLoadingDetails = false;
        this.errorMessage = error?.error?.message || 'Could not load order details.';
      }
    });
  }

  // ===============================
  // Update status
  // Admin updates fulfilment status.
  // ===============================
  updateStatus() {
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
        this.isSavingStatus = false;
        this.successMessage = 'Order status updated successfully.';
        this.loadOrders();
      },
      error: error => {
        this.isSavingStatus = false;
        this.errorMessage = error?.error?.message || 'Could not update order status.';
      }
    });
  }

  // ===============================
  // Clear filters
  // Resets admin order filters.
  // ===============================
  clearFilters() {
    this.filters = {
      search: '',
      orderStatus: '',
      paymentStatus: ''
    };

    this.loadOrders();
  }

  private cleanFilters(): OrderParams {
    return {
      search: this.filters.search?.trim() || undefined,
      orderStatus: this.filters.orderStatus || undefined,
      paymentStatus: this.filters.paymentStatus || undefined
    };
  }
}