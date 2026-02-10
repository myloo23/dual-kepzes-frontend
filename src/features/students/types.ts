/**
 * Student Feature Types
 * Type definitions for student-related data structures
 */

export interface StudentMajor {
  id: string;
  name: string;
  language: string;
}

export interface StudentProfile {
  id: string;
  highSchool: string;
  graduationYear: number;
  major: StudentMajor;
  studyMode: string;
  hasLanguageCert: boolean;
  isInHighSchool: boolean;
  language: string;
  languageLevel: string;
  isAvailableForWork: boolean;
}

export interface AvailableStudent {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  studentProfile: StudentProfile;
}

export interface AvailableStudentsResponse {
  success: boolean;
  data: AvailableStudent[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
