import { Category } from '../../categories/models/category.model';
import { Technology } from '../../technologies/models/technology.model';

export interface Project {
  id: string;
  title: string;
  description: string;
  projectUrl: string | null;
  repositoryUrl: string | null;
  isFeatured: boolean;
  imageUrl: string | null;
  category: Category | null;
  technologies: Technology[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  projectUrl?: string;
  repositoryUrl?: string;
  isFeatured?: boolean;
  categoryId?: string;
  technologyIds?: string[];
  image?: File;
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>;
