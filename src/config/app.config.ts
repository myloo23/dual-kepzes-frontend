/**
 * Application configuration
 */

// ============= API Configuration =============
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// ============= Auth Configuration =============
export const AUTH_CONFIG = {
  TOKEN_KEY: "token",
  LEGACY_TOKEN_KEY: "auth_token",
  SESSION_TIMEOUT: 3600000, // 1 hour in milliseconds
} as const;

// ============= Feature Flags =============
export const FEATURE_FLAGS = {
  ENABLE_GEOLOCATION: true,
  ENABLE_MAP_VIEW: true,
  ENABLE_ANALYTICS: false,
  ENABLE_DEBUG_MODE: import.meta.env.DEV,
} as const;

// ============= Environment =============
export const ENV = {
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
} as const;
