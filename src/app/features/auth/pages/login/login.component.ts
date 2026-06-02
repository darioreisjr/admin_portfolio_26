import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, CardModule, MessageModule],
  template: `
    <div class="login-wrapper">
      <p-card styleClass="login-card">
        <ng-template pTemplate="header">
          <div class="login-header">
            <i class="pi pi-briefcase login-icon"></i>
            <h1 class="login-title">Portfolio Admin</h1>
            <p class="login-subtitle">Acesso restrito</p>
          </div>
        </ng-template>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-field">
            <label for="email">E-mail</label>
            <input
              id="email"
              pInputText
              type="email"
              formControlName="email"
              placeholder="admin@exemplo.com"
              class="w-full"
              autocomplete="username"
            />
            @if (invalid('email')) {
              <p-message severity="error" text="E-mail inválido" styleClass="w-full mt-1" />
            }
          </div>

          <div class="form-field">
            <label for="password">Senha</label>
            <p-password
              inputId="password"
              formControlName="password"
              [feedback]="false"
              [toggleMask]="true"
              styleClass="w-full"
              inputStyleClass="w-full"
              autocomplete="current-password"
            />
            @if (invalid('password')) {
              <p-message severity="error" text="Senha é obrigatória" styleClass="w-full mt-1" />
            }
          </div>

          @if (errorMsg()) {
            <p-message
              severity="error"
              [text]="errorMsg()!"
              styleClass="w-full mb-3"
            />
          }

          <p-button
            type="submit"
            label="Entrar"
            icon="pi pi-sign-in"
            [loading]="loading()"
            [disabled]="form.invalid || loading()"
            styleClass="w-full"
          />
        </form>
      </p-card>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-ground);
      padding: 1rem;
    }

    :host ::ng-deep .login-card {
      width: 100%;
      max-width: 420px;
    }

    .login-header {
      text-align: center;
      padding: 2rem 2rem 0;
    }

    .login-icon {
      font-size: 2.5rem;
      color: var(--p-primary-color);
      display: block;
      margin-bottom: 0.75rem;
    }

    .login-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--p-text-color);
    }

    .login-subtitle {
      margin: 0.25rem 0 0;
      color: var(--p-text-muted-color);
      font-size: 0.875rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      margin-bottom: 1.25rem;

      label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--p-text-color);
      }
    }
  `],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  invalid(field: string): boolean {
    const ctrl = this.form.get(field)!;
    return ctrl.invalid && ctrl.touched;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);

    const { email, password } = this.form.getRawValue();

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        this.loading.set(false);
        const msg =
          err?.error?.message ??
          (err?.status === 401
            ? 'Credenciais inválidas. Verifique e-mail e senha.'
            : 'Erro ao conectar. Tente novamente.');
        this.errorMsg.set(msg);
      },
    });
  }
}
