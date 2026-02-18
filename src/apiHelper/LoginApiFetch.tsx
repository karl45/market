import { API_URL } from "../api";
import type { AuthContextType } from "../type/types";
import { CreateApiClient } from "./CreateApiClient";

export function createLoginApiClient(
  auth: AuthContextType,
): ReturnType<typeof CreateApiClient> {
  const lpCsrfToken = auth.getlpCsrfToken();

  return CreateApiClient(auth, API_URL, lpCsrfToken, "LP-CSRF-TOKEN");
}
