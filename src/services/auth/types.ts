import type { TUser } from "@/shared/types";

export interface IAuthState {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ILoginCredentials extends Record<string, unknown> {
  email: string;
  password: string;
}

export interface IRegisterCredentials extends Record<string, unknown> {
  name: string;
  email: string;
  password: string;
}

export interface IResetPasswordCredentials extends Record<string, unknown> {
  email: string;
}

export interface IResetPasswordResponse {
  message: string;
  success: boolean;
}

export interface IAuthResponse {
  user: TUser;
  token: string;
}

export interface IAuthContext extends IAuthState {
  login: (credentials: ILoginCredentials) => Promise<void>;
  register: (credentials: IRegisterCredentials) => Promise<void>;
  logout: () => void;
  me: () => Promise<void>;
  resetPassword: (
    credentials: IResetPasswordCredentials
  ) => Promise<IResetPasswordResponse>;
}
