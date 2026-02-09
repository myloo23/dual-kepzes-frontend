/**
 * Form-related type definitions
 */
import type {
  Company,
  Position,
  StudentProfile,
  CompanyAdminProfile,
  UniversityUserProfile,
  NewsItem,
} from "./api.types";

// ============= Form Data Types =============
export type CompanyFormData = Omit<Company, "id">;
export type PositionFormData = Omit<
  Position,
  "id" | "company" | "createdAt" | "updatedAt"
>;
export type StudentFormData = Partial<StudentProfile>;
export type CompanyAdminFormData = Partial<CompanyAdminProfile>;
export type UniversityUserFormData = Partial<UniversityUserProfile>;
export type NewsFormData = Omit<NewsItem, "id" | "createdAt" | "updatedAt">;

// ============= Form Validation Types =============
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: Record<keyof T, string>;
  isSubmitting: boolean;
  isDirty: boolean;
}

// ============= Form Event Types =============
export type FormChangeHandler<T> = (field: keyof T, value: unknown) => void;
export type FormSubmitHandler<T> = (data: T) => void | Promise<void>;
export type FormResetHandler = () => void;
