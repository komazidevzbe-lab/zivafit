import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="Checkout"
      subtitle="Checkout requires login and will be built later."
      primaryLabel="Back To Cart"
      primaryRoute="/cart"
      secondaryLabel="Continue Shopping"
      secondaryRoute="/shop"
    ></app-page-notice>
  `
})
export class CheckoutComponent { }