import { Routes } from '@angular/router';

export const technologiesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/technology-list/technology-list.component').then(
        (m) => m.TechnologyListComponent
      ),
  },
];
