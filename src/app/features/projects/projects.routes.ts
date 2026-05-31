import { Routes } from '@angular/router';

export const projectsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/project-list/project-list.component').then(
        (m) => m.ProjectListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/project-form/project-form.component').then(
        (m) => m.ProjectFormComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/project-form/project-form.component').then(
        (m) => m.ProjectFormComponent
      ),
  },
];
