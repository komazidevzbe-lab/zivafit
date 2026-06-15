import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="Order Confirmation"
      subtitle="Order confirmation will be connected after checkout."
      primaryLabel="My Orders"
      primaryRoute="/my-orders"
      secondaryLabel="Continue Shopping"
      secondaryRoute="/shop"
    ></app-page-notice>
  `
})
export class OrderConfirmationComponent { }