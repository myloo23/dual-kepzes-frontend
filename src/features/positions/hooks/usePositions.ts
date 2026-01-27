/**
 * Positions Hook
 * Manages position data fetching and application submission
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../lib/api';
import type { Position } from '../../../lib/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../constants';

export interface UsePositionsReturn {
    positions: Position[];
    loading: boolean;
    error: string | null;
    applicationSuccess: string | null;
    submitApplication: (positionId: string, note?: string) => Promise<void>;
    clearApplicationSuccess: () => void;
}

export function usePositions(): UsePositionsReturn {
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [applicationSuccess, setApplicationSuccess] = useState<string | null>(null);

    useEffect(() => {
        const loadPositions = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.positions.listPublic({ limit: 1000 });
                setPositions(Array.isArray(res) ? res : []);
            } catch (e) {
                console.error('Failed to load positions:', e);
                setError(ERROR_MESSAGES.FETCH_POSITIONS);
            } finally {
                setLoading(false);
            }
        };

        loadPositions();
    }, []);

    const submitApplication = useCallback(async (positionId: string, note?: string) => {
        try {
            await api.applications.submit({
                positionId,
                studentNote: note || undefined,
            });

            setApplicationSuccess(SUCCESS_MESSAGES.APPLICATION_SUBMITTED);

            // Clear success message after 5 seconds
            setTimeout(() => setApplicationSuccess(null), 5000);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC;
            throw new Error(errorMessage);
        }
    }, []);

    const clearApplicationSuccess = useCallback(() => {
        setApplicationSuccess(null);
    }, []);

    return {
        positions,
        loading,
        error,
        applicationSuccess,
        submitApplication,
        clearApplicationSuccess,
    };
}
