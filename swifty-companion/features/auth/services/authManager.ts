import { AuthTokens } from "@/contexts/AuthContext";
import { clearAuthTokens, saveAuthTokens } from "@/utils/storageSecureStore";

let Auth: AuthTokens | null = null;
const listeners = new Set<(tokens: AuthTokens | null) => void>();

export function getAuthTokensFromManager() {
    return Auth;
}

export async function setAuthTokensWithManager(tokens: AuthTokens | null) {
    Auth = tokens;

    if (tokens) {
        await saveAuthTokens(tokens);
    } else {
        await clearAuthTokens();
    }

    // Éxécution de la fonction stocker dans le Set listeners
    listeners.forEach((fn) => fn(Auth));
}

export function subscribeAuthManager(listener: (tokens: AuthTokens | null) => void) {
    listeners.add(listener);

    listener(Auth);

    // Le return est une fonction
    return () => {
        listeners.delete(listener);
    };
}
