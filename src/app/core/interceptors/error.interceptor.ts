import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  return next(req).pipe(
    catchError((error) => {
      const msg =
        error?.error?.message ?? error?.message ?? 'Erro inesperado. Tente novamente.';
      messageService.add({ severity: 'error', summary: 'Erro', detail: msg, life: 5000 });
      return throwError(() => error);
    })
  );
};
