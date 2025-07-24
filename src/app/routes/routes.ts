import { lazy } from "react";
import { ERoutePath } from "./types";
import type { IRoute } from "./types";

const AuthPage = lazy(() => import("@/pages/auth"));
const WelcomePage = lazy(() => import("@/pages/welcome"));

const routes: IRoute[] = [
  {
    path: ERoutePath.ROOT,
    component: WelcomePage, // AppRoute будет обрабатывать редиректы
  },
  {
    path: ERoutePath.AUTH,
    component: AuthPage,
    guested: true,
  },
  {
    path: ERoutePath.WELCOME,
    component: WelcomePage,
    secured: true,
  },
];

export default routes;
