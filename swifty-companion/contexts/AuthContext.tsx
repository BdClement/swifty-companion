import React, { createContext, useState } from 'react';
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { handleOAuthCallback } from "../features/auth/services/authService";
import * as SecureStore from "expo-secure-store";
import {  getAuthTokens, saveAuthTokens } from '@/utils/storageSecureStore';

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuhtenticated: React.Dispatch<React.SetStateAction<boolean>>;
};
// Type dédié au stockage SecureStore
export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
    
    // Recuperation des données depuisSecureStore si nécessaire
    useEffect(() => {
        async function loadSession() {
          const stored = await getAuthTokens();
      
          if (!stored) return;
      
          setAuthTokens(stored);
          setIsAuthenticated(true);
        }
      
        loadSession();
      }, []);

    // Update des données depuis callback
    useEffect(() => {
        const subscription = Linking.addEventListener(
        "url",
        async ({ url }) => {
            try {
                if (url.startsWith("swiftycompanion://oauth")) {
                    const authResponse = await handleOAuthCallback(url);

                    if (
                        !authResponse ||
                        typeof authResponse.access_token !== "string" ||
                        typeof authResponse.refresh_token !== "string" ||
                        typeof authResponse.expires_in !== "number"
                      ) {
                        throw new Error("Invalid OAuth response format");
                      }

                    const tokens : AuthTokens = {
                        accessToken: authResponse.access_token,
                        refreshToken: authResponse.refresh_token,
                        expiresAt:
                            Date.now() + authResponse.expires_in * 1000
                    };

                    // Stockage de access_token, refresh_token, expires_at calculé a partir de expires_in (gestion du refresh token)
                    await saveAuthTokens(tokens);
                    setIsAuthenticated(true);
                    setAuthTokens(tokens)
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
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, authTokens, setAuthTokens}}>
        {children}
      </AuthContext.Provider>
    );
}

