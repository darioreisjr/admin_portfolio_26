import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../core/services/api-base.service';
import { PaginatedResponse, PaginationParams } from '../../../core/models/api-response.model';
import { Project, CreateProjectPayload, UpdateProjectPayload } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectsService extends ApiBaseService {
  private readonly path = '/projects';

  getAll(params?: PaginationParams): Observable<PaginatedResponse<Project>> {
    return this.getList<Project>(this.path, params);
  }

  getFeatured(): Observable<PaginatedResponse<Project>> {
    return this.getList<Project>(`${this.path}/featured`);
  }

  getById(id: string): Observable<Project> {
    return this.get<Project>(`${this.path}/${id}`);
  }

  create(payload: CreateProjectPayload): Observable<Project> {
    return this.post<Project>(this.path, this.toFormData(payload));
  }

  update(id: string, payload: UpdateProjectPayload): Observable<Project> {
    if (payload.image) {
      return this.patch<Project>(`${this.path}/${id}`, this.toFormData(payload));
    }
    const { image: _img, ...rest } = payload as CreateProjectPayload;
    return this.patch<Project>(`${this.path}/${id}`, rest);
  }

  remove(id: string): Observable<void> {
    return this.delete<void>(`${this.path}/${id}`);
  }

  private toFormData(payload: CreateProjectPayload | UpdateProjectPayload): FormData {
    const fd = new FormData();
    const { image, technologyIds, ...rest } = payload as CreateProjectPayload;

    Object.entries(rest).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, String(v));
    });
    if (technologyIds?.length) {
      fd.append('technologyIds', JSON.stringify(technologyIds));
    }
    if (image) fd.append('image', image, image.name);
    return fd;
  }
}
