import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token/token.service';
import { AuthenticationService } from '../services/authentication/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  tokenService.isAuthentication.subscribe({
    next: (value) => {
      const roles = router.routerState.snapshot.root.children[0]?.data['Roles'];
      if (!value || (roles && roles.length && !roles.includes(authService.role()))) {
        router.navigate(['/login']);
      }
    },
  });

  // if (authService.isAuthenticated()) {
  //   return true;
  // }
  // else {
  //   router.navigate(['/login']);
  // }
  return true;
};