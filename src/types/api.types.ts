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

export interface PaginationQuery {
    page?: number;
    limit?: number;
    [key: string]: any;
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
    location: Location;
    highSchool: string;
    graduationYear: number;
    neptunCode?: string | null;
    currentMajor: string;
    studyMode: StudyMode;
    hasLanguageCert: boolean;
}

export interface CompanyEmployee {
    id: Id;
    jobTitle: string;
    company: {
        id: Id;
        name: string;
    };
}

export interface CompanyAdminProfile {
    id: Id;
    email: string;
    fullName: string;
    phoneNumber: string;
    role: 'COMPANY_ADMIN';
    isActive: boolean;
    companyEmployee: CompanyEmployee;
}

export interface EmployeeProfile {
    id: Id;
    userId?: Id;
    user?: {
        id: Id;
        fullName: string;
        email: string;
        role: string;
    };
    companyId?: Id; // Keep for now if used elsewhere, or investigate more if this also changes
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
    location: {
        country: string;
        zipCode: number;
        city: string;
        address: string;
    };
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
    student?: {
        id: string;
        email: string;
        fullName: string;
        phoneNumber: string;
        role: UserRole;
        studentProfile?: StudentProfile;
    } | null;
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

// ============= Partnership Types =============
export type PartnershipStatus = 'PENDING_MENTOR' | 'ACTIVE' | 'TERMINATED';

export interface Partnership {
    id: Id;
    semester?: string;
    contractNumber?: string;
    status: PartnershipStatus;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
    student?: {
        id: Id;
        email: string;
        fullName: string;
        studentProfile?: StudentProfile;
    };
    mentor?: EmployeeProfile | null;
    position?: {
        id: Id;
        title: string;
        companyId: Id;
        company: {
            name: string;
        };
    };
    uniEmployee?: UniversityUserProfile | null;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
