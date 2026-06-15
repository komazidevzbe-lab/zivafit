import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      eyebrow="ZivaFit Admin"
      heading="Settings"
      subtitle="Store settings, delivery rules, account preferences, and admin configuration will be managed here later."
      primaryLabel="Back To Dashboard"
      primaryRoute="/admin/dashboard"
      secondaryLabel="View Store"
      secondaryRoute="/"
    ></app-page-notice>
  `
})
export class AdminSettingsComponent { }