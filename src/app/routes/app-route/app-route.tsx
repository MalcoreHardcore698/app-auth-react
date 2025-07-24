import { Suspense } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/services/auth";
import { Loader } from "@/shared/ui";

import type { IRoute } from "../types";
import { ERoutePath } from "../types";

interface IAppRouteProps {
  route: IRoute;
}

function AppRoute({ route }: IAppRouteProps) {
  const { path, component: Component, secured, guested } = route;
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader.FullScreen />;
  }

  if (secured && !isAuthenticated) {
    return <Navigate to={ERoutePath.AUTH} replace />;
  }

  if (guested && isAuthenticated) {
    return <Navigate to={ERoutePath.WELCOME} replace />;
  }

  if (path === ERoutePath.ROOT) {
    if (isAuthenticated) {
      return <Navigate to={ERoutePath.WELCOME} replace />;
    } else {
      return <Navigate to={ERoutePath.AUTH} replace />;
    }
  }

  return (
    <Suspense fallback={<Loader.FullScreen />}>
      <Component />
    </Suspense>
  );
}

export default AppRoute;
