import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="My Account"
      subtitle="Customer profile management will be built later."
      primaryLabel="Edit Profile"
      primaryRoute="/edit-profile"
      secondaryLabel="My Orders"
      secondaryRoute="/my-orders"
    ></app-page-notice>
  `
})
export class MyAccountComponent { }