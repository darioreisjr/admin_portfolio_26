import { Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [Button],
  template: `
    <div class="page-header">
      <div>
        <h2 class="page-header-title">{{ title() }}</h2>
        @if (subtitle()) {
          <p class="page-header-subtitle">{{ subtitle() }}</p>
        }
      </div>
      @if (actionLabel()) {
        <p-button
          [label]="actionLabel()!"
          icon="pi pi-plus"
          (onClick)="action.emit()"
        />
      }
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    .page-header-title {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--text-color);
    }
    .page-header-subtitle {
      margin: 0.25rem 0 0;
      color: var(--text-color-secondary);
      font-size: 0.9rem;
    }
  `],
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly actionLabel = input<string>();
  readonly action = output<void>();
}
