import { ORDER_URL } from "../api";
import type { AuthContextType,  } from "../type/types";
import { CreateApiClient } from "./CreateApiClient";

export function createOrderApiClient(
  auth: AuthContextType,
): ReturnType<typeof CreateApiClient> {
  const opCsrfToken = auth.getopCsrfToken();
  return CreateApiClient(auth, ORDER_URL, opCsrfToken, "OP-CSRF-TOKEN");
}
