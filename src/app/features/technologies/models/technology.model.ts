export interface Technology {
  id: string;
  name: string;
  iconUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTechnologyPayload {
  name: string;
  iconUrl?: string;
}

export type UpdateTechnologyPayload = Partial<CreateTechnologyPayload>;
