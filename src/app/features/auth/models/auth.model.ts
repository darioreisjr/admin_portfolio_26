export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    token: string;
  };
  meta: {
    timestamp: string;
  };
}
