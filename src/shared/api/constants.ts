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
