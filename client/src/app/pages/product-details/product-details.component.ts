import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="Product Details"
      subtitle="Product details will be connected once products exist."
    ></app-page-notice>
  `
})
export class ProductDetailsComponent { }