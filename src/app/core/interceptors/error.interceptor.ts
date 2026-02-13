import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const PUBLIC_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/validate',
  '/api/auth/validate-email',
];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let backendMessage: string | null = null;

      if (typeof error.error === 'object' && error.error?.message) {
        backendMessage = error.error.message;
      } else if (typeof error.error === 'string') {
        backendMessage = error.error;
      }

      console.error('Erreur HTTP:', {
        url: req.url,
        status: error.status,
        message: backendMessage ?? error.message,
      });

      const isPublic = PUBLIC_ENDPOINTS.some((p) => req.url.includes(p));

      if (!isPublic && error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }

      if (!isPublic && error.status === 403) {
        router.navigate(['/']);
      }

      // On renvoie l'erreur d'origine (HttpErrorResponse) pour que le component puisse lire error.status et error.error.message
      return throwError(() => error);
    }),
  );
};
