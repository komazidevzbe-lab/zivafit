import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-admin-newsletter-management',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      eyebrow="ZivaFit Admin"
      heading="Newsletter Management"
      subtitle="Newsletter subscribers, sign-up records, and future email campaign tools will be managed here later."
      primaryLabel="Back To Dashboard"
      primaryRoute="/admin/dashboard"
      secondaryLabel="View Store"
      secondaryRoute="/"
    ></app-page-notice>
  `
})
export class AdminNewsletterManagementComponent { }