import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError(error => {
      const isAuthEndpoint =
        req.url.includes('/account/login') ||
        req.url.includes('/account/register') ||
        req.url.includes('/account/forgot-password') ||
        req.url.includes('/account/verify-reset-code') ||
        req.url.includes('/account/reset-password');

      switch (error.status) {
        case 400:
          if (!isAuthEndpoint) {
            toastr.error(getErrorMessage(error), 'Bad request');
          }
          break;

        case 401:
          if (!req.url.includes('/account/login')) {
            toastr.error('Please log in first.', 'Unauthorized');
          }
          break;

        case 403:
          toastr.error('You do not have permission to access this page.', 'Forbidden');
          router.navigateByUrl('/unauthorized');
          break;

        case 404:
          router.navigateByUrl('/not-found');
          break;

        case 409:
          break;

        case 500:
          const navigationExtras: NavigationExtras = {
            state: { error: error.error }
          };

          router.navigateByUrl('/server-error', navigationExtras);
          break;

        default:
          toastr.error('Something unexpected went wrong.');
          break;
      }

      throw error;
    })
  );
};

// ===============================
// Error message helper
// Safely reads API error messages without breaking on different error shapes.
// ===============================
function getErrorMessage(error: any): string {
  if (typeof error?.error === 'string')
    return error.error;

  if (typeof error?.error?.message === 'string')
    return error.error.message;

  return 'Request failed.';
}