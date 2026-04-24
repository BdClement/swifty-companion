import * as SecureStore from "expo-secure-store";

// A modifier en focntion du type AuthTokens
export async function saveAccessToken(token: string) {
  await SecureStore.setItemAsync(
    "access_token",
    token
  );
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