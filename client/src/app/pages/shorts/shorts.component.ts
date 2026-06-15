import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-shorts',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="Shorts"
      subtitle="Shorts products will be added in the product catalogue phase."
    ></app-page-notice>
  `
})
export class ShortsComponent { }