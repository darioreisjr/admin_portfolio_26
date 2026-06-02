import { Routes } from '@angular/router';
import { loginGuard } from '../../core/guards/login.guard';

export const authRoutes: Routes = [
  {
    path: '',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
];
