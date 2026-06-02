import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../features/auth/services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if (error?.status === HttpStatusCode.Unauthorized) {
        if (authService.isAuthenticated()) {
          authService.logout();
        }
        return throwError(() => error);
      }

      const msg =
        error?.error?.message ?? error?.message ?? 'Erro inesperado. Tente novamente.';
      messageService.add({ severity: 'error', summary: 'Erro', detail: msg, life: 5000 });
      return throwError(() => error);
    })
  );
};
