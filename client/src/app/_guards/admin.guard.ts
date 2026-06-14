import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AccountService } from '../_services/account.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const user = accountService.currentUser();

  if (!user) {
    toastr.error('Please log in as an admin.');

    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  if (accountService.roles().includes('Admin')) {
    return true;
  }

  toastr.error('You cannot enter the admin area.');

  return router.createUrlTree(['/unauthorized']);
};