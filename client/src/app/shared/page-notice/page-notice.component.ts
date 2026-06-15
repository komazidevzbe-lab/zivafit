import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-notice',
  standalone: true,
  templateUrl: './page-notice.component.html',
  styleUrl: './page-notice.component.css'
})
export class PageNoticeComponent {
  @Input() eyebrow = 'ZivaFit';
  @Input() heading = 'Page';
  @Input() subtitle = 'This page will be built in a later feature phase.';
}