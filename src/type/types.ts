export type LoginContextType = {
  lpCsrfToken: string | null;
};

export type LoadingContextType = {
  loading: () => void;
  loaded: () => void;
  getLoading:() => boolean | null;
};
export type AuthContextType = {
  login: ({}: LoginContextType) => void;
  logout: () => void;
  productIn: (value: string) => void;
  isAuth: boolean | null;
  getlpCsrfToken: () => string | null;
  getopCsrfToken: () => string | null;
};

export interface LoadProps {
  load: LoadingContextType;
}

export interface AuthProps {
    auth: AuthContextType;
}