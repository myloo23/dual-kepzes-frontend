/**
 * Generic CRUD hook
 * Provides reusable state management and operations for CRUD operations
 */

import { useState, useCallback } from 'react';
import type { Id } from '../types';

export interface UseCRUDOptions<T extends { id: Id }> {
    listFn: () => Promise<T[]>;
    getFn?: (id: Id) => Promise<T>;
    createFn?: (data: Omit<T, 'id'>) => Promise<T>;
    updateFn?: (id: Id, data: Partial<Omit<T, 'id'>>) => Promise<T>;
    deleteFn?: (id: Id) => Promise<void | { message?: string }>;
    onSuccess?: (message: string) => void;
    onError?: (error: Error) => void;
}

export interface UseCRUDReturn<T extends { id: Id }> {
    // State
    items: T[];
    loading: boolean;
    error: string | null;
    message: string | null;

    // Actions
    load: () => Promise<void>;
    get: (id: Id) => Promise<T | null>;
    create: (data: Omit<T, 'id'>) => Promise<T | null>;
    update: (id: Id, data: Partial<Omit<T, 'id'>>) => Promise<T | null>;
    remove: (id: Id) => Promise<boolean>;

    // State setters
    setError: (error: string | null) => void;
    setMessage: (message: string | null) => void;
    clearMessages: () => void;
}

export function useCRUD<T extends { id: Id }>(
    options: UseCRUDOptions<T>
): UseCRUDReturn<T> {
    const { listFn, getFn, createFn, updateFn, deleteFn, onSuccess, onError } = options;

    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const clearMessages = useCallback(() => {
        setError(null);
        setMessage(null);
    }, []);

    const handleError = useCallback(
        (err: unknown) => {
            const errorMessage = err instanceof Error ? err.message : 'Ismeretlen hiba történt.';
            setError(errorMessage);
            if (onError && err instanceof Error) {
                onError(err);
            }
        },
        [onError]
    );

    const handleSuccess = useCallback(
        (msg: string) => {
            setMessage(msg);
            if (onSuccess) {
                onSuccess(msg);
            }
        },
        [onSuccess]
    );

    const load = useCallback(async () => {
        setLoading(true);
        clearMessages();
        try {
            const data = await listFn();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            handleError(err);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [listFn, clearMessages, handleError]);

    const get = useCallback(
        async (id: Id): Promise<T | null> => {
            if (!getFn) {
                setError('Get operation not supported');
                return null;
            }

            setLoading(true);
            clearMessages();
            try {
                const item = await getFn(id);
                return item;
            } catch (err) {
                handleError(err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [getFn, clearMessages, handleError]
    );

    const create = useCallback(
        async (data: Omit<T, 'id'>): Promise<T | null> => {
            if (!createFn) {
                setError('Create operation not supported');
                return null;
            }

            setLoading(true);
            clearMessages();
            try {
                const newItem = await createFn(data);
                handleSuccess('Sikeresen létrehozva.');
                await load();
                return newItem;
            } catch (err) {
                handleError(err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [createFn, clearMessages, handleError, handleSuccess, load]
    );

    const update = useCallback(
        async (id: Id, data: Partial<Omit<T, 'id'>>): Promise<T | null> => {
            if (!updateFn) {
                setError('Update operation not supported');
                return null;
            }

            setLoading(true);
            clearMessages();
            try {
                const updatedItem = await updateFn(id, data);
                handleSuccess('Sikeresen frissítve.');
                await load();
                return updatedItem;
            } catch (err) {
                handleError(err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [updateFn, clearMessages, handleError, handleSuccess, load]
    );

    const remove = useCallback(
        async (id: Id): Promise<boolean> => {
            if (!deleteFn) {
                setError('Delete operation not supported');
                return false;
            }

            setLoading(true);
            clearMessages();
            try {
                await deleteFn(id);
                handleSuccess('Sikeresen törölve.');
                await load();
                return true;
            } catch (err) {
                handleError(err);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [deleteFn, clearMessages, handleError, handleSuccess, load]
    );

    return {
        // State
        items,
        loading,
        error,
        message,

        // Actions
        load,
        get,
        create,
        update,
        remove,

        // State setters
        setError,
        setMessage,
        clearMessages,
    };
}
