import { API_URL } from "../api";
import type { AuthContextType, LoadingContextType } from "../type/types";
import { CreateApiClient } from "./createApiClient";

export function createLoginApiClient(
  auth: AuthContextType,
  load: LoadingContextType,
): ReturnType<typeof CreateApiClient> {
  const lpCsrfToken = auth.getlpCsrfToken();

  return CreateApiClient(auth, load, API_URL, lpCsrfToken ,"LP-CSRF-TOKEN");
}
