import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { IApiError } from "@ava-poc/types";

/**
 * Base Axios instance configuration
 * Centralizes all API communication with consistent settings and global error handling
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor for global error handling
 * - Standardizes error responses
 * - Logs errors for debugging
 * - Does not expose sensitive backend information to the user
 * - Authentication/authorization errors should be handled by the back-end
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    let apiError: IApiError;

    // Check if error is an AxiosError
    if (error instanceof AxiosError) {
      apiError = {
        message: error.response?.data?.message || error.message || "An unexpected error occurred",
        status: error.response?.status,
        statusText: error.response?.statusText,
        timestamp: new Date().toISOString(),
      };
    } else if (error instanceof Error) {
      // Handle generic Error objects
      apiError = {
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    } else {
      // Handle unknown error types
      apiError = {
        message: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      };
    }

    // Log error for debugging (in production, this could be sent to a logging service)
    console.error("[API Error]", apiError);

    // Return rejected promise with standardized error object
    return Promise.reject(apiError);
  },
);

/**
 * Request interceptor for future enhancements
 * Can be used to add authorization headers, request tracking, etc.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Example: Add custom headers if needed
    // const token = getAuthToken(); // This should come from a secure context
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { apiClient };
