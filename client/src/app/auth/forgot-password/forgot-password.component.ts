import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AccountService } from '../../_services/account.service';
import { ForgotPassword } from '../../_models/forgot-password';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);

  model: ForgotPassword = {
    email: ''
  };

  emailError = '';
  successMessage = '';
  generalError = '';

  // ===============================
  // Send reset code
  // Requests a real reset code email from the API.
  // ===============================
  sendResetCode() {
    this.emailError = '';
    this.successMessage = '';
    this.generalError = '';

    this.accountService.forgotPassword(this.model).subscribe({
      next: response => {
        this.successMessage = response.message;
        sessionStorage.setItem('resetEmail', this.model.email.trim().toLowerCase());

        this.router.navigate(['/reset-password'], {
          queryParams: { email: this.model.email.trim().toLowerCase() }
        });
      },
      error: error => {
        const err = error?.error;
        this.emailError = err?.email || '';
        this.generalError = err?.message || '';
      }
    });
  }
}