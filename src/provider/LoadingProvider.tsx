import {
  createContext,
  useContext,
  useRef,
  type PropsWithChildren,
} from "react";
import type { LoadingContextType } from "../type/types";


export const LoadingContext = createContext<LoadingContextType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const isLoading = useRef<boolean | null>(null);

  const loading = () => {
    isLoading.current = true;
  };

  const loaded = () => {
    isLoading.current = false;
  };

  const getLoading = () => isLoading.current;

  const value = {
    getLoading,
    loading,
    loaded,
  };
  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

export function useLoad() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useCsrf must be used inside CsrfProvider");
  return ctx;
}
