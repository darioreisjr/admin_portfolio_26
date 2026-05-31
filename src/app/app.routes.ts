import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
      {
        path: 'projects',
        loadChildren: () =>
          import('./features/projects/projects.routes').then((m) => m.projectsRoutes),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./features/categories/categories.routes').then(
            (m) => m.categoriesRoutes
          ),
      },
      {
        path: 'technologies',
        loadChildren: () =>
          import('./features/technologies/technologies.routes').then(
            (m) => m.technologiesRoutes
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
