import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="Cart"
      subtitle="Your ZivaFit cart will be connected later."
      primaryLabel="Continue Shopping"
      primaryRoute="/shop"
      secondaryLabel="My Account"
      secondaryRoute="/my-account"
    ></app-page-notice>
  `
})
export class CartComponent { }