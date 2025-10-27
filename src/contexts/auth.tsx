/* @refresh reset */
import { useContext, useEffect, useState } from "react";
import { AuthState, LoginCredentials, RegisterData, User } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "./auth.core";

const API_URL = "http://localhost:3000/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem("auth_token");
    if (token) {
      checkAuth(token).catch(() => {
        localStorage.removeItem("auth_token");
        setState({ user: null, isAuthenticated: false, isLoading: false });
      });
    } else {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  const checkAuth = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Authentication failed");
      
      const data = await response.json();
      setState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      throw error;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("auth_token", data.token);
      
      setState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
      });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const responseData = await response.json();
      localStorage.setItem("auth_token", responseData.token);
      
      setState({
        user: responseData.user,
        isAuthenticated: true,
        isLoading: false,
      });

      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const resetPassword = async (email: string) => {
    try {
      // backend expects a request-password-reset endpoint
      const response = await fetch(`${API_URL}/auth/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Password reset request failed");
      }

      toast({
        title: "Check your email",
        description: "If an account exists with this email, you will receive password reset instructions.",
      });
    } catch (error) {
      console.error("Password reset request failed:", error);
      toast({
        variant: "destructive",
        title: "Request failed",
        description: error instanceof Error ? error.message : "Please try again",
      });
      throw error;
    }
  };

  const confirmReset = async (token: string, newPassword: string) => {
    try {
      // backend expects POST to /auth/reset-password with token + newPassword
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Password reset failed");
      }

      toast({
        title: "Password reset successful",
        description: "You can now log in with your new password.",
      });
    } catch (error) {
      console.error("Password reset failed:", error);
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: error instanceof Error ? error.message : "Please try again",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, resetPassword, confirmReset }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth hook moved to `src/contexts/useAuth.ts` to keep this module exporting only the provider component