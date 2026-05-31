import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { TechnologyFormComponent } from '../technology-form/technology-form.component';
import { TechnologiesService } from '../../services/technologies.service';
import { Technology, CreateTechnologyPayload } from '../../models/technology.model';

@Component({
  selector: 'app-technology-list',
  standalone: true,
  imports: [
    DatePipe,
    Button,
    TableModule,
    Dialog,
    PageHeaderComponent,
    EmptyStateComponent,
    TechnologyFormComponent,
  ],
  template: `
    <app-page-header
      title="Tecnologias"
      subtitle="Gerencie as tecnologias utilizadas nos projetos"
      actionLabel="Nova Tecnologia"
      (action)="openCreateDialog()"
    />

    <p-table
      [value]="technologies()"
      [loading]="tableLoading()"
      [paginator]="true"
      [rows]="10"
      [rowsPerPageOptions]="[10, 25, 50]"
      dataKey="id"
      responsiveLayout="scroll"
    >
      <ng-template pTemplate="header">
        <tr>
          <th style="width: 60px">Ícone</th>
          <th>Nome</th>
          <th>Criado em</th>
          <th style="width: 120px">Ações</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-tech>
        <tr>
          <td>
            @if (tech.iconUrl) {
              <img [src]="tech.iconUrl" [alt]="tech.name" class="tech-icon" />
            } @else {
              <i class="pi pi-code" style="font-size: 1.25rem; color: var(--text-color-secondary)"></i>
            }
          </td>
          <td>{{ tech.name }}</td>
          <td>{{ tech.createdAt | date:'dd/MM/yyyy' }}</td>
          <td>
            <p-button
              icon="pi pi-pencil"
              severity="secondary"
              size="small"
              [text]="true"
              (onClick)="openEditDialog(tech)"
              pTooltip="Editar"
            />
            <p-button
              icon="pi pi-trash"
              severity="danger"
              size="small"
              [text]="true"
              (onClick)="confirmDelete(tech)"
              pTooltip="Excluir"
            />
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="4">
            <app-empty-state message="Nenhuma tecnologia encontrada." />
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog
      [(visible)]="dialogVisible"
      [header]="editingTechnology() ? 'Editar Tecnologia' : 'Nova Tecnologia'"
      [modal]="true"
      [style]="{ width: '450px' }"
      [draggable]="false"
    >
      <app-technology-form
        [technology]="editingTechnology()"
        [loading]="formLoading()"
        (saved)="onSave($event)"
        (cancel)="closeDialog()"
      />
    </p-dialog>
  `,
  styles: [`
    .tech-icon {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
  `],
})
export class TechnologyListComponent implements OnInit {
  private readonly technologiesService = inject(TechnologiesService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly technologies = signal<Technology[]>([]);
  readonly tableLoading = signal(false);
  readonly formLoading = signal(false);
  readonly editingTechnology = signal<Technology | null>(null);

  dialogVisible = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.tableLoading.set(true);
    this.technologiesService.getAll({ page: 1, limit: 100 }).subscribe({
      next: (res) => {
        this.technologies.set(res.data);
        this.tableLoading.set(false);
      },
      error: () => this.tableLoading.set(false),
    });
  }

  openCreateDialog(): void {
    this.editingTechnology.set(null);
    this.dialogVisible = true;
  }

  openEditDialog(technology: Technology): void {
    this.editingTechnology.set(technology);
    this.dialogVisible = true;
  }

  closeDialog(): void {
    this.dialogVisible = false;
    this.editingTechnology.set(null);
  }

  onSave(payload: CreateTechnologyPayload): void {
    this.formLoading.set(true);
    const obs = this.editingTechnology()
      ? this.technologiesService.update(this.editingTechnology()!.id, payload)
      : this.technologiesService.create(payload);

    obs.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: this.editingTechnology() ? 'Tecnologia atualizada!' : 'Tecnologia criada!',
        });
        this.formLoading.set(false);
        this.closeDialog();
        this.load();
      },
      error: () => this.formLoading.set(false),
    });
  }

  confirmDelete(technology: Technology): void {
    this.confirmationService.confirm({
      message: `Deseja excluir <strong>${technology.name}</strong>?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.delete(technology.id),
    });
  }

  private delete(id: string): void {
    this.technologiesService.remove(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Tecnologia excluída!',
        });
        this.load();
      },
    });
  }
}
