import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const PUBLIC_ENDPOINTS = ['/api/auth/login', '/api/auth/register', '/api/auth/validate', '/api/auth/validate-email'];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Log utile
      const backendMessage =
        (typeof error.error === 'object' && error.error?.message) ? error.error.message :
        (typeof error.error === 'string' ? error.error : null);

      console.error('Erreur HTTP:', {
        url: req.url,
        status: error.status,
        message: backendMessage ?? error.message
      });

      // Important : ne pas déconnecter sur /login et /register
      const isPublic = PUBLIC_ENDPOINTS.some(p => req.url.includes(p));

      if (!isPublic && error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }

      // 403: interdit → tu peux rediriger, mais évite de le faire sur les pages auth
      if (!isPublic && error.status === 403) {
        router.navigate(['/']);
      }

      // On renvoie l'erreur d'origine (HttpErrorResponse) pour que le component
      // puisse lire error.status et error.error.message
      return throwError(() => error);
    })
  );
};
