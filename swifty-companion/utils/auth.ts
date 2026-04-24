import * as Crypto from "expo-crypto";
import * as Random from "expo-random";

export function base64UrlEncode(str: string) {
    return btoa(str)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

export function generateCodeVerifier(length = 64): string {
  const randomBytes = Random.getRandomBytes(length);

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }

  return result;
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      verifier,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );
  
    return digest
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
}

export function normalizeCode(code: string | string[] | undefined): string {
    if (!code) {
      throw new Error("Missing OAuth code");
    }
  
    return Array.isArray(code) ? code[0] : code;
  }