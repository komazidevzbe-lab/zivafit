import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-test-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css'
})
export class TestErrorsComponent {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  validationErrors: string[] = [];

  get400Error() {
    this.http.get(this.baseUrl + 'buggy/bad-request').subscribe({
      error: error => console.log(error)
    });
  }

  get401Error() {
    this.http.get(this.baseUrl + 'buggy/auth').subscribe({
      error: error => console.log(error)
    });
  }

  get404Error() {
    this.http.get(this.baseUrl + 'buggy/not-found').subscribe({
      error: error => console.log(error)
    });
  }

  get500Error() {
    this.http.get(this.baseUrl + 'buggy/server-error').subscribe({
      error: error => console.log(error)
    });
  }

  getAdminError() {
    this.http.get(this.baseUrl + 'buggy/admin').subscribe({
      error: error => console.log(error)
    });
  }
}