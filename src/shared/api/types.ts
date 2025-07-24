export interface IApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface IApiError {
  message: string;
  code?: string | number;
  details?: unknown;
}

export interface IRequestConfig extends RequestInit {
  url: string;
  params?: Record<string, string | number | boolean>;
  requiresAuth?: boolean;
}

export enum EHttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface IApiEndpoints {
  baseUrl: string;
  auth: {
    login: string;
    register: string;
    me: string;
    logout: string;
  };
}
