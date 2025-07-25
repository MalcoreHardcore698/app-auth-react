import { lazy } from "react";

import { ERoutePath } from "./types";
import type { IRoute } from "./types";

const AuthPage = lazy(() => import("@/pages/auth"));
const WelcomePage = lazy(() => import("@/pages/welcome"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));

const routes: IRoute[] = [
  {
    path: ERoutePath.ROOT,
    component: WelcomePage,
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
  {
    path: ERoutePath.NOT_FOUND,
    component: NotFoundPage,
  },
];

export default routes;
