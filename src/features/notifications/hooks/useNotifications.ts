import { useCallback, useState } from 'react';
import { api } from '../../../lib/api';
import type {
  NotificationCreatePayload,
  NotificationDetails,
  NotificationItem,
} from '../../../lib/api';

export interface UseNotificationsReturn {
  active: NotificationItem[];
  archived: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  loadActive: () => Promise<void>;
  loadArchived: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  getById: (id: string) => Promise<NotificationDetails>;
  create: (payload: NotificationCreatePayload) => Promise<NotificationItem>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  archive: (id: string) => Promise<void>;
  unarchive: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [active, setActive] = useState<NotificationItem[]>([]);
  const [archived, setArchived] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActive = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.notifications.listActive();
      setActive(Array.isArray(res) ? res : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nem sikerĂĽlt betĂ¶lteni az Ă©rtesĂ­tĂ©seket.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadArchived = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.notifications.listArchived();
      setArchived(Array.isArray(res) ? res : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nem sikerĂĽlt betĂ¶lteni az archivĂˇlt Ă©rtesĂ­tĂ©seket.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const res = await api.notifications.unreadCount();
      const count =
        typeof res === 'number'
          ? res
          : res?.count ?? (res as { unreadNotificationsCount?: number })?.unreadNotificationsCount ?? 0;
      setUnreadCount(count);
    } catch (err) {
      // Don't set global error for background polling, just warn in console
      console.warn('Failed to refresh unread notifications count:', err);
    }
  }, []);

  const getById = useCallback(async (id: string) => {
    return api.notifications.get(id);
  }, []);

  const create = useCallback(async (payload: NotificationCreatePayload) => {
    return api.notifications.create(payload);
  }, []);

  const markRead = useCallback(async (id: string) => {
    await api.notifications.markRead(id);
  }, []);

  const markAllRead = useCallback(async () => {
    await api.notifications.readAll();
  }, []);

  const archive = useCallback(async (id: string) => {
    await api.notifications.archive(id);
  }, []);

  const unarchive = useCallback(async (id: string) => {
    await api.notifications.unarchive(id);
  }, []);

  const remove = useCallback(async (id: string) => {
    await api.notifications.remove(id);
  }, []);

  return {
    active,
    archived,
    unreadCount,
    loading,
    error,
    loadActive,
    loadArchived,
    refreshUnreadCount,
    getById,
    create,
    markRead,
    markAllRead,
    archive,
    unarchive,
    remove,
  };
}
