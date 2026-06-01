import { Component, effect, inject, input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Technology, CreateTechnologyPayload } from '../../models/technology.model';

@Component({
  selector: 'app-technology-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button, InputText, Message],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="form-field">
        <label for="name">Nome *</label>
        <input
          id="name"
          pInputText
          formControlName="name"
          placeholder="Ex: Angular"
          class="w-full"
        />
        @if (nameInvalid) {
          <p-message severity="error" text="Nome é obrigatório" />
        }
      </div>

      <div class="form-field">
        <label for="iconUrl">URL do Ícone</label>
        <input
          id="iconUrl"
          pInputText
          formControlName="iconUrl"
          placeholder="https://exemplo.com/icon.svg"
          class="w-full"
        />
        @if (form.get('iconUrl')?.value) {
          <div class="icon-preview">
            <img [src]="form.get('iconUrl')?.value" alt="Preview" />
          </div>
        }
      </div>

      <div class="form-actions">
        <p-button
          label="Cancelar"
          severity="secondary"
          type="button"
          (onClick)="cancel.emit()"
        />
        <p-button
          [label]="technology() ? 'Salvar' : 'Criar'"
          type="submit"
          [loading]="loading()"
        />
      </div>
    </form>
  `,
  styles: [`
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1rem;
      label { font-size: 0.875rem; font-weight: 500; }
    }
    .icon-preview {
      margin-top: 0.5rem;
      img {
        width: 40px;
        height: 40px;
        object-fit: contain;
        border-radius: 4px;
        border: 1px solid var(--surface-border);
        padding: 4px;
      }
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1.25rem;
    }
  `],
})
export class TechnologyFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly technology = input<Technology | null>(null);
  readonly loading = input(false);
  readonly saved = output<CreateTechnologyPayload>();
  readonly cancel = output<void>();

  form!: FormGroup;

  constructor() {
    effect(() => {
      const tech = this.technology();
      if (this.form) {
        this.form.reset({ name: tech?.name ?? '', iconUrl: tech?.iconUrl ?? '' });
      }
    });
  }

  get nameInvalid(): boolean {
    const ctrl = this.form.get('name');
    return !!(ctrl?.invalid && ctrl.touched);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      iconUrl: [''],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = { ...this.form.value };
    if (!value.iconUrl) delete value.iconUrl;
    this.saved.emit(value);
  }
}
