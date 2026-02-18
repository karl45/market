import { ORDER_URL } from "../api";
import type { AuthContextType, LoadingContextType } from "../type/types";
import { CreateApiClient } from "./createApiClient";

export function createOrderApiClient(
  auth: AuthContextType,
  load: LoadingContextType,
): ReturnType<typeof CreateApiClient> {
  const opCsrfToken = auth.getopCsrfToken();
  return CreateApiClient(auth, load, ORDER_URL, opCsrfToken, "OP-CSRF-TOKEN");
}
