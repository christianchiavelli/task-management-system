"use client";

import type {
  CreateTaskRequest,
  RegisterRequest,
  Task,
  TaskStats,
  UpdateTaskRequest,
  User,
} from "@/types";
import {
  authService,
  handleAuthError,
  isAuthError,
  taskService,
  userService,
} from "@/lib/api-services";
import { useEffect, useState } from "react";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro no login";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}

// Hook para registro
export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await authService.register(userData);
      return user;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro no registro";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}

// Hook para verificar autenticação
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, logout };
}

// ============================================
// USER HOOKS
// ============================================

// Hook para obter perfil do usuário
export function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await userService.getProfile();
        setUser(profile);
        setError(null);
      } catch (err) {
        if (isAuthError(err)) {
          handleAuthError();
          return;
        }
        const message =
          err instanceof Error ? err.message : "Erro ao carregar perfil";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      const updatedUser = await userService.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      if (isAuthError(err)) {
        handleAuthError();
        return;
      }
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar perfil";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { user, updateProfile, isLoading, error };
}

// ============================================
// TASK HOOKS
// ============================================

// Hook para listar tarefas
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const taskList = await taskService.getTasks();
      setTasks(taskList);
      setError(null);
    } catch (err) {
      if (isAuthError(err)) {
        handleAuthError();
        return;
      }
      const message =
        err instanceof Error ? err.message : "Erro ao carregar tarefas";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (taskData: CreateTaskRequest) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      if (isAuthError(err)) {
        handleAuthError();
        return;
      }
      throw err;
    }
  };

  const updateTask = async (id: string, taskData: UpdateTaskRequest) => {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      if (isAuthError(err)) {
        handleAuthError();
        return;
      }
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      if (isAuthError(err)) {
        handleAuthError();
        return;
      }
      throw err;
    }
  };

  return {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
    isLoading,
    error,
  };
}

// Hook para estatísticas de tarefas
export function useTaskStats() {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const taskStats = await taskService.getTaskStats();
      setStats(taskStats);
      setError(null);
    } catch (err) {
      if (isAuthError(err)) {
        handleAuthError();
        return;
      }
      const message =
        err instanceof Error ? err.message : "Erro ao carregar estatísticas";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, refetch: fetchStats, isLoading, error };
}

// Export do novo hook de usuários
export { useUsers } from './useUsers';
