import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <i class="pi pi-inbox empty-state-icon"></i>
      <p class="empty-state-message">{{ message() }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      color: var(--text-color-secondary);
    }
    .empty-state-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.4;
    }
    .empty-state-message {
      margin: 0;
      font-size: 0.95rem;
    }
  `],
})
export class EmptyStateComponent {
  readonly message = input('Nenhum registro encontrado.');
}
