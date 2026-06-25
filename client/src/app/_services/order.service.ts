import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '../../environments/environment';
import { CreateOrder, Order, OrderParams, UpdateOrderStatus } from '../_models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // ===============================
  // Create order
  // Creates a pending-payment order from the customer's database cart.
  // ===============================
  createOrder(model: CreateOrder) {
    return this.http.post<Order>(this.baseUrl + 'orders/checkout', model);
  }

  // ===============================
  // Get my orders
  // Loads the logged-in customer's order history.
  // ===============================
  getMyOrders() {
    return this.http.get<Order[]>(this.baseUrl + 'orders/my-orders');
  }

  // ===============================
  // Get my order
  // Loads one order by database ID for the logged-in customer.
  // ===============================
  getMyOrder(orderId: number) {
    return this.http.get<Order>(this.baseUrl + `orders/${orderId}`);
  }

  // ===============================
  // Get admin orders
  // Loads all orders for admin order management.
  // ===============================
  getAdminOrders(orderParams?: OrderParams) {
    let params = new HttpParams();

    if (orderParams?.search) {
      params = params.set('search', orderParams.search);
    }

    if (orderParams?.orderStatus) {
      params = params.set('orderStatus', orderParams.orderStatus);
    }

    if (orderParams?.paymentStatus) {
      params = params.set('paymentStatus', orderParams.paymentStatus);
    }

    return this.http.get<Order[]>(this.baseUrl + 'adminorders', { params });
  }

  // ===============================
  // Get admin order
  // Loads one full order for admin.
  // ===============================
  getAdminOrder(orderId: number) {
    return this.http.get<Order>(this.baseUrl + `adminorders/${orderId}`);
  }

  // ===============================
  // Update order status
  // Admin updates fulfilment status.
  // ===============================
  updateOrderStatus(orderId: number, model: UpdateOrderStatus) {
    return this.http.put<Order>(this.baseUrl + `adminorders/${orderId}/status`, model);
  }
}