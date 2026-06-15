import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-saved-addresses',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="Saved Addresses"
      subtitle="Saved delivery addresses will be built later."
      primaryLabel="My Account"
      primaryRoute="/my-account"
      secondaryLabel="Edit Profile"
      secondaryRoute="/edit-profile"
    ></app-page-notice>
  `
})
export class SavedAddressesComponent { }