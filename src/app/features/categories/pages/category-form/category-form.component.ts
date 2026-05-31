import { Component, inject, input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Category, CreateCategoryPayload } from '../../models/category.model';

@Component({
  selector: 'app-category-form',
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
          placeholder="Ex: Backend"
          class="w-full"
        />
        @if (nameInvalid) {
          <p-message severity="error" text="Nome é obrigatório" />
        }
      </div>

      <div class="form-field">
        <label for="slug">Slug</label>
        <input
          id="slug"
          pInputText
          formControlName="slug"
          placeholder="Ex: backend"
          class="w-full"
        />
      </div>

      <div class="form-actions">
        <p-button
          label="Cancelar"
          severity="secondary"
          type="button"
          (onClick)="cancel.emit()"
        />
        <p-button
          [label]="category() ? 'Salvar' : 'Criar'"
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
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1.25rem;
    }
  `],
})
export class CategoryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly category = input<Category | null>(null);
  readonly loading = input(false);
  readonly saved = output<CreateCategoryPayload>();
  readonly cancel = output<void>();

  form!: FormGroup;

  get nameInvalid(): boolean {
    const ctrl = this.form.get('name');
    return !!(ctrl?.invalid && ctrl.touched);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.category()?.name ?? '', Validators.required],
      slug: [this.category()?.slug ?? ''],
    });

    this.form.get('name')?.valueChanges.subscribe((val: string) => {
      if (!this.category() && !this.form.get('slug')?.dirty) {
        this.form.get('slug')?.setValue(
          val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          { emitEvent: false }
        );
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saved.emit(this.form.value);
  }
}
