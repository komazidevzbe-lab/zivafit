import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-admin-customer-management',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      eyebrow="ZivaFit Admin"
      heading="Customer Management"
      subtitle="Registered customer profiles, customer order history, and account information will be managed here later."
      primaryLabel="Back To Dashboard"
      primaryRoute="/admin/dashboard"
      secondaryLabel="Order Management"
      secondaryRoute="/admin/order-management"
    ></app-page-notice>
  `
})
export class AdminCustomerManagementComponent { }