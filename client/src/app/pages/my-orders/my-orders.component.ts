import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Order } from '../../_models/order';
import { OrderService } from '../../_services/order.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders: Order[] = [];

  isLoading = false;
  errorMessage = '';

  // ===============================
  // Page setup
  // Loads customer orders from the backend.
  // ===============================
  ngOnInit(): void {
    this.loadOrders();
  }

  // ===============================
  // Load orders
  // Gets order history for the logged-in customer.
  // ===============================
  loadOrders() {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getMyOrders().subscribe({
      next: orders => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Could not load your orders.';
      }
    });
  }
}