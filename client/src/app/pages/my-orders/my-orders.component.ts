import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="My Orders"
      subtitle="Customer order history will be connected later."
      primaryLabel="Continue Shopping"
      primaryRoute="/shop"
      secondaryLabel="My Account"
      secondaryRoute="/my-account"
    ></app-page-notice>
  `
})
export class MyOrdersComponent { }