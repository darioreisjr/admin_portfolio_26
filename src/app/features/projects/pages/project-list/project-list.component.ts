import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { InputText } from 'primeng/inputtext';
import { DatePipe, SlicePipe } from '@angular/common';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    FormsModule,
    Button,
    TableModule,
    Tag,
    InputText,
    DatePipe,
    SlicePipe,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
  template: `
    <app-page-header
      title="Projetos"
      subtitle="Gerencie os projetos do portfólio"
      actionLabel="Novo Projeto"
      (action)="goToCreate()"
    />

    <p-table
      [value]="projects()"
      [loading]="tableLoading()"
      [lazy]="true"
      [paginator]="true"
      [rows]="pageSize"
      [totalRecords]="total()"
      [rowsPerPageOptions]="[10, 25, 50]"
      (onLazyLoad)="onLazyLoad($event)"
      dataKey="id"
      responsiveLayout="scroll"
    >
      <ng-template pTemplate="caption">
        <div class="table-caption">
          <input
            pInputText
            placeholder="Buscar projeto..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearch()"
            class="search-input"
          />
        </div>
      </ng-template>

      <ng-template pTemplate="header">
        <tr>
          <th style="width: 80px">Imagem</th>
          <th pSortableColumn="title">Título <p-sortIcon field="title" /></th>
          <th>Categoria</th>
          <th>Destaque</th>
          <th>Tecnologias</th>
          <th>Criado em</th>
          <th style="width: 120px">Ações</th>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-project>
        <tr>
          <td>
            @if (project.imageUrl) {
              <img [src]="project.imageUrl" [alt]="project.title" class="project-thumb" />
            } @else {
              <div class="project-thumb-placeholder">
                <i class="pi pi-image"></i>
              </div>
            }
          </td>
          <td>
            <div class="project-title">{{ project.title }}</div>
            <div class="project-desc">{{ project.description | slice:0:60 }}{{ project.description?.length > 60 ? '...' : '' }}</div>
          </td>
          <td>{{ project.category?.name ?? '—' }}</td>
          <td>
            <p-tag
              [value]="project.isFeatured ? 'Destaque' : 'Normal'"
              [severity]="project.isFeatured ? 'success' : 'secondary'"
            />
          </td>
          <td>
            <div class="tech-chips">
              @for (tech of project.technologies?.slice(0, 3); track tech.id) {
                <span class="tech-chip">{{ tech.name }}</span>
              }
              @if (project.technologies?.length > 3) {
                <span class="tech-chip tech-chip--more">+{{ project.technologies.length - 3 }}</span>
              }
            </div>
          </td>
          <td>{{ project.createdAt | date:'dd/MM/yyyy' }}</td>
          <td>
            <p-button
              icon="pi pi-pencil"
              severity="secondary"
              size="small"
              [text]="true"
              (onClick)="goToEdit(project.id)"
              pTooltip="Editar"
            />
            <p-button
              icon="pi pi-trash"
              severity="danger"
              size="small"
              [text]="true"
              (onClick)="confirmDelete(project)"
              pTooltip="Excluir"
            />
          </td>
        </tr>
      </ng-template>

      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="7">
            <app-empty-state message="Nenhum projeto encontrado." />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: [`
    .table-caption {
      display: flex;
      justify-content: flex-end;
      padding-bottom: 0.5rem;
    }
    .search-input { width: 280px; }
    .project-thumb {
      width: 56px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
    }
    .project-thumb-placeholder {
      width: 56px;
      height: 40px;
      background: var(--surface-border);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-color-secondary);
    }
    .project-title { font-weight: 600; font-size: 0.875rem; }
    .project-desc { font-size: 0.8rem; color: var(--text-color-secondary); margin-top: 2px; }
    .tech-chips { display: flex; flex-wrap: wrap; gap: 4px; }
    .tech-chip {
      background: var(--surface-200);
      color: var(--text-color);
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 0.75rem;
    }
    .tech-chip--more { background: var(--surface-300); }
  `],
})
export class ProjectListComponent implements OnInit {
  private readonly projectsService = inject(ProjectsService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly projects = signal<Project[]>([]);
  readonly total = signal(0);
  readonly tableLoading = signal(false);

  readonly pageSize = 10;
  searchTerm = '';
  private searchTimer?: ReturnType<typeof setTimeout>;
  private currentPage = 1;

  ngOnInit(): void {
    this.load(1);
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const page = Math.floor((event.first ?? 0) / (event.rows ?? this.pageSize)) + 1;
    this.currentPage = page;
    this.load(page);
  }

  onSearch(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.load(1), 400);
  }

  goToCreate(): void {
    this.router.navigate(['/projects/new']);
  }

  goToEdit(id: string): void {
    this.router.navigate(['/projects', id, 'edit']);
  }

  confirmDelete(project: Project): void {
    this.confirmationService.confirm({
      message: `Deseja excluir o projeto <strong>${project.title}</strong>?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.delete(project.id),
    });
  }

  private load(page: number): void {
    this.tableLoading.set(true);
    this.projectsService
      .getAll({ page, limit: this.pageSize, search: this.searchTerm || undefined })
      .subscribe({
        next: (res) => {
          this.projects.set(res.data);
          this.total.set(res.meta.total);
          this.tableLoading.set(false);
        },
        error: () => this.tableLoading.set(false),
      });
  }

  private delete(id: string): void {
    this.projectsService.remove(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Projeto excluído!',
        });
        this.load(this.currentPage);
      },
    });
  }
}
