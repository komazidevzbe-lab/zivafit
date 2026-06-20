import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CustomerOrder } from '../../_models/customer-account';
import { CustomerOrderService } from '../../_services/customer-order.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent {
  customerOrderService = inject(CustomerOrderService);

  get orders(): CustomerOrder[] {
    return this.customerOrderService.orders();
  }

  get latestOrderNumber(): string {
    if (this.orders.length === 0)
      return 'None';

    return this.orders[0].orderNumber;
  }

  get latestOrderStatus(): string {
    if (this.orders.length === 0)
      return 'No Status';

    return this.orders[0].status;
  }

  trackByOrderId(index: number, order: CustomerOrder): number {
    return order.id;
  }
}