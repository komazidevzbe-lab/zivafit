import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-admin-order-management',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      eyebrow="ZivaFit Admin"
      heading="Order Management"
      subtitle="Customer orders, payment status, delivery progress, and fulfilment updates will be managed here later."
      primaryLabel="Back To Dashboard"
      primaryRoute="/admin/dashboard"
      secondaryLabel="View Store"
      secondaryRoute="/"
    ></app-page-notice>
  `
})
export class AdminOrderManagementComponent { }