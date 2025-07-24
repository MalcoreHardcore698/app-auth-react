import type { ComponentType } from "react";

export enum ERoutePath {
  ROOT = "/",
  AUTH = "/auth",
  WELCOME = "/welcome",
}

export interface IRoute {
  path: string;
  component: ComponentType;
  secured?: boolean;
  guested?: boolean;
}
