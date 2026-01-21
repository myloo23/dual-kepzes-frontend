/**
 * Toast notification hook
 * Provides toast notification functionality
 */

import { useState, useCallback } from 'react';
import { ANIMATION_DURATIONS } from '../constants/ui';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

export interface UseToastReturn {
    toasts: Toast[];
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    showSuccess: (message: string, duration?: number) => void;
    showError: (message: string, duration?: number) => void;
    showWarning: (message: string, duration?: number) => void;
    showInfo: (message: string, duration?: number) => void;
    removeToast: (id: string) => void;
    clearAll: () => void;
}

export function useToast(): UseToastReturn {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType = 'info', duration: number = ANIMATION_DURATIONS.TOAST) => {
            const id = `toast-${Date.now()}-${Math.random()}`;
            const toast: Toast = { id, type, message, duration };

            setToasts((prev) => [...prev, toast]);

            // Auto-remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }
        },
        [removeToast]
    );

    const showSuccess = useCallback(
        (message: string, duration?: number) => {
            showToast(message, 'success', duration);
        },
        [showToast]
    );

    const showError = useCallback(
        (message: string, duration?: number) => {
            showToast(message, 'error', duration);
        },
        [showToast]
    );

    const showWarning = useCallback(
        (message: string, duration?: number) => {
            showToast(message, 'warning', duration);
        },
        [showToast]
    );

    const showInfo = useCallback(
        (message: string, duration?: number) => {
            showToast(message, 'info', duration);
        },
        [showToast]
    );

    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    return {
        toasts,
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeToast,
        clearAll,
    };
}
