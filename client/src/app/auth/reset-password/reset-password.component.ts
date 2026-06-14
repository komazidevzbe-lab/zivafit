import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AccountService } from '../../_services/account.service';
import { ResetPassword } from '../../_models/reset-password';
import { VerifyResetCode } from '../../_models/verify-reset-code';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  model: ResetPassword = {
    email: '',
    code: '',
    password: '',
    confirmPassword: ''
  };

  codeVerified = false;
  errors: Record<string, string> = {};
  generalError = '';
  successMessage = '';
  showPassword = false;

  // ===============================
  // Page setup
  // Reads email from query string or session storage.
  // ===============================
  ngOnInit(): void {
    const emailFromQuery = this.route.snapshot.queryParamMap.get('email');
    const emailFromStorage = sessionStorage.getItem('resetEmail');

    this.model.email = emailFromQuery || emailFromStorage || '';
  }

  // ===============================
  // Verify code
  // Confirms the emailed reset code before showing password fields.
  // ===============================
  verifyCode() {
    this.clearMessages();

    const verifyModel: VerifyResetCode = {
      email: this.model.email,
      code: this.model.code
    };

    this.accountService.verifyResetCode(verifyModel).subscribe({
      next: response => {
        this.codeVerified = true;
        this.successMessage = response.message;
      },
      error: error => {
        const err = error?.error;
        this.errors = typeof err === 'object' ? err : {};
        this.generalError = err?.message || 'Invalid or expired reset code.';
      }
    });
  }

  // ===============================
  // Reset password
  // Sends email, code, password, and confirm password to the API.
  // ===============================
  resetPassword() {
    this.clearMessages();

    this.accountService.resetPassword(this.model).subscribe({
      next: response => {
        this.successMessage = response.message;
        sessionStorage.removeItem('resetEmail');

        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 900);
      },
      error: error => {
        const err = error?.error;
        this.errors = typeof err === 'object' ? err : {};
        this.generalError = err?.message || '';
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private clearMessages() {
    this.errors = {};
    this.generalError = '';
    this.successMessage = '';
  }
}