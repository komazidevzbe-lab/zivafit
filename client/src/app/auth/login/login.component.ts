import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AccountService } from '../../_services/account.service';
import { Login } from '../../_models/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  model: Login = {
    email: '',
    password: ''
  };

  showPassword = false;
  emailError = '';
  passwordError = '';
  generalError = '';

  // ===============================
  // Login
  // Sends login details to the backend and redirects based on role/returnUrl.
  // ===============================
  login() {
    this.clearErrors();

    this.accountService.login(this.model).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
          return;
        }

        if (this.accountService.roles().includes('Admin')) {
          this.router.navigateByUrl('/admin');
          return;
        }

        this.router.navigateByUrl('/');
      },
      error: error => {
        const err = error?.error;

        this.emailError = err?.email || '';
        this.passwordError = err?.password || '';
        this.generalError = err?.message || '';
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private clearErrors() {
    this.emailError = '';
    this.passwordError = '';
    this.generalError = '';
  }
}