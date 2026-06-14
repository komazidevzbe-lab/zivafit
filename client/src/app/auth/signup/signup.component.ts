import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AccountService } from '../../_services/account.service';
import { Register } from '../../_models/register';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);

  model: Register = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  errors: Record<string, string> = {};
  generalError = '';
  showPassword = false;

  // ===============================
  // Register
  // Creates a customer account and logs the user in.
  // ===============================
  register() {
    this.errors = {};
    this.generalError = '';

    this.accountService.register(this.model).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: error => {
        if (error?.status === 409) {
          this.generalError = error.error?.message || 'Account already exists.';
          return;
        }

        if (typeof error?.error === 'object') {
          this.errors = error.error;
          this.generalError = error.error?.message || '';
        }
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}