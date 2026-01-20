export interface RegisterRequest {
  email: string;
  username: string;
  lastName: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    lastName: string;
    userStatus: string;
    roles: string[];
  };
  message?: string;
}

export interface ValidationResponse {
  message: string;
  email?: string;
}