import React, { createContext, useState, useEffect } from 'react';
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { handleOAuthCallback } from "../features/auth/services/authService";
import * as SecureStore from "expo-secure-store";
import {  getAuthTokens, saveAuthTokens } from '@/utils/storageSecureStore';
import { setAuthTokensWithManager, subscribeAuthManager } from '@/features/auth/services/authManager';
import { AppError, AuthContextType, AuthTokens } from '@/features/auth/types/type';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
    const [authError, setAuthError] = useState<AppError | null>(null);

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

                    await handleOAuthCallback(url);
                    await new Promise(resolve => setTimeout(resolve, 800));
                    router.replace("/profile");
                }
                setAuthError(null);
                // Autres callbacks potentiels
            } catch (error) {
              router.replace("/login");
              console.log("OAuth callback error:", error);
              setAuthError(error as AppError);
            }
        }
        );
    
        return () => {
        subscription.remove();
        };
    }, []);

    return (
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, authTokens, setAuthTokens, authError}}>
        {children}
      </AuthContext.Provider>
    );
}

