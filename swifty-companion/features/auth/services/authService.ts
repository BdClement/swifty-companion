import { normalizeCode } from "@/utils/auth";
import { env } from "../../../config/env";
import * as Linking from "expo-linking";
import { saveAuthTokens } from "@/utils/storageSecureStore";
import { setAuthTokensWithManager } from "./authManager";
import { mapHttpError } from "@/features/profile/hooks/use-api-error";
import { AppError, AuthTokens } from "../types/type";

console.log('uid == ', env.clientUid);

export async function initiateLogin() {
    const url = 
    `https://api.intra.42.fr/oauth/authorize` + 
    `?client_id=${env.clientUid}` +
    `&redirect_uri=${encodeURIComponent(env.redirectUrl)}` +
    `&response_type=code`;
    await Linking.openURL(url);
}

export async function handleOAuthCallback(url: string) {
  console.log("appel a handleOAuthCallback");
    const parsed = Linking.parse(url);
    const code = normalizeCode(parsed.queryParams?.code);
  
    if (!code) {
      console.log(`Error in handleOAuthCallback : No OAuth code found`);
      throw { type: "OAUTH_NO_CODE", message: "No OAuth code found"} satisfies AppError;
    }
  
    return await fetchOAuthTokens(code);
}

async function fetchOAuthTokens(code: string) {
  console.log("appel a fetchOAuthTokens");
  try {
    const response = await fetch("https://api.intra.42.fr/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: env.clientUid,
        client_secret: env.clientSecret,
        code,
        redirect_uri: env.redirectUrl,// Pour que OAuth verifie que c'est bien le meme flow inité par le login précedant
      }),
    });
    // Renverra access_token, token_type, expires_in, refres_token, scope, created_at
    
    const data = await response.json();
    console.log("OAuth response:", JSON.stringify(data, null, 2));
  
    if (!response.ok) {
      throw {
        type: "OAUTH_TOKEN_EXCHANGE_FAILED",
        message: data.error_description || data.error || "OAuth token exchange failed",
      } satisfies AppError;
    }
    // Validation de réponse
    if (
      !data ||
      typeof data.access_token !== "string" ||
      typeof data.refresh_token !== "string" ||
      typeof data.expires_in !== "number"
    ) {
      throw {
        type: "OAUTH_INVALID_RESPONSE",
        message: "Invalid OAuth response format",
      } satisfies AppError;
    }
    const tokens : AuthTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt:
          Date.now() + data.expires_in * 1000
    };
    await setAuthTokensWithManager(tokens);
    return data;
  } catch (error: any) {
    if (error?.type) throw error; // Si erreur deja AppError => je la throw direct

    // Pas opti pour délimiter Network error de Unkown Error 
    if (error instanceof TypeError) {
      // souvent fetch/network
      throw { type: "NETWORK", message: "Network error during authentication" };
    }

    throw { type: "UNKNOWN", message: "Unexpected error" };
  } 
}

  // Pour le refreshToken, OAuth attends les credentials dans le header ou en tant que paramètre de requete
  export async function refreshAccessToken(refreshToken: string) {
    try {
      const credentials = btoa(`${env.clientUid}${env.clientSecret}`)//encode une string en Base64 (normalement : entre les 2)
      console.log("btoa credentials = ", credentials);
      const response = await fetch("https://api.intra.42.fr/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${credentials}`,
          },
          body: JSON.stringify({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            // client_id: env.clientUid,
            // client_secret: env.clientSecret,
          }),
        });
        const data = await response.json();
        console.log("response refresh = ", data);

        if (!response.ok) {
          const type = mapHttpError(response.status);
          throw {
            type: type,
            message: data.error_description || data.error,
          } satisfies AppError;
        }
        
        // Validation de réponse
        if (
          !data ||
          typeof data.access_token !== "string" ||
          typeof data.refresh_token !== "string" ||
          typeof data.expires_in !== "number"
        ) {
          throw {
            type: "OAUTH_INVALID_RESPONSE",
            message: "Invalid refresh token response",
          } satisfies AppError;
        }
        // Persistance des nouveaux credentials
        const tokensUpdate : AuthTokens = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt:
              Date.now() + data.expires_in * 1000
        };
        console.log("Tokens update avec : ", tokensUpdate);
        await setAuthTokensWithManager(tokensUpdate);
        return tokensUpdate;
    } catch (error: any) {
      if (error?.type) throw error;

      throw {
        type: "NETWORK",
        message: error?.message || "Network error during token refresh",
      } satisfies AppError;
    }
  }