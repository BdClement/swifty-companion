import { generateCodeChallenge, generateCodeVerifier, normalizeCode } from "@/utils/auth";
import { env } from "../../../config/env";
import * as Linking from "expo-linking";

console.log('uid == ', env.clientUid);

type PKCEResult = {
    verifier: string;
    challenge: string;
  };

let currentCodeVerifier: string | null = null;// A deplacer dans SecureStore ??

export async function initiateLogin() {
    // generate code_verifier/generate code_challenge
    const { verifier, challenge } = await initiatePKCE();
    currentCodeVerifier = verifier;
    // redirect 42 
    const url = 
    `https://api.intra.42.fr/oauth/authorize` + 
    `?client_id=${env.clientUid}` +
    `&redirect_uri=${encodeURIComponent(env.redirectUrl)}` +
    `&response_type=code` +
    `&scope=public` +
    `&code_challenge=${challenge}` +
    `&code_challenge_method=S256`;
    await Linking.openURL(url);
    // Stockage dans Auth Context
}

export async function handleOAuthCallback(url: string) {
    const parsed = Linking.parse(url);
    const code = normalizeCode(parsed.queryParams?.code);
  
    if (!code) {
      throw new Error("No OAuth code found");
    }
  
    return exchangeCodeForToken(code); // await ?
}

async function exchangeCodeForToken(code: string) {
    if (!currentCodeVerifier) {
        throw new Error("Missing PKCE verifier");
    }

    const response = await fetch("https://api.intra.42.fr/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: env.clientUid,
        code,
        redirect_uri: env.redirectUrl,// Pour que OAuth verifie que c'est bien le meme flow inité par le login précedant
        code_verifier: currentCodeVerifier,
      }),
    });
    // Renverra access_token, token_type, expires_in, refres_token, scope, created_at
  
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error_description ||
        data.error ||
        "OAuth token exchange failed"
      );
    }
    currentCodeVerifier = null;

    return data;
  }

export async function initiatePKCE(): Promise<PKCEResult> {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    return {
        verifier,
        challenge,
    };
}