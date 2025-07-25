import type { ComponentType } from "react";

export enum ERoutePath {
  ROOT = "/app-auth-react",
  AUTH = "/app-auth-react/auth",
  WELCOME = "/app-auth-react/welcome",
  NOT_FOUND = "/app-auth-react/*",
}

export interface IRoute {
  path: string;
  component: ComponentType;
  secured?: boolean;
  guested?: boolean;
}
