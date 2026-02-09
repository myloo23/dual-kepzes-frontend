/**
 * Common type definitions used across the application
 */

export type Id = string | number;

export type ApiErrorBody = {
  success?: boolean;
  message?: string;
  error?:
    | string
    | {
        code?: string;
        message?: string;
        details?: any;
      };
  errors?: Array<{ field?: string; message?: string }>;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
};
