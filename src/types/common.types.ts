/**
 * Common type definitions used across the application
 */

export type Id = string | number;

export type ApiErrorBody = {
    message?: string;
    error?: string;
    errors?: Array<{ field?: string; message?: string }>;
};

export type ApiResponse<T> = {
    data: T;
    message?: string;
};
