import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { Message } from 'primeng/message';
import { Card } from 'primeng/card';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ProjectsService } from '../../services/projects.service';
import { CategoriesService } from '../../../categories/services/categories.service';
import { TechnologiesService } from '../../../technologies/services/technologies.service';
import { Category } from '../../../categories/models/category.model';
import { Technology } from '../../../technologies/models/technology.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    Button,
    InputText,
    Textarea,
    Select,
    MultiSelect,
    ToggleSwitch,
    FileUpload,
    Message,
    Card,
    PageHeaderComponent,
  ],
  template: `
    <app-page-header
      [title]="isEdit ? 'Editar Projeto' : 'Novo Projeto'"
      [subtitle]="isEdit ? 'Atualize as informações do projeto' : 'Preencha os dados para criar um novo projeto'"
    />

    <p-card>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">

          <!-- Título -->
          <div class="form-field form-field--full">
            <label for="title">Título *</label>
            <input id="title" pInputText formControlName="title" placeholder="Nome do projeto" class="w-full" />
            @if (invalid('title')) {
              <p-message severity="error" text="Título é obrigatório" />
            }
          </div>

          <!-- Descrição -->
          <div class="form-field form-field--full">
            <label for="description">Descrição *</label>
            <textarea
              id="description"
              pTextarea
              formControlName="description"
              placeholder="Descreva o projeto..."
              rows="4"
              class="w-full"
            ></textarea>
            @if (invalid('description')) {
              <p-message severity="error" text="Descrição é obrigatória" />
            }
          </div>

          <!-- URL do Projeto -->
          <div class="form-field">
            <label for="projectUrl">URL do Projeto</label>
            <input id="projectUrl" pInputText formControlName="projectUrl" placeholder="https://meusite.com" class="w-full" />
          </div>

          <!-- URL do Repositório -->
          <div class="form-field">
            <label for="repositoryUrl">URL do Repositório</label>
            <input id="repositoryUrl" pInputText formControlName="repositoryUrl" placeholder="https://github.com/..." class="w-full" />
          </div>

          <!-- Categoria -->
          <div class="form-field">
            <label>Categoria</label>
            <p-select
              formControlName="categoryId"
              [options]="categories()"
              optionLabel="name"
              optionValue="id"
              placeholder="Selecione uma categoria"
              [showClear]="true"
              class="w-full"
            />
          </div>

          <!-- Tecnologias -->
          <div class="form-field">
            <label>Tecnologias</label>
            <p-multiselect
              formControlName="technologyIds"
              [options]="technologies()"
              optionLabel="name"
              optionValue="id"
              placeholder="Selecione as tecnologias"
              [filter]="true"
              filterPlaceholder="Buscar..."
              class="w-full"
            />
          </div>

          <!-- Destaque -->
          <div class="form-field form-field--switch">
            <label>Projeto em Destaque</label>
            <p-toggleswitch formControlName="isFeatured" />
          </div>

          <!-- Upload de Imagem -->
          <div class="form-field form-field--full">
            <label>Imagem do Projeto</label>
            <p-fileupload
              mode="basic"
              accept="image/*"
              [maxFileSize]="5000000"
              chooseLabel="Escolher imagem"
              chooseIcon="pi pi-upload"
              [auto]="false"
              (onSelect)="onImageSelect($event)"
            />
            @if (imagePreview()) {
              <div class="image-preview">
                <img [src]="imagePreview()!" alt="Preview" />
                <p-button
                  icon="pi pi-times"
                  severity="danger"
                  size="small"
                  [text]="true"
                  (onClick)="removeImage()"
                  pTooltip="Remover imagem"
                />
              </div>
            }
          </div>

        </div>

        <div class="form-footer">
          <p-button
            label="Cancelar"
            severity="secondary"
            type="button"
            (onClick)="cancel()"
          />
          <p-button
            [label]="isEdit ? 'Salvar Alterações' : 'Criar Projeto'"
            type="submit"
            [loading]="saving()"
          />
        </div>
      </form>
    </p-card>
  `,
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      label { font-size: 0.875rem; font-weight: 500; }
    }
    .form-field--full { grid-column: 1 / -1; }
    .form-field--switch {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background: var(--surface-50);
      border: 1px solid var(--surface-border);
      border-radius: 8px;
      padding: 0.75rem 1rem;
    }
    .image-preview {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      margin-top: 0.5rem;
      img {
        max-width: 200px;
        max-height: 120px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid var(--surface-border);
      }
    }
    .form-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--surface-border);
    }
  `],
})
export class ProjectFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly projectsService = inject(ProjectsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly technologiesService = inject(TechnologiesService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  private readonly projectId: string | undefined = this.route.snapshot.params['id'];

  readonly categories = signal<Category[]>([]);
  readonly technologies = signal<Technology[]>([]);
  readonly saving = signal(false);
  readonly imagePreview = signal<string | null>(null);

  private selectedImage: File | null = null;

  form!: FormGroup;

  get isEdit(): boolean {
    return !!this.projectId;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      projectUrl: [''],
      repositoryUrl: [''],
      categoryId: [null],
      technologyIds: [[]],
      isFeatured: [false],
    });

    const sources: Record<string, Observable<unknown>> = {
      categories: this.categoriesService.getAll({ page: 1, limit: 200 }).pipe(
        catchError(() => of({ data: [] }))
      ),
      technologies: this.technologiesService.getAll({ page: 1, limit: 200 }).pipe(
        catchError(() => of({ data: [] }))
      ),
    };
    if (this.projectId) {
      sources['project'] = this.projectsService.getById(this.projectId).pipe(
        catchError(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível carregar os dados do projeto.',
          });
          return of(null);
        })
      );
    }

    forkJoin(sources).subscribe({
      next: (results: any) => {
        this.categories.set(results['categories']?.data ?? []);
        this.technologies.set(results['technologies']?.data ?? []);

        if (results['project']) {
          const project = results['project'].data ?? results['project'];
          this.form.patchValue({
            title: project.title,
            description: project.description,
            projectUrl: project.projectUrl ?? '',
            repositoryUrl: project.repositoryUrl ?? '',
            categoryId: project.category?.id ?? null,
            technologyIds: project.technologies?.map((t: any) => t.technology?.id ?? t.id) ?? [],
            isFeatured: project.isFeatured,
          });
          if (project.imageUrl) {
            this.imagePreview.set(project.imageUrl);
          }
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar dados do formulário.',
        });
      },
    });
  }

  invalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  }

  onImageSelect(event: FileUploadHandlerEvent | { files: File[] }): void {
    const files = (event as { files: File[] }).files;
    if (files?.length) {
      this.selectedImage = files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.imagePreview.set(e.target?.result as string);
      reader.readAsDataURL(files[0]);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview.set(null);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const value = this.form.value;
    const payload = {
      title: value.title,
      description: value.description,
      ...(value.projectUrl && { projectUrl: value.projectUrl }),
      ...(value.repositoryUrl && { repositoryUrl: value.repositoryUrl }),
      ...(value.categoryId && { categoryId: value.categoryId }),
      ...(value.technologyIds?.length && { technologyIds: value.technologyIds }),
      isFeatured: value.isFeatured,
      ...(this.selectedImage && { image: this.selectedImage }),
    };

    const obs = this.isEdit
      ? this.projectsService.update(this.projectId!, payload)
      : this.projectsService.create(payload);

    obs.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: this.isEdit ? 'Projeto atualizado!' : 'Projeto criado!',
        });
        this.saving.set(false);
        this.router.navigate(['/projects']);
      },
      error: () => this.saving.set(false),
    });
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }
}
