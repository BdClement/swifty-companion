import { normalizeCode } from "@/utils/auth";
import { env } from "../../../config/env";
import * as Linking from "expo-linking";
import { AuthTokens } from "@/contexts/AuthContext";
import { saveAuthTokens } from "@/utils/storageSecureStore";
import { setAuthTokensWithManager } from "./authManager";

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
      throw new Error("No OAuth code found");
    }
  
    return await fetchOAuthTokens(code);
}

async function fetchOAuthTokens(code: string) {
  console.log("appel a fetchOAuthTokens");

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
      throw new Error(
        data.error_description ||
        data.error ||
        "OAuth token exchange failed"
      );
    }
    // Validation de réponse
    if (
      !data ||
      typeof data.access_token !== "string" ||
      typeof data.refresh_token !== "string" ||
      typeof data.expires_in !== "number"
    ) {
      throw new Error("Invalid OAuth response format");
    }
    const tokens : AuthTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt:
          Date.now() + data.expires_in * 1000
    };
    await setAuthTokensWithManager(tokens);
    return data;
  }

  // Pour le refreshToken, OAuth attends les credentials dans le header ou en tant que paramètre de requete
  export async function refreshAccessToken(refreshToken: string) {
    // Appel API
    const credentials = btoa(`${env.clientUid}${env.clientSecret}`)//encode une string en Base64 (normalement : entre les 2)
    console.log("btoa credentials = ", credentials);
    const response = await fetch("https://api.intra.42.fr/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          // client_id: env.clientUid,
          // client_secret: env.clientSecret,
        }),
        // body: new URLSearchParams({
        //   grant_type: "refresh_token",
        //   refresh_token: refreshToken,
        //   client_id: env.clientUid,
        //   client_secret: env.clientSecret,
        // }).toString()
      });
      
      const data = await response.json();
      console.log("response refresh = ", data);
      if (!response.ok) {
        throw new Error(
          data.error_description ||
          data.error ||
          "Refresh failed"
        );
      }
      // Validation de réponse
      if (
        !data ||
        typeof data.access_token !== "string" ||
        typeof data.refresh_token !== "string" ||
        typeof data.expires_in !== "number"
      ) {
        throw new Error("Invalid OAuth response format");
      }
      // return await response.json();
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
  }