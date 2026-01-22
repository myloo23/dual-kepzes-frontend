/**
 * API-related type definitions
 * Properly typed interfaces for all API entities
 */

import type { Id } from './common.types';
export type { Id };

// ============= Location Types =============
export interface Location {
    id?: Id;
    country?: string;
    zipCode: string | number;
    city: string;
    address: string;
}

// ============= Company Types =============
export interface Company {
    id: Id;
    name: string;
    taxId: string;
    locations: Location[];
    contactName: string;
    contactEmail: string;
    description?: string;
    logoUrl?: string | null;
    website?: string | null;
}

// ============= Tag Types =============
export interface Tag {
    name: string;
    category?: string;
}

// ============= Position Types =============
export interface Position {
    id: Id;
    companyId: string;
    title: string;
    description: string;
    location: Location;
    deadline: string; // ISO 8601 format
    isDual?: boolean;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    tags: Tag[];
    company?: {
        name: string;
        logoUrl?: string | null;
        locations: Location[];
    };
}

// ============= User Types =============
export type UserRole =
    | 'STUDENT'
    | 'COMPANY_ADMIN'
    | 'UNIVERSITY_USER'
    | 'SYSTEM_ADMIN'
    | 'TEACHER'
    | 'MENTOR';

export type StudyMode = 'NAPPALI' | 'LEVELEZŐ';

export interface StudentProfile {
    id: Id;
    userId: Id;
    fullName: string;
    email: string;
    phoneNumber: string;
    mothersName: string;
    dateOfBirth: string; // YYYY-MM-DD
    country: string;
    zipCode: number;
    city: string;
    streetAddress: string;
    highSchool: string;
    graduationYear: number;
    neptunCode?: string | null;
    currentMajor: string;
    studyMode: StudyMode;
    hasLanguageCert: boolean;
}

export interface CompanyAdminProfile {
    id: Id;
    userId: Id;
    companyId: Id;
    fullName?: string;
    email?: string;
}

export interface EmployeeProfile {
    id: Id;
    userId?: Id;
    companyId?: Id;
    fullName?: string | null;
    email?: string | null;
    role?: string | null;
}

export interface UniversityUserProfile {
    id: Id;
    userId: Id;
    fullName?: string;
    email?: string;
    department?: string;
}

export interface SystemAdminProfile {
    id: Id;
    userId: Id;
    name?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
}

export interface User {
    id: Id;
    email: string;
    role: UserRole;
    isActive: boolean;
    deletedAt?: string | null;
    student?: StudentProfile | null;
    companyAdmin?: CompanyAdminProfile | null;
    universityUser?: UniversityUserProfile | null;
}

// ============= Auth Types =============
export interface LoginResponse {
    message: string;
    token: string;
    user: {
        id: Id;
        email: string;
        role: UserRole;
    };
}

export interface RegisterResponse {
    message: string;
    userId?: Id;
    role?: UserRole;
}

export interface StudentRegisterPayload {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    role: 'STUDENT';
    mothersName: string;
    dateOfBirth: string;
    country: string;
    zipCode: number;
    city: string;
    streetAddress: string;
    highSchool: string;
    graduationYear: number;
    neptunCode?: string | null;
    currentMajor: string;
    studyMode: StudyMode;
    hasLanguageCert: boolean;
}

// ============= News Types =============
export type NewsTargetGroup = 'STUDENT' | 'ALL';

export interface NewsItem {
    id: Id;
    title: string;
    content: string;
    tags: string[];
    targetGroup: NewsTargetGroup;
    important?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface NewsCreatePayload {
    title: string;
    content: string;
    tags: string[];
    targetGroup: NewsTargetGroup;
    important?: boolean;
}

// ============= Application Types =============
export type ApplicationStatus = 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'NO_RESPONSE';

export interface Application {
    id: string;
    positionId: string;
    studentId: string;
    status: ApplicationStatus;
    studentNote?: string;
    companyNote?: string;
    createdAt: string;
    position?: {
        id: string;
        title: string;
        company: {
            name: string;
            logoUrl?: string | null;
        };
    };
    student?: StudentProfile | null;
}

export interface ApplicationCreatePayload {
    positionId: string;
    studentNote?: string;
}

// ============= Stats Types =============
export interface UsersByRole {
    role: UserRole;
    count: number;
}

export interface StatsResponse {
    totals: {
        users: number;
        companies: number;
        positions: number;
        applications: number;
        activePartnerships: number;
    };
    usersByRole: UsersByRole[];
}
