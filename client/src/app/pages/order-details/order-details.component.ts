import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  CustomerOrder,
  CustomerOrderLine
} from '../../_models/customer-account';
import { CustomerOrderService } from '../../_services/customer-order.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);

  customerOrderService = inject(CustomerOrderService);
  order?: CustomerOrder;

  ngOnInit(): void {
    const orderNumber =
      this.route.snapshot.paramMap.get('orderNumber') ||
      this.route.snapshot.queryParamMap.get('orderNumber');

    this.order = this.customerOrderService.getOrderByNumber(orderNumber)
      || this.customerOrderService.lastOrder()
      || undefined;
  }

  trackByOrderLine(index: number, line: CustomerOrderLine): string {
    return `${line.productId}-${line.size}`;
  }
}