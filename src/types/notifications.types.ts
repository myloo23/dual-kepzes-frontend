import type { Id } from './common.types';

export interface NotificationItem {
  id: Id;
  title?: string;
  message?: string;
  body?: string;
  type?: string;
  link?: string | null;
  createdAt?: string;
  updatedAt?: string;
  readAt?: string | null;
  isRead?: boolean;
  archivedAt?: string | null;
  isArchived?: boolean;
}

export type NotificationDetails = NotificationItem;

export interface NotificationUnreadCount {
  count: number;
}

export type NotificationCreatePayload = Record<string, unknown>;
