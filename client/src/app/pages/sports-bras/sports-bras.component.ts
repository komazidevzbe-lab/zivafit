import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-sports-bras',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="Sports Bras"
      subtitle="Sports bra products will be added in the product catalogue phase."
    ></app-page-notice>
  `
})
export class SportsBrasComponent { }