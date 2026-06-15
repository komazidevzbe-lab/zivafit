import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="Shop"
      subtitle="The full ZivaFit product browsing page will be connected later."
    ></app-page-notice>
  `
})
export class ShopComponent { }