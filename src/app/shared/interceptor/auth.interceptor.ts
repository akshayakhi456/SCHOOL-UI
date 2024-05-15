import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { TokenService } from '../services/token/token.service';
import { SnackbarService } from '../signal-service/snackbar.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const snackbarService = inject(SnackbarService);

  tokenService.isAuthentication.subscribe({
    next: (value) => {
      if (value) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${tokenService.getToken()}`,
          },
        });
      }
    },
  });

  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      if (e.status === 401) {
        tokenService.removeToken();
        router.navigate(['/login']);
      }
      const error = e.error.result || e.error?.error?.result || e.error.message || e.error?.error?.message || 'Something went wrong';
      snackbarService.openDangerSnackbar(error)
      return throwError(() => error);
    })
  );
};