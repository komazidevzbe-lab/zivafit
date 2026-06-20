import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CustomerOrderLine } from '../../_models/customer-account';
import { CustomerOrderService } from '../../_services/customer-order.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent {
  customerOrderService = inject(CustomerOrderService);

  trackByOrderLine(index: number, line: CustomerOrderLine): string {
    return `${line.productId}-${line.size}`;
  }
}