import type {
  CreateTaskRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  Task,
  TaskStats,
  UpdateTaskRequest,
  User,
} from "@/types";
import { apiClient, tokenUtils } from "./api-client";

import { API_CONFIG } from "./config";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.LOGIN,
      credentials
    );

    tokenUtils.save(response.access_token);

    return response;
  },

  async register(userData: RegisterRequest): Promise<User> {
    return apiClient.post<User>(API_CONFIG.ENDPOINTS.REGISTER, userData);
  },

  logout(): void {
    tokenUtils.remove();
  },

  isAuthenticated(): boolean {
    return tokenUtils.exists();
  },
};

export const userService = {
  async getProfile(): Promise<User> {
    const token = tokenUtils.get();
    if (!token) throw new Error("Token não encontrado");

    return apiClient.get<User>(API_CONFIG.ENDPOINTS.PROFILE, token);
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const token = tokenUtils.get();
    if (!token) throw new Error("Token não encontrado");

    return apiClient.patch<User>(API_CONFIG.ENDPOINTS.PROFILE, userData, token);
  },

  async getAllUsers(): Promise<User[]> {
    const token = tokenUtils.get();
    if (!token) throw new Error("Token não encontrado");

    return apiClient.get<User[]>(API_CONFIG.ENDPOINTS.USERS, token);
  },

  async getUserById(id: string): Promise<User> {
    const token = tokenUtils.get();
    if (!token) throw new Error("Token não encontrado");

    return apiClient.get<User>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, token);
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const token = tokenUtils.get();
    if (!token) throw new Error("Token não encontrado");

    return apiClient.patch<User>(
      `${API_CONFIG.ENDPOINTS.USERS}/${id}`,
      userData,
      token
    );
  },

  async deleteUser(id: string): Promise<void> {
    const token = tokenUtils.get();
    if (!token) throw new Error("Token não encontrado");

    await apiClient.delete<void>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, token);
  },
};

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const token = tokenUtils.get();
    if (!token) throw new Error("Token não encontrado");

    return apiClient.get<Task[]>(API_CONFIG.ENDPOINTS.TASKS, token);
  },

  async getTaskById(id: string): Promise<Task> {
    const token = tokenUtils.get();
    if (!token) throw new Error("Token não encontrado");

    return apiClient.get<Task>(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`, token);
  },

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const token = tokenUtils.get();
    if (!token) throw new Error("Token não encontrado");

    return apiClient.post<Task>(API_CONFIG.ENDPOINTS.TASKS, taskData, token);
  },

  async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    const token = tokenUtils.get();
    if (!token) throw new Error("Token não encontrado");

    return apiClient.patch<Task>(
      `${API_CONFIG.ENDPOINTS.TASKS}/${id}`,
      taskData,
      token
    );
  },

  async deleteTask(id: string): Promise<void> {
    const token = tokenUtils.get();
    if (!token) throw new Error("Token não encontrado");

    await apiClient.delete<void>(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`, token);
  },

  async getTaskStats(): Promise<TaskStats> {
    const token = tokenUtils.get();
    if (!token) throw new Error("Token não encontrado");

    return apiClient.get<TaskStats>(API_CONFIG.ENDPOINTS.TASK_STATS, token);
  },
};

export function isAuthError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  return (
    error.message.includes("401") ||
    error.message.includes("Unauthorized") ||
    error.message.includes("Token não encontrado")
  );
}

export function handleAuthError(): void {
  authService.logout();
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
}
