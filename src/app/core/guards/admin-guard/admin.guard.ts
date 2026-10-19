import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { ToastService } from 'src/app/core/services/toast-service/toast.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  // 1) Not logged in → open auth modal, block admin
  if (!authService.isAuthenticated()) {
    authService.openAuthModal('login', state.url);
    return false;
  }

  // 2) Logged in but not admin → send away
  if (!authService.isAdmin()) {
    toastService.error('You do not have access to the admin area.');
    router.navigate(['/']);
    return false;
  }

  // 3) Admin → allow
  return true;
};