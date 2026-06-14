import { Injectable, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  private spinnerService = inject(NgxSpinnerService);
  private busyRequestCount = 0;

  // ===============================
  // Busy
  // Shows spinner while API requests are running.
  // ===============================
  busy() {
    this.busyRequestCount++;

    this.spinnerService.show(undefined, {
      type: 'line-scale-party',
      bdColor: 'rgba(255, 250, 244, 0.8)',
      color: '#4a2f22'
    });
  }

  // ===============================
  // Idle
  // Hides spinner once all tracked API requests are complete.
  // ===============================
  idle() {
    this.busyRequestCount--;

    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}