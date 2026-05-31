export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: unknown;
}
