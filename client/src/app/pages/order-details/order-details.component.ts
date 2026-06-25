import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Order } from '../../_models/order';
import { OrderService } from '../../_services/order.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order?: Order;

  isLoading = false;
  errorMessage = '';

  // ===============================
  // Page setup
  // Reads order ID from route and loads customer order details.
  // ===============================
  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));

    if (!orderId) {
      this.errorMessage = 'Order ID is missing.';
      return;
    }

    this.loadOrder(orderId);
  }

  // ===============================
  // Load order
  // Gets one customer order from the backend.
  // ===============================
  loadOrder(orderId: number) {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getMyOrder(orderId).subscribe({
      next: order => {
        this.order = order;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Could not load order details.';
      }
    });
  }
}