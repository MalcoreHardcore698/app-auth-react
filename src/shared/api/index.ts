export { default as httpClient } from "./clients/http-client";

export { default as ApiError } from "./clients/http-client";

export { default as TokenStorage } from "./storages/token-storage";

export { default as CookieStorage } from "./storages/cookie-storage";

export { default as MockUserStorage } from "./storages/mock-user-storage";

export type {
  IApiResponse,
  IRequestConfig,
  EHttpMethod,
  IApiEndpoints,
} from "./types";

export { API_CONFIG } from "./constants";
