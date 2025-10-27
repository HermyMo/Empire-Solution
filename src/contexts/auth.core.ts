import { createContext } from "react";
import { AuthState, LoginCredentials, RegisterData } from "@/lib/types";

// Shared type for the auth context (used by provider and the hook)
export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  confirmReset: (token: string, newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
