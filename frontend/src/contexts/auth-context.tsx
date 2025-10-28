"use client";

import { authService, userService } from "@/lib/api-services";
import { createContext, useContext, useEffect, useState } from "react";

import type { User } from "@/types";
import { tokenUtils } from "@/lib/api-client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se o usuário está logado ao inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenUtils.get();

      if (token) {
        try {
          const profile = await userService.getProfile();
          setUser(profile);
        } catch {
          tokenUtils.remove();
          setUser(null);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      tokenUtils.save(response.access_token);

      const fullProfile = await userService.getProfile();

      setUser(fullProfile);
    } catch (error) {
      if (error instanceof Error) {
        let message = error.message;

        if (
          message.includes("Invalid credentials") ||
          message.includes("Email ou senha incorretos")
        ) {
          message = "Email ou senha incorretos";
        } else if (
          message.includes("Network Error") ||
          message.includes("Erro de conexão")
        ) {
          message = "Erro de conexão com o servidor";
        } else if (
          message.includes("401") ||
          message.includes("Unauthorized")
        ) {
          message = "Credenciais inválidas";
        } else if (message.includes("500")) {
          message = "Erro interno do servidor";
        }

        throw new Error(message);
      }

      throw error;
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      // Primeiro registrar o usuário
      await authService.register(userData);

      // Depois fazer login para obter o token
      const loginResponse = await authService.login({
        email: userData.email,
        password: userData.password,
      });

      tokenUtils.save(loginResponse.access_token);

      // Buscar perfil completo do usuário
      const fullProfile = await userService.getProfile();
      setUser(fullProfile);
    } catch (error) {
      if (error instanceof Error) {
        let message = error.message;

        if (
          message.includes("Email already exists") ||
          message.includes("already registered")
        ) {
          message = "Este email já está cadastrado";
        } else if (
          message.includes("validation failed") ||
          message.includes("Invalid")
        ) {
          message = "Dados inválidos. Verifique os campos";
        } else if (
          message.includes("Network Error") ||
          message.includes("Erro de conexão")
        ) {
          message = "Erro de conexão com o servidor";
        } else if (message.includes("500")) {
          message = "Erro interno do servidor";
        }

        throw new Error(message);
      }

      throw error;
    }
  };

  const logout = () => {
    tokenUtils.remove();
    setUser(null);
    window.location.href = "/login";
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
