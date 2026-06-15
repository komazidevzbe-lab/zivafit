import { Component } from '@angular/core';

import { PageNoticeComponent } from '../../shared/page-notice/page-notice.component';

@Component({
  selector: 'app-new-in',
  standalone: true,
  imports: [PageNoticeComponent],
  template: `
    <app-page-notice
      heading="New In"
      subtitle="Fresh ZivaFit activewear drops will live here soon."
    ></app-page-notice>
  `
})
export class NewInComponent { }