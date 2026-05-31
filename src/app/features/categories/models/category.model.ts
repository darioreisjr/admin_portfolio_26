export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
