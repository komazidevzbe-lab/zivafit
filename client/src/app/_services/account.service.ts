import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { map } from 'rxjs';

import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { Login } from '../_models/login';
import { Register } from '../_models/register';
import { ForgotPassword } from '../_models/forgot-password';
import { VerifyResetCode } from '../_models/verify-reset-code';
import { ResetPassword } from '../_models/reset-password';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  currentUser = signal<User | null>(null);

  private logoutTimer: ReturnType<typeof setTimeout> | null = null;

  // ===============================
  // Roles signal
  // Reads roles from the JWT token so guards and navbar can check access.
  // ===============================
  roles = computed(() => {
    const user = this.currentUser();

    if (!user?.token)
      return [];

    try {
      const payload = JSON.parse(atob(user.token.split('.')[1]));
      const extractedRoles =
        payload.role ||
        payload.roles ||
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        [];

      return Array.isArray(extractedRoles) ? extractedRoles : [extractedRoles];
    } catch {
      return [];
    }
  });

  // ===============================
  // Login
  // Sends email and password to the API and stores the returned user.
  // ===============================
  login(model: Login) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }

        return user;
      })
    );
  }

  // ===============================
  // Register
  // Creates a customer account and stores the returned logged-in user.
  // ===============================
  register(model: Register) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }

        return user;
      })
    );
  }

  // ===============================
  // Forgot password
  // Requests a real password reset code by email.
  // The API does not return the reset code.
  // ===============================
  forgotPassword(model: ForgotPassword) {
    return this.http.post<{ message: string }>(this.baseUrl + 'account/forgot-password', model);
  }

  // ===============================
  // Verify reset code
  // Checks whether the emailed reset code is valid.
  // ===============================
  verifyResetCode(model: VerifyResetCode) {
    return this.http.post<{ message: string }>(this.baseUrl + 'account/verify-reset-code', model);
  }

  // ===============================
  // Reset password
  // Resets the password using the emailed reset code.
  // ===============================
  resetPassword(model: ResetPassword) {
    return this.http.post<{ message: string }>(this.baseUrl + 'account/reset-password', model);
  }

  // ===============================
  // Current user
  // Reloads the latest logged-in user details from the API.
  // ===============================
  getCurrentUser() {
    return this.http.get<User>(this.baseUrl + 'account/current-user').pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }

        return user;
      })
    );
  }

  // ===============================
  // Set current user
  // Stores the user for the browser session and starts auto logout.
  // ===============================
  setCurrentUser(user: User) {
    const expiryMs = this.getTokenExpiryMs(user.token);
    const now = Date.now();

    if (!expiryMs || expiryMs <= now) {
      this.clearUserSession();
      return;
    }

    sessionStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.startAutoLogoutTimer(expiryMs - now);
  }

  // ===============================
  // Restore current user
  // Called when Angular starts to restore a user after refresh.
  // ===============================
  restoreCurrentUser() {
    const userString = sessionStorage.getItem('user');

    if (!userString)
      return;

    try {
      const user: User = JSON.parse(userString);
      this.setCurrentUser(user);
    } catch {
      this.clearUserSession();
    }
  }

  // ===============================
  // Logout
  // JWT logout happens by clearing the stored token on the client.
  // ===============================
  logout() {
    this.clearUserSession();
  }

  // ===============================
  // Role helpers
  // Small helper methods used by navbar and guards.
  // ===============================
  getUserRole(): string {
    const roles = this.roles();
    return roles.length > 0 ? roles[0] : '';
  }

  isAdmin(): boolean {
    return this.roles().includes('Admin');
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  // ===============================
  // Token expiry
  // Reads the exp value from the JWT token.
  // ===============================
  private getTokenExpiryMs(token?: string | null): number | null {
    if (!token)
      return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  // ===============================
  // Auto logout timer
  // Logs the user out when the JWT token expires.
  // ===============================
  private startAutoLogoutTimer(timeoutMs: number) {
    this.clearLogoutTimer();

    if (timeoutMs <= 0) {
      this.logout();
      return;
    }

    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, timeoutMs);
  }

  private clearLogoutTimer() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  private clearUserSession() {
    sessionStorage.removeItem('user');
    this.currentUser.set(null);
    this.clearLogoutTimer();
  }
}