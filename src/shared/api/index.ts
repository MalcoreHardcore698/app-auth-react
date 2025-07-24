// Экспорт типов
export type {
  IApiResponse,
  IRequestConfig,
  EHttpMethod,
  IApiEndpoints,
} from "./types";

export { default as httpClient } from "./clients/http-client";
export { default as ApiError } from "./clients/http-client";
export { default as TokenStorage } from "./storages/token-storage";
export { default as CookieStorage } from "./storages/cookie-storage";
export { default as MockUserStorage } from "./storages/mock-user-storage";

export const API_CONFIG = {
  BASE_URL: "http://localhost:3001/api",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      ME: "/auth/me",
      LOGOUT: "/auth/logout",
      RESET_PASSWORD: "/auth/reset-password",
    },
  },
  TIMEOUT: 10000,
} as const;
