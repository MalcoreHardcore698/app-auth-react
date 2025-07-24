import { useEffect, useReducer, type ReactNode } from "react";

import type {
  IAuthContext,
  IAuthState,
  ILoginCredentials,
  IRegisterCredentials,
  IResetPasswordCredentials,
  IResetPasswordResponse,
} from "./types";
import authService from "./service";
import AuthContext from "./context";

const initialState: IAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

enum EAuthAction {
  SET_LOADING = "SET_LOADING",
  SET_USER = "SET_USER",
  SET_ERROR = "SET_ERROR",
  LOGOUT = "LOGOUT",
}

type TAuthAction =
  | { type: EAuthAction.SET_LOADING; payload: boolean }
  | { type: EAuthAction.SET_USER; payload: IAuthState["user"] }
  | { type: EAuthAction.SET_ERROR; payload: string | null }
  | { type: EAuthAction.LOGOUT };

function authReducer(state: IAuthState, action: TAuthAction): IAuthState {
  switch (action.type) {
    case EAuthAction.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case EAuthAction.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        error: null,
        isLoading: false,
      };
    case EAuthAction.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case EAuthAction.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const checkCurrentUser = async (): Promise<void> => {
    if (!authService.hasToken()) {
      return;
    }

    dispatch({ type: EAuthAction.SET_LOADING, payload: true });

    try {
      const user = await authService.me();

      dispatch({ type: EAuthAction.SET_USER, payload: user });
    } catch (error) {
      console.error("Failed to get current user:", error);

      authService.logout();

      dispatch({ type: EAuthAction.LOGOUT });
    }
  };

  const me = async (): Promise<void> => {
    await checkCurrentUser();
  };

  const login = async (credentials: ILoginCredentials): Promise<void> => {
    dispatch({ type: EAuthAction.SET_LOADING, payload: true });
    dispatch({ type: EAuthAction.SET_ERROR, payload: null });

    try {
      const response = await authService.login(credentials);
      dispatch({ type: EAuthAction.SET_USER, payload: response.user });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      dispatch({ type: EAuthAction.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  const register = async (credentials: IRegisterCredentials): Promise<void> => {
    dispatch({ type: EAuthAction.SET_LOADING, payload: true });
    dispatch({ type: EAuthAction.SET_ERROR, payload: null });

    try {
      const response = await authService.register(credentials);

      dispatch({ type: EAuthAction.SET_USER, payload: response.user });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";

      dispatch({ type: EAuthAction.SET_ERROR, payload: errorMessage });

      throw error;
    }
  };

  const resetPassword = async (
    credentials: IResetPasswordCredentials
  ): Promise<IResetPasswordResponse> => {
    dispatch({ type: EAuthAction.SET_LOADING, payload: true });

    try {
      const response = await authService.resetPassword(credentials);

      dispatch({ type: EAuthAction.SET_ERROR, payload: null });

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Password reset failed";

      dispatch({ type: EAuthAction.SET_ERROR, payload: errorMessage });

      throw error;
    } finally {
      dispatch({ type: EAuthAction.SET_LOADING, payload: false });
    }
  };

  const logout = (): void => {
    authService.logout();

    dispatch({ type: EAuthAction.LOGOUT });
  };

  const contextValue: IAuthContext = {
    ...state,
    me,
    login,
    register,
    resetPassword,
    logout,
  };

  useEffect(() => {
    checkCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
