import React, { createContext, useState, useEffect } from 'react';
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { handleOAuthCallback } from "../features/auth/services/authService";
import * as SecureStore from "expo-secure-store";
import {  getAuthTokens, saveAuthTokens } from '@/utils/storageSecureStore';
import { setAuthTokensWithManager, subscribeAuthManager } from '@/features/auth/services/authManager';

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;

  authTokens: AuthTokens | null;
  setAuthTokens: React.Dispatch<React.SetStateAction<AuthTokens | null>>;
};

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);

    // Abonnement au AuthManager
    useEffect(() => {
      // Le manager stocke la fonction comme une variable dans le Set pour etre executée a l'appel de setAuthTokensWithManager
      const unsubscribe = subscribeAuthManager((tokens: AuthTokens | null) => {
          setAuthTokens(tokens);
          setIsAuthenticated(!!tokens);
      });

      // Quand le composant est détruit, return => execute le return de subscribeAuthManager qui est une fonction. Nécessaire pour éviter les memory leaks
      return unsubscribe;
    }, []);
    
    // Recuperation des données depuisSecureStore si nécessaire
    useEffect(() => {
        async function loadSession() {
          const stored = await getAuthTokens();
            
          if (!stored) return;
          console.log('Session issue du SecureStore');
          console.log(`access_token == ${stored.accessToken}`);
          console.log(`refresh_token == ${stored.refreshToken}`);
          console.log(`expires_at == ${stored.expiresAt}\n\n`);
          setAuthTokensWithManager(stored);
          // setAuthTokens(stored);
          // setIsAuthenticated(true);
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

                    // const authResponse = await handleOAuthCallback(url);
                    await handleOAuthCallback(url);
                    await new Promise(resolve => setTimeout(resolve, 800));
                    router.replace("/profile");
                    // Deplacé dans authService
                    // const tokens : AuthTokens = {
                    //     accessToken: authResponse.access_token,
                    //     refreshToken: authResponse.refresh_token,
                    //     expiresAt:
                    //         Date.now() + authResponse.expires_in * 1000
                    // };

                    // Stockage de access_token, refresh_token, expires_at calculé a partir de expires_in (gestion du refresh token)
                    // await saveAuthTokens(tokens);
                    // setIsAuthenticated(true);
                    // setAuthTokens(tokens)

                    // await setAuthTokensWithManager(tokens);
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

