import { API_CONFIG } from "./config";
import type { ApiError } from "@/types";

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: ApiError
  ) {
    super(data?.message || statusText);
    this.name = "ApiClientError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { body, token, headers = {}, ...fetchOptions } = options;

    const requestHeaders = new Headers({
      "Content-Type": "application/json",
      ...Object.fromEntries(
        Object.entries(headers).filter(([, value]) => typeof value === "string")
      ),
    });

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    const requestBody = body ? JSON.stringify(body) : undefined;

    try {
      const url = `${this.baseURL}${endpoint}`;

      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
        body: requestBody,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiClientError(
          response.status,
          response.statusText,
          errorData
        );
      }

      const text = await response.text();

      if (text) {
        try {
          const data = JSON.parse(text);
          return data;
        } catch {
          return text as unknown as T;
        }
      } else {
        return {} as T;
      }
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      throw new ApiClientError(0, "Network Error", {
        message: "Erro de conexão com o servidor",
        error: "NetworkError",
        statusCode: 0,
      });
    }
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", token });
  }

  async post<T>(endpoint: string, data?: unknown, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body: data, token });
  }

  async patch<T>(endpoint: string, data?: unknown, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body: data, token });
  }

  async put<T>(endpoint: string, data?: unknown, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body: data, token });
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", token });
  }
}

export const apiClient = new ApiClient(API_CONFIG.BASE_URL);

export const tokenUtils = {
  save: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(API_CONFIG.TOKEN_KEY, token);
      document.cookie = `auth-token=${token}; path=/; max-age=${
        API_CONFIG.TOKEN_EXPIRY / 1000
      }; samesite=strict`;
    }
  },

  get: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(API_CONFIG.TOKEN_KEY);
    }
    return null;
  },

  remove: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(API_CONFIG.TOKEN_KEY);
      document.cookie =
        "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  },

  exists: (): boolean => {
    return !!tokenUtils.get();
  },
};
