import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-admin-review-management',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      eyebrow="ZivaFit Admin"
      heading="Review Management"
      subtitle="Product reviews, customer ratings, and review moderation tools will be managed here later."
      primaryLabel="Back To Dashboard"
      primaryRoute="/admin/dashboard"
      secondaryLabel="Products"
      secondaryRoute="/admin/products"
    ></app-page-notice>
  `
})
export class AdminReviewManagementComponent { }