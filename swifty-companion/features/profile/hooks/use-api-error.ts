import { AppError } from "@/features/auth/types/type";
import { useState } from "react";

export function useApiError() {
    const [apiError, setApiError] = useState<AppError | null>(null);
  
    return { apiError, setApiError };
}

export function mapHttpError(status: number): AppError["type"] {
    switch (status) {
      case 400:
        return "HTTP_400";
  
      case 401:
        return "HTTP_401";
  
      case 403:
        return "HTTP_403";
  
      case 404:
        return "HTTP_404";
  
      case 409:
        return "HTTP_409";
  
      case 500:
        return "HTTP_500";
  
      default:
        if (status >= 500) return "HTTP_500";
        if (status >= 400) return "HTTP_OTHER";
        return "UNKNOWN";
    }
}

export function getErrorMessage(error: AppError) {
    switch (error.type) {
      case "NETWORK":
        return "Unable to connect. Check your internet connection and try again.";
      
      case "OAUTH_NO_CODE":
        return "The sign-in response was incomplete. Please try signing in again.";

      case "OAUTH_ACCESS_DENIED":
        return "Sign-in was cancelled.";

      case "OAUTH_PROVIDER_ERROR":
        return "Sign-in failed. Please try again.";
  
      case "OAUTH_TOKENS_MISSING":
        return "Your session is unavailable. Please sign in again.";

      case "HTTP_400":
        return "The request could not be completed. Check the information and try again (400).";
  
      case "HTTP_401":
        return "Authentication failed. Please sign in again (401).";
          
      case "HTTP_403":
        return "You do not have permission to access this resource (403)."; 
            
      case "HTTP_404":
        return "The requested resource could not be found (404).\nCheck the information and try again.";
          
      case "HTTP_409":
        return "The request conflicts with the current state (409). Please refresh and try again.";
  
      case "HTTP_500":
        return "The service is temporarily unavailable (500). Please wait a moment and try again.";
  
      case "HTTP_OTHER":
        return "The request failed. Please try again. If the problem persists, contact support.";
  
      case "OAUTH_TOKEN_EXCHANGE_FAILED":
        return "Sign-in could not be completed. Please try again.";
  
      case "OAUTH_INVALID_RESPONSE":
        return "The server returned an invalid response. Please try again later.";
  
      case "UNKNOWN":
        return "An unexpected error occurred. Please try again. If the problem persists, contact support.";
  
      default:
        return "An unexpected error occurred. Please try again.";
    }
  }