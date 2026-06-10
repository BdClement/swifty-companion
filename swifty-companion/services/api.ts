import { AuthTokens } from "@/contexts/AuthContext";
import { setAuthTokensWithManager } from "@/features/auth/services/authManager";
import { refreshAccessToken } from "@/features/auth/services/authService";
import { getAuthTokens } from "@/utils/storageSecureStore";

const API_BASE_URL = "https://api.intra.42.fr/v2";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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
    let tokens = await getAuthTokens();
    if (!tokens) {
        throw new Error("API error : api call tried without token");
    }
    const isExpired = Date.now() >= tokens.expiresAt;
    console.log('ApiFetch isExpired = ', isExpired);
    if (isExpired) {
      console.log("refresh_token envoyé a refreshAccess : ", tokens.refreshToken);
      tokens = await refreshAccessToken(tokens.refreshToken);
      // const refreshResponse = await refreshAccessToken(tokens.refreshToken);
      // Deplacé dans authService
      // if (
      //   !refreshResponse ||
      //   typeof refreshResponse.access_token !== "string" ||
      //   typeof refreshResponse.refresh_token !== "string" ||
      //   typeof refreshResponse.expires_in !== "number"
      // ) {
      //   throw new Error("Invalid OAuth response format");
      // }
      // const tokensUpdate : AuthTokens = {
      //   accessToken: refreshResponse.access_token,
      //   refreshToken: refreshResponse.refresh_token,
      //   expiresAt:
      //       Date.now() + refreshResponse.expires_in * 1000
      // };
      // console.log("Tokens update avec : ", tokensUpdate);
      // await setAuthTokensWithManager(tokensUpdate);
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
      throw new Error(
        `API error ${res.status}: ${errorText || res.statusText}`
      );
    }
  
    return (await res.json()) as T;
  }
