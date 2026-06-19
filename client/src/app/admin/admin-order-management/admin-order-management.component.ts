import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AdminOrder, AdminOrderStatus } from '../../_models/admin-management';
import { AdminManagementService } from '../../_services/admin-management.service';

@Component({
  selector: 'app-admin-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-order-management.component.html',
  styleUrl: './admin-order-management.component.css'
})
export class AdminOrderManagementComponent {
  private adminManagementService = inject(AdminManagementService);

  orderStatuses: AdminOrderStatus[] = ['Pending', 'Paid', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  get orders(): AdminOrder[] {
    return this.adminManagementService.orders();
  }

  get paidOrders(): number {
    return this.orders.filter(order => order.paymentStatus === 'Paid').length;
  }

  get pendingOrders(): number {
    return this.orders.filter(order => order.orderStatus === 'Pending').length;
  }

  updateStatus(orderId: number, status: AdminOrderStatus): void {
    this.adminManagementService.updateOrderStatus(orderId, status);
  }

  trackByOrderId(index: number, order: AdminOrder): number {
    return order.id;
  }
}