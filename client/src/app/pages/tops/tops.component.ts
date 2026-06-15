import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-tops',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="Tops"
      subtitle="Tops products will be added in the product catalogue phase."
    ></app-page-notice>
  `
})
export class TopsComponent { }