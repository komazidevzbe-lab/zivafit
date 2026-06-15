import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="Order Details"
      subtitle="Order details will be connected later."
      primaryLabel="Back To Orders"
      primaryRoute="/my-orders"
      secondaryLabel="My Account"
      secondaryRoute="/my-account"
    ></app-page-notice>
  `
})
export class OrderDetailsComponent { }