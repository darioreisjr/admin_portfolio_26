import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const notif = inject(NotificationService);
  notif.setLoading(true);
  return next(req).pipe(finalize(() => notif.setLoading(false)));
};
