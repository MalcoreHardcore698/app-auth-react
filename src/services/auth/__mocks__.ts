import type { TUser } from "@/shared/types";
import MockUserStorage from "@/shared/api/storages/mock-user-storage";
import TokenStorage from "@/shared/api/storages/token-storage";

import type {
  IAuthResponse,
  ILoginCredentials,
  IRegisterCredentials,
  IResetPasswordCredentials,
  IResetPasswordResponse,
} from "./types";

class ApiMocks {
  private static delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private static initIfNeeded(): void {
    MockUserStorage.initTestData();
  }

  static async mockLogin(
    credentials: ILoginCredentials
  ): Promise<IAuthResponse> {
    await this.delay();

    this.initIfNeeded();

    try {
      const user = MockUserStorage.authenticateUser(credentials);

      const token = TokenStorage.createToken(user.id);

      return {
        user,
        token,
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  }

  static async mockRegister(
    credentials: IRegisterCredentials
  ): Promise<IAuthResponse> {
    await this.delay();

    this.initIfNeeded();

    try {
      const newUser = MockUserStorage.createUser(credentials);

      const token = TokenStorage.createToken(newUser.id);

      return {
        user: newUser,
        token,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  }

  static async mockMe(): Promise<TUser> {
    await this.delay(200);

    this.initIfNeeded();

    const token = TokenStorage.getToken();

    if (!token) {
      throw new Error("No token found");
    }

    const userId = TokenStorage.getUserIdByToken(token);

    if (!userId) {
      throw new Error("Invalid or expired token");
    }

    const user = MockUserStorage.findUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  static async mockResetPassword(
    credentials: IResetPasswordCredentials
  ): Promise<IResetPasswordResponse> {
    await this.delay();

    this.initIfNeeded();

    try {
      // Check if user exists with provided email
      const user = MockUserStorage.findUserByEmail(credentials.email);

      if (!user) {
        throw new Error("User with this email not found");
      }

      // In real app, here would be email sending logic
      return {
        message: "Password reset email has been sent to your email address",
        success: true,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Password reset failed"
      );
    }
  }

  static shouldUseMock(endpoint: string): boolean {
    const mockEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/me",
      "/auth/reset-password",
    ];

    return mockEndpoints.includes(endpoint);
  }

  static clearUserToken(token: string): void {
    TokenStorage.removeTokenUserLink(token);
  }

  static clearAll(): void {
    MockUserStorage.clearAll();
    TokenStorage.clearAll();
  }
}

export default ApiMocks;
