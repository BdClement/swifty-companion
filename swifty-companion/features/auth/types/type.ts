export type AuthContextType = {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  
    authTokens: AuthTokens | null;
    setAuthTokens: React.Dispatch<React.SetStateAction<AuthTokens | null>>;
  
    authError: AppError | null;
  };
  
  export type AuthTokens = {
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
    };
  
  export type AppError = {
    type:
      | "NETWORK"
      | "OAUTH_NO_CODE"
      | "OAUTH_TOKENS_MISSING"
      | "HTTP_400"
      | "HTTP_401"
      | "HTTP_403"
      | "HTTP_404"
      | "HTTP_409"
      | "HTTP_500"
      | "HTTP_OTHER"
      | "OAUTH_TOKEN_EXCHANGE_FAILED"
      | "OAUTH_INVALID_RESPONSE"
      | "UNKNOWN";
    message?: string;
  };
  