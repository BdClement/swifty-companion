import React, { createContext, useState } from 'react';
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { handleOAuthCallback } from "../features/auth/services/authService";
import * as SecureStore from "expo-secure-store";
import { saveAccessToken } from '@/utils/storageSecureStore';

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuhtenticated: React.Dispatch<React.SetStateAction<boolean>>;
};
// Type dédié au stockage SecureStore
type AuthTokens = {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const subscription = Linking.addEventListener(
        "url",
        async ({ url }) => {
            try {
                if (url.startsWith("swiftycompanion://oauth")) {
                    await handleOAuthCallback(url);
                    // Stockage de access_token, refresh_token, expires_at calculé a partir de expires_in (gestion du refresh token)
                    // await saveAccessToken(token);
                }
                // Autres callbacks potentiels
            } catch (error) {
            console.error("OAuth callback error:", error);
            // Améliorer gestion d'erreurs
            }
        }
        );
    
        return () => {
        subscription.remove();
        };
    }, []);

    return (
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        {children}
      </AuthContext.Provider>
    );
}

