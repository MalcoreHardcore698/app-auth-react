import { httpClient, TokenStorage, API_CONFIG } from "@/shared/api";
import type { TUser } from "@/shared/types";

import type {
  IAuthResponse,
  ILoginCredentials,
  IRegisterCredentials,
  IResetPasswordCredentials,
  IResetPasswordResponse,
} from "./types";
import ApiMocks from "./__mocks__";

class AuthService {
  async login(credentials: ILoginCredentials): Promise<IAuthResponse> {
    try {
      const response = await httpClient.post<IAuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials,
        false
      );

      TokenStorage.setToken(response.token);

      return response;
    } catch {
      const mockResponse = await ApiMocks.mockLogin(credentials);

      TokenStorage.setToken(mockResponse.token);

      return mockResponse;
    }
  }

  async register(credentials: IRegisterCredentials): Promise<IAuthResponse> {
    try {
      const response = await httpClient.post<IAuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        credentials,
        false
      );

      TokenStorage.setToken(response.token);

      return response;
    } catch {
      const mockResponse = await ApiMocks.mockRegister(credentials);

      TokenStorage.setToken(mockResponse.token);

      return mockResponse;
    }
  }

  async me(): Promise<TUser> {
    if (!TokenStorage.hasToken()) {
      throw new Error("No auth token found");
    }

    try {
      const user = await httpClient.get<TUser>(API_CONFIG.ENDPOINTS.AUTH.ME);

      return user;
    } catch {
      return await ApiMocks.mockMe();
    }
  }

  async resetPassword(
    credentials: IResetPasswordCredentials
  ): Promise<IResetPasswordResponse> {
    try {
      const response = await httpClient.post<IResetPasswordResponse>(
        API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
        credentials,
        false
      );

      return response;
    } catch {
      return await ApiMocks.mockResetPassword(credentials);
    }
  }

  logout(): void {
    const token = TokenStorage.getToken();

    TokenStorage.clear();

    if (token) {
      ApiMocks.clearUserToken(token);
    }
  }

  hasToken(): boolean {
    return TokenStorage.hasToken();
  }

  getToken(): string | null {
    return TokenStorage.getToken();
  }
}

const authService = new AuthService();

export default authService;
