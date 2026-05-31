import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { CategoriesService } from '../../services/categories.service';
import { Category, CreateCategoryPayload } from '../../models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    DatePipe,
    Button,
    TableModule,
    Dialog,
    PageHeaderComponent,
    EmptyStateComponent,
    CategoryFormComponent,
  ],
  template: `
    <app-page-header
      title="Categorias"
      subtitle="Gerencie as categorias dos projetos"
      actionLabel="Nova Categoria"
      (action)="openCreateDialog()"
    />

    <p-table
      [value]="categories()"
      [loading]="tableLoading()"
      [paginator]="true"
      [rows]="10"
      [rowsPerPageOptions]="[10, 25, 50]"
      [totalRecords]="total()"
      dataKey="id"
      responsiveLayout="scroll"
    >
      <ng-template pTemplate="header">
        <tr>
          <th>Nome</th>
          <th>Slug</th>
          <th>Criado em</th>
          <th style="width: 120px">Ações</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-category>
        <tr>
          <td>{{ category.name }}</td>
          <td><code>{{ category.slug }}</code></td>
          <td>{{ category.createdAt | date:'dd/MM/yyyy' }}</td>
          <td>
            <p-button
              icon="pi pi-pencil"
              severity="secondary"
              size="small"
              [text]="true"
              (onClick)="openEditDialog(category)"
              pTooltip="Editar"
            />
            <p-button
              icon="pi pi-trash"
              severity="danger"
              size="small"
              [text]="true"
              (onClick)="confirmDelete(category)"
              pTooltip="Excluir"
            />
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="4">
            <app-empty-state message="Nenhuma categoria encontrada." />
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog
      [(visible)]="dialogVisible"
      [header]="editingCategory() ? 'Editar Categoria' : 'Nova Categoria'"
      [modal]="true"
      [style]="{ width: '450px' }"
      [draggable]="false"
    >
      <app-category-form
        [category]="editingCategory()"
        [loading]="formLoading()"
        (saved)="onSave($event)"
        (cancel)="closeDialog()"
      />
    </p-dialog>
  `,
})
export class CategoryListComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly categories = signal<Category[]>([]);
  readonly total = signal(0);
  readonly tableLoading = signal(false);
  readonly formLoading = signal(false);
  readonly editingCategory = signal<Category | null>(null);

  dialogVisible = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.tableLoading.set(true);
    this.categoriesService.getAll({ page: 1, limit: 100 }).subscribe({
      next: (res) => {
        this.categories.set(res.data);
        this.total.set(res.meta.total);
        this.tableLoading.set(false);
      },
      error: () => this.tableLoading.set(false),
    });
  }

  openCreateDialog(): void {
    this.editingCategory.set(null);
    this.dialogVisible = true;
  }

  openEditDialog(category: Category): void {
    this.editingCategory.set(category);
    this.dialogVisible = true;
  }

  closeDialog(): void {
    this.dialogVisible = false;
    this.editingCategory.set(null);
  }

  onSave(payload: CreateCategoryPayload): void {
    this.formLoading.set(true);
    const obs = this.editingCategory()
      ? this.categoriesService.update(this.editingCategory()!.id, payload)
      : this.categoriesService.create(payload);

    obs.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: this.editingCategory() ? 'Categoria atualizada!' : 'Categoria criada!',
        });
        this.formLoading.set(false);
        this.closeDialog();
        this.load();
      },
      error: () => this.formLoading.set(false),
    });
  }

  confirmDelete(category: Category): void {
    this.confirmationService.confirm({
      message: `Deseja excluir a categoria <strong>${category.name}</strong>?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.delete(category.id),
    });
  }

  private delete(id: string): void {
    this.categoriesService.remove(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Categoria excluída!',
        });
        this.load();
      },
    });
  }
}
