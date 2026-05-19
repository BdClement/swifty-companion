import { normalizeCode } from "@/utils/auth";
import { env } from "../../../config/env";
import * as Linking from "expo-linking";

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
  console.log("appel a exchangeCodeForToken");

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

    return data;
  }