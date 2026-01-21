/**
 * User Management Hook
 * Business logic for managing users across different roles
 */

import { useState, useCallback, useEffect } from 'react';
import { api } from '../../../lib/api';
import type {
    StudentProfile,
    CompanyAdminProfile,
    UniversityUserProfile,
    User,
    Id
} from '../../../types';
import type { TabType } from '../../../types/ui.types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../constants';

type UserItem = StudentProfile | CompanyAdminProfile | UniversityUserProfile | User;

export interface UseUserManagementReturn {
    // State
    activeTab: TabType;
    items: UserItem[];
    loading: boolean;
    error: string | null;
    message: string | null;

    // Actions
    setActiveTab: (tab: TabType) => void;
    load: () => Promise<void>;
    getById: (id: Id) => Promise<UserItem | null>;
    deleteUser: (id: Id) => Promise<boolean>;
    reactivateUser: (id: Id) => Promise<boolean>;
    updateStudent: (id: Id, data: Partial<StudentProfile>) => Promise<boolean>;
    updateGeneric: (id: Id, data: Partial<CompanyAdminProfile | UniversityUserProfile>) => Promise<boolean>;

    // Utilities
    setError: (error: string | null) => void;
    setMessage: (message: string | null) => void;
    clearMessages: () => void;
}

export function useUserManagement(initialTab: TabType = 'STUDENT'): UseUserManagementReturn {
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);
    const [items, setItems] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const clearMessages = useCallback(() => {
        setError(null);
        setMessage(null);
    }, []);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        setItems([]);

        try {
            let res: UserItem[] = [];

            switch (activeTab) {
                case 'STUDENT':
                    res = await api.students.list();
                    break;
                case 'COMPANY_ADMIN':
                    res = await api.companyAdmins.list();
                    break;
                case 'UNIVERSITY_USER':
                    res = await api.universityUsers.list();
                    break;
                case 'INACTIVE_USER':
                    res = await api.users.listInactive();
                    break;
            }

            setItems(Array.isArray(res) ? res : []);
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : ERROR_MESSAGES.FETCH_USERS;
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    // Load data when tab changes
    useEffect(() => {
        load();
    }, [load]);

    const getById = useCallback(async (id: Id): Promise<UserItem | null> => {
        if (!id) return null;

        setLoading(true);
        setError(null);

        try {
            let item: UserItem | null = null;

            switch (activeTab) {
                case 'STUDENT':
                    item = await api.students.get(id);
                    break;
                case 'COMPANY_ADMIN':
                    item = await api.companyAdmins.get(id);
                    break;
                case 'UNIVERSITY_USER':
                    item = await api.universityUsers.get(id);
                    break;
                default:
                    setError(ERROR_MESSAGES.SEARCH_NOT_SUPPORTED);
                    return null;
            }

            setMessage(SUCCESS_MESSAGES.ITEM_LOADED);
            return item;
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : ERROR_MESSAGES.USER_NOT_FOUND;
            setError(errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    const deleteUser = useCallback(async (id: Id): Promise<boolean> => {
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            switch (activeTab) {
                case 'STUDENT':
                    await api.students.remove(id);
                    break;
                case 'COMPANY_ADMIN':
                    await api.companyAdmins.remove(id);
                    break;
                case 'UNIVERSITY_USER':
                    await api.universityUsers.remove(id);
                    break;
                case 'INACTIVE_USER':
                    setError(ERROR_MESSAGES.INACTIVE_USER_DELETE);
                    return false;
            }

            setMessage(SUCCESS_MESSAGES.USER_DELETED);
            await load();
            return true;
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : ERROR_MESSAGES.DELETE_FAILED;
            setError(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    }, [activeTab, load]);

    const reactivateUser = useCallback(async (id: Id): Promise<boolean> => {
        if (activeTab !== 'INACTIVE_USER') return false;

        setLoading(true);

        try {
            await api.users.reactivate(id);
            setMessage(SUCCESS_MESSAGES.USER_REACTIVATED);
            await load();
            return true;
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : ERROR_MESSAGES.GENERIC;
            setError(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    }, [activeTab, load]);

    const updateStudent = useCallback(async (
        id: Id,
        data: Partial<StudentProfile>
    ): Promise<boolean> => {
        try {
            await api.students.update(id, data);
            setMessage(SUCCESS_MESSAGES.STUDENT_UPDATED);
            await load();
            return true;
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : ERROR_MESSAGES.UPDATE_FAILED;
            setError(errorMsg);
            return false;
        }
    }, [load]);

    const updateGeneric = useCallback(async (
        id: Id,
        data: Partial<CompanyAdminProfile | UniversityUserProfile>
    ): Promise<boolean> => {
        try {
            if (activeTab === 'COMPANY_ADMIN') {
                await api.companyAdmins.update(id, data as Partial<CompanyAdminProfile>);
            } else if (activeTab === 'UNIVERSITY_USER') {
                await api.universityUsers.update(id, data as Partial<UniversityUserProfile>);
            } else if (activeTab === 'INACTIVE_USER') {
                setError(ERROR_MESSAGES.INACTIVE_USER_EDIT);
                return false;
            }

            setMessage(SUCCESS_MESSAGES.DATA_SAVED);
            await load();
            return true;
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : ERROR_MESSAGES.UPDATE_FAILED;
            setError(errorMsg);
            return false;
        }
    }, [activeTab, load]);

    return {
        // State
        activeTab,
        items,
        loading,
        error,
        message,

        // Actions
        setActiveTab,
        load,
        getById,
        deleteUser,
        reactivateUser,
        updateStudent,
        updateGeneric,

        // Utilities
        setError,
        setMessage,
        clearMessages,
    };
}
