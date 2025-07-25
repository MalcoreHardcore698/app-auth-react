import { BrowserRouter, Routes, Route } from "react-router-dom";

import { BASE_PATH } from "@/shared/constants";

import ProtectedRoute from "./app-route";
import routes from "./routes";

function Router() {
  return (
    <BrowserRouter basename={BASE_PATH}>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<ProtectedRoute route={route} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
