import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../core/services/api-base.service';
import { PaginatedResponse, PaginationParams } from '../../../core/models/api-response.model';
import {
  Technology,
  CreateTechnologyPayload,
  UpdateTechnologyPayload,
} from '../models/technology.model';

@Injectable({ providedIn: 'root' })
export class TechnologiesService extends ApiBaseService {
  private readonly path = '/technologies';

  getAll(params?: PaginationParams): Observable<PaginatedResponse<Technology>> {
    return this.getList<Technology>(this.path, params);
  }

  getById(id: string): Observable<Technology> {
    return this.get<Technology>(`${this.path}/${id}`);
  }

  create(payload: CreateTechnologyPayload): Observable<Technology> {
    return this.post<Technology>(this.path, payload);
  }

  update(id: string, payload: UpdateTechnologyPayload): Observable<Technology> {
    return this.patch<Technology>(`${this.path}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.delete<void>(`${this.path}/${id}`);
  }
}
