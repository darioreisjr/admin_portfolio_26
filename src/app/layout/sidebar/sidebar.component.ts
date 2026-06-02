import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-logo">
          <i class="pi pi-briefcase"></i>
          <span>Portfolio Admin</span>
        </span>
      </div>

      <nav class="sidebar-nav">
        <a
          routerLink="/projects"
          routerLinkActive="active"
          class="nav-item"
        >
          <i class="pi pi-th-large"></i>
          <span>Projetos</span>
        </a>
        <a
          routerLink="/categories"
          routerLinkActive="active"
          class="nav-item"
        >
          <i class="pi pi-tag"></i>
          <span>Categorias</span>
        </a>
        <a
          routerLink="/technologies"
          routerLinkActive="active"
          class="nav-item"
        >
          <i class="pi pi-code"></i>
          <span>Tecnologias</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button
          pButton
          type="button"
          icon="pi pi-sign-out"
          label="Sair"
          [text]="true"
          severity="secondary"
          class="logout-btn"
          (click)="authService.logout()"
        ></button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      background: var(--surface-card);
      border-right: 1px solid var(--surface-border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .sidebar-header {
      padding: 1.25rem 1rem;
      border-bottom: 1px solid var(--surface-border);
    }
    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 1rem;
      color: var(--primary-color);
      i { font-size: 1.25rem; }
    }
    .sidebar-nav {
      padding: 0.75rem 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.875rem;
      border-radius: 8px;
      text-decoration: none;
      color: var(--text-color-secondary);
      font-size: 0.9rem;
      transition: background 0.15s, color 0.15s;
      i { font-size: 1rem; }
      &:hover {
        background: var(--surface-hover);
        color: var(--text-color);
      }
      &.active {
        background: var(--primary-100);
        color: var(--primary-color);
        font-weight: 600;
      }
    }
    .sidebar-footer {
      margin-top: auto;
      padding: 0.75rem 0.5rem;
      border-top: 1px solid var(--surface-border);
    }
    .logout-btn {
      width: 100%;
      justify-content: flex-start;
    }
  `],
})
export class SidebarComponent {
  readonly authService = inject(AuthService);
}
