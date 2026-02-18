import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { API_URL } from "../api";
import type { AuthContextType, LoginContextType } from "../type/types";


export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const lpCsrfRef = useRef<string | null>(null);
  const opCsrfRef = useRef<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  const login = ({ lpCsrfToken }: LoginContextType) => {
    lpCsrfRef.current = lpCsrfToken;
    setIsAuth(true);
  };

  const refreshAccessToken = async (): Promise<string> => {
    const res = await fetch(`${API_URL}/refresh`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      logout();
      throw new Error("Refresh failed");
    }

    const data = await res.json();
    setIsAuth(true);
    return data.accessToken;
  };

  const productIn = (opCsrfToken: string) => {
    opCsrfRef.current = opCsrfToken;
  };

  const logout = () => {
    lpCsrfRef.current = null;
    opCsrfRef.current = null;
    setIsAuth(false);
  };

  const getlpCsrfToken = () => lpCsrfRef.current;
  const getopCsrfToken = () => opCsrfRef.current;

  const value = useMemo(
    () => ({
      isAuth,
      login,
      productIn,
      logout,
      getlpCsrfToken,
      getopCsrfToken,
      refreshAccessToken,
    }),
    [isAuth],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useCsrf must be used inside CsrfProvider");
  return ctx;
}
