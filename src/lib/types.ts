export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  notifyBySMS?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  notifyBySMS?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}