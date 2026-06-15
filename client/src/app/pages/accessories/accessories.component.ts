import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-accessories',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="Accessories"
      subtitle="Accessories will be added in the product catalogue phase."
    ></app-page-notice>
  `
})
export class AccessoriesComponent { }