import { ORDER_URL } from "../api";
import { useAuth } from "../provider/AuthProvider";

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export function createOrderApiClient(auth: ReturnType<typeof useAuth>) {
  const request = async (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: unknown,
  ): Promise<Response> => {
    const opCsrfToken = auth.getopCsrfToken();
    const res = await fetch(`${ORDER_URL}${url}`, {
      method,
      credentials: "include",
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(opCsrfToken ? { "OP-CSRF-TOKEN": opCsrfToken } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status !== 401) return res;

    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = auth.refreshAccessToken().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    await refreshPromise;
    
    return fetch(`${ORDER_URL}${url}`, {
      method,
      credentials: "include",
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(opCsrfToken ? { "OP-CSRF-TOKEN": opCsrfToken } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  return {
    get: (url: string) => request(url, "GET", undefined),

    post: (url: string, body?: unknown) => request(url, "POST", body),

    put: (url: string, body?: unknown) => request(url, "PUT", body),

    delete: (url: string) => request(url, "DELETE", undefined),

    request,
  };
}
