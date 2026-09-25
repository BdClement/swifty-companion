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
        return "Network error. Please check your network connection.";
      
      case "OAUTH_NO_CODE":
        return "Error: Login cancelled or invalid callback. Try again"
  
      case "OAUTH_TOKENS_MISSING":
        return "Error: No OAuth tokens"

    case "HTTP_400":
        return "Bad Request 400";
  
      case "HTTP_401":
        return "Unauthorized 401";
          
      case "HTTP_403":
        return "Forbidden 403"; 
            
      case "HTTP_404":
        return "Ressource not found 404";
          
      case "HTTP_409":
        return "Conflict 409";
  
      case "HTTP_500":
        return "Servor error 500";
  
      case "HTTP_OTHER":
          return "HTPP Error"
  
      case "OAUTH_TOKEN_EXCHANGE_FAILED":
        return "Error: Authentication failed. Please try again"
  
      case "OAUTH_INVALID_RESPONSE":
        return "Error: Invalid server response"
  
      case "UNKNOWN":
        return "Error: Unknown error. Please contact us."
  
      default:
        return "Unexpected error occurred";
    }
  }