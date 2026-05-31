import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../core/services/api-base.service';
import { PaginatedResponse, PaginationParams } from '../../../core/models/api-response.model';
import {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService extends ApiBaseService {
  private readonly path = '/categories';

  getAll(params?: PaginationParams): Observable<PaginatedResponse<Category>> {
    return this.getList<Category>(this.path, params);
  }

  getById(id: string): Observable<Category> {
    return this.get<Category>(`${this.path}/${id}`);
  }

  create(payload: CreateCategoryPayload): Observable<Category> {
    return this.post<Category>(this.path, payload);
  }

  update(id: string, payload: UpdateCategoryPayload): Observable<Category> {
    return this.patch<Category>(`${this.path}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.delete<void>(`${this.path}/${id}`);
  }
}
