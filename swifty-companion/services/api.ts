import { refreshAccessToken } from "@/features/auth/services/authService";
import { AppError } from "@/features/auth/types/type";
import { mapHttpError } from "@/features/profile/hooks/use-api-error";
import { HttpMethod } from "@/features/profile/types/type";
import { getAuthTokens } from "@/utils/storageSecureStore";

const API_BASE_URL = "https://api.intra.42.fr/v2";

interface ApiFetchOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
}

// On ne sait pas encore quel type sera la reponse, on le precisera lors de l'appel ou alors ce sera any ou unknown
export async function apiFetch<T>(
    endpoint: string,
    options: ApiFetchOptions = {}
  ): Promise<T> {
    try {
      let tokens = await getAuthTokens();
      if (!tokens) {
          throw {
            type: "OAUTH_TOKENS_MISSING",
            message: "No auth token found",
          } satisfies AppError;
      }
      const isExpired = Date.now() >= tokens.expiresAt;
      console.log('ApiFetch isExpired = ', isExpired);
      if (isExpired) {
        console.log("refresh_token envoyé a refreshAccess : ", tokens.refreshToken);
        tokens = await refreshAccessToken(tokens.refreshToken);
      }
    
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...(tokens ? { Authorization: `Bearer ${tokens.accessToken}` } : {}),
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
    
      if (!res.ok) {
        const errorText = await res.text();

        const type = mapHttpError(res.status);
        throw {
          type: type,
          message: errorText || res.statusText,
        } satisfies AppError;
      }
    
      return (await res.json()) as T;
    } catch (error: any) {
      if (error?.type) throw error;

      return Promise.reject({
        type: "NETWORK",
        message: error?.message || "Network error",
      } satisfies AppError);
    }
  }
