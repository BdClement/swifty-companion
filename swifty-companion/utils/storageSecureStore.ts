import { AuthTokens } from "@/features/auth/types/type";
import * as SecureStore from "expo-secure-store";

// SecureStore est conçu pour le mobile,sur web cela ne fonctionne (on pourrait faire un fallback sur localStorage dans ce cas)

export async function saveAuthTokens(tokens: AuthTokens) {
    // Les 3 opérations sont lancées en meme temps ici : gain de temps/performance, code plus expressif
    await Promise.all([
        SecureStore.setItemAsync("access_token", tokens.accessToken),
        SecureStore.setItemAsync("refresh_token", tokens.refreshToken),
        SecureStore.setItemAsync("expires_at", tokens.expiresAt.toString()),
    ]);
}

// A appeler au logout de l'app +  clear le authTokens du authContext + isAuthenticated
export async function clearAuthTokens() {
    console.log('appel a clearAuthTokens')
    await Promise.all([
        SecureStore.deleteItemAsync("access_token"),
        SecureStore.deleteItemAsync("refresh_token"),
        SecureStore.deleteItemAsync("expires_at"),
      ]);
}

export async function getAuthTokens() {
    try {
        const [accessToken, refreshToken, expiresAt] = await Promise.all([
          SecureStore.getItemAsync("access_token"),
          SecureStore.getItemAsync("refresh_token"),
          SecureStore.getItemAsync("expires_at"),
        ]);
    
        if (!accessToken || !refreshToken || !expiresAt) {
          return null;
        }
    
        const parsed: AuthTokens = {
          accessToken,
          refreshToken,
          expiresAt: Number(expiresAt),
        };
    
        return parsed;
      } catch (error) {
        console.error("Failed to load auth tokens:", error);
        return null;
      }
}

export async function getAccessToken() {
  return SecureStore.getItemAsync(
    "access_token"
  );
}

export async function removeAccessToken() {
  return SecureStore.deleteItemAsync(
    "access_token"
  );
}