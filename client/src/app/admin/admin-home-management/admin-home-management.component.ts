import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-admin-home-management',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      eyebrow="ZivaFit Admin"
      heading="Home Management"
      subtitle="Homepage hero sections, category blocks, and promotional content will be managed here later."
      primaryLabel="Back To Dashboard"
      primaryRoute="/admin/dashboard"
      secondaryLabel="View Store"
      secondaryRoute="/"
    ></app-page-notice>
  `
})
export class AdminHomeManagementComponent { }