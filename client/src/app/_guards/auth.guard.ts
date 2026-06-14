import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AccountService } from '../_services/account.service';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const user = accountService.currentUser();

  if (user) {
    return true;
  }

  toastr.error('Please log in to continue.');

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};