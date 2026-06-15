import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="Edit Profile"
      subtitle="Profile editing will be built later."
      primaryLabel="My Account"
      primaryRoute="/my-account"
      secondaryLabel="Saved Addresses"
      secondaryRoute="/saved-addresses"
    ></app-page-notice>
  `
})
export class EditProfileComponent { }