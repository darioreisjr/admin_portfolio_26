import { Component, inject } from '@angular/core';
import { ProgressBar } from 'primeng/progressbar';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [ProgressBar],
  template: `
    <header class="topbar">
      <div class="topbar-inner">
        <span class="topbar-title">Dashboard</span>
      </div>
      @if (notif.isLoading()) {
        <p-progressbar mode="indeterminate" [style]="{ height: '3px' }" />
      }
    </header>
  `,
  styles: [`
    .topbar {
      background: var(--surface-card);
      border-bottom: 1px solid var(--surface-border);
    }
    .topbar-inner {
      padding: 0.875rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .topbar-title {
      font-weight: 600;
      font-size: 1rem;
      color: var(--text-color);
    }
  `],
})
export class TopbarComponent {
  protected readonly notif = inject(NotificationService);
}
