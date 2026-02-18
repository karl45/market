import { API_URL } from "../api";
import type { AuthContextType } from "../type/types";

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export function CreateApiClient(
  auth: AuthContextType,
  server_url: string,
  csrf_token: string | null,
  csrf_token_name: string,
) {
  const request = async (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: unknown,
  ): Promise<Response> => {
    const res = await fetch(`${server_url}${url}`, {
      method,
      credentials: "include",
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(csrf_token ? { [csrf_token_name]: csrf_token } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status !== 401) {
      return res;
    }
    if (!isRefreshing) {
      const refreshAccessToken = async (): Promise<string> => {
        const res = await fetch(`${API_URL}/refresh`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          auth.logout();
          throw new Error("Refresh failed");
        }

        const data = await res.json();
        return data.accessToken;
      };

      isRefreshing = true;
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    await refreshPromise;

    const updated_res = await fetch(`${server_url}${url}`, {
      method,
      credentials: "include",
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(csrf_token ? { [csrf_token_name]: csrf_token } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return updated_res;
  };

  return {
    get: (url: string) => request(url, "GET", undefined),

    post: (url: string, body?: unknown) => request(url, "POST", body),

    put: (url: string, body?: unknown) => request(url, "PUT", body),

    delete: (url: string) => request(url, "DELETE", undefined),

    request,
  };
}
