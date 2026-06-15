import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-sets',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="Sets"
      subtitle="Matching sets will be added in the product catalogue phase."
    ></app-page-notice>
  `
})
export class SetsComponent { }