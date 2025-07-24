import { createContext } from "react";

import type { IAuthContext } from "./types";

const AuthContext = createContext<IAuthContext | null>(null);

export default AuthContext;
