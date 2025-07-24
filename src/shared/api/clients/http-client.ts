import { EHttpMethod, type IRequestConfig } from "../types";
import CookieStorage from "../storages/cookie-storage";

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string | number,
    public details?: unknown
  ) {
    super(message);

    this.name = "ApiError";
  }
}

class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:3001/api") {
    this.baseUrl = baseUrl;
  }

  private getHeaders(requiresAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (requiresAuth) {
      const token = CookieStorage.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    let data: unknown;

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      const errorData = data as {
        message?: string;
        code?: string | number;
        details?: unknown;
      };
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        errorData.code || response.status,
        errorData.details
      );
    }

    return data as T;
  }

  private async request<T>(config: IRequestConfig): Promise<T> {
    const { url, params, requiresAuth = true, ...fetchOptions } = config;

    const fullUrl = this.buildUrl(url, params);
    const headers = this.getHeaders(requiresAuth);

    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        headers: {
          ...headers,
          ...fetchOptions.headers,
        },
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError("Network error occurred", "NETWORK_ERROR", error);
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    requiresAuth: boolean = true
  ): Promise<T> {
    return this.request<T>({
      url: endpoint,
      method: EHttpMethod.GET,
      params,
      requiresAuth,
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    requiresAuth: boolean = true
  ): Promise<T> {
    return this.request<T>({
      url: endpoint,
      method: EHttpMethod.POST,
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    requiresAuth: boolean = true
  ): Promise<T> {
    return this.request<T>({
      url: endpoint,
      method: EHttpMethod.PUT,
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    requiresAuth: boolean = true
  ): Promise<T> {
    return this.request<T>({
      url: endpoint,
      method: EHttpMethod.PATCH,
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    });
  }

  async delete<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    requiresAuth: boolean = true
  ): Promise<T> {
    return this.request<T>({
      url: endpoint,
      method: EHttpMethod.DELETE,
      params,
      requiresAuth,
    });
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}

const httpClient = new HttpClient();

export default httpClient;
