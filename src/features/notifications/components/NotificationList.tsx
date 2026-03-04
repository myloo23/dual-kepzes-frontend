import { Archive, Check, Trash2, ArrowRight } from "lucide-react";
import { cn } from "../../../utils/cn";
import type { NotificationItem } from "../../../types/notifications.types";
import { Link } from "react-router-dom";

interface NotificationListProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  ROLE_STUDENT: "Diák",
  ROLE_COMPANY_ADMIN: "Cég",
  ROLE_UNIVERSITY_USER: "Egyetem",
  ROLE_SYSTEM_ADMIN: "Rendszergazda",
};

const ROLE_COLORS: Record<string, string> = {
  ROLE_STUDENT:
    "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
  ROLE_COMPANY_ADMIN:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50",
  ROLE_UNIVERSITY_USER:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
  ROLE_SYSTEM_ADMIN:
    "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/50",
};

const TYPE_LABELS: Record<string, string> = {
  SYSTEM: "Rendszer",
  DATA_CHANGE: "Adat",
  APPLICATION: "Jelentkezés",
  POSITION: "Pozíció",
  PARTNERSHIP_PENDING_UNIVERSITY: "Új Partnerség",
  INFO: "Infó",
};

function getActionLink(notification: NotificationItem): string | null {
  if (notification.link) return notification.link;

  switch (notification.type) {
    case "PARTNERSHIP_PENDING_UNIVERSITY":
      return "/admin/partnerships";
    case "POSITION":
      return "/admin/positions";
    case "APPLICATION":
      // No dedicated admin apps page in strict sense usually, or it's under companies/positions
      // Linking to companies might be safer if we don't have app ID
      return "/admin/companies";
    case "DATA_CHANGE":
      // Could be anywhere. Default to null.
      return null;
    default:
      return null;
  }
}

export function NotificationList({
  notifications,
  onMarkRead,
  onArchive,
  onDelete,
  isLoading,
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 h-32 transition-colors"
          />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="mx-auto h-16 w-16 text-slate-200 dark:text-slate-700 mb-4 transition-colors">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 transition-colors">
          Nincs megjeleníthető értesítés
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">
          Jelenleg nincs az új üzeneted a kiválasztott szűrők alapján.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => {
        const isRead = notification.isRead || !!notification.readAt;
        const roleLabel = ROLE_LABELS[notification.senderRole || ""];
        const roleClass =
          ROLE_COLORS[notification.senderRole || ""] ||
          "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
        const typeLabel =
          TYPE_LABELS[notification.type || ""] || notification.type || "Egyéb";
        const actionLink = getActionLink(notification);

        return (
          <div
            key={notification.id}
            className={cn(
              "group relative bg-white dark:bg-slate-900 rounded-xl border p-5 transition-all hover:shadow-md",
              isRead
                ? "border-slate-200 dark:border-slate-800"
                : "border-blue-200 dark:border-blue-800/50 bg-blue-50/10 dark:bg-blue-900/10 shadow-sm",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  {roleLabel && (
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                        roleClass,
                      )}
                    >
                      {roleLabel}
                    </span>
                  )}
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 transition-colors">
                    {typeLabel}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors">
                    {notification.createdAt
                      ? new Date(notification.createdAt).toLocaleDateString(
                          "hu-HU",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : ""}
                  </span>
                  {!isRead && (
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse transition-colors" />
                  )}
                </div>

                <h4
                  className={cn(
                    "text-base font-semibold mb-1 transition-colors",
                    isRead
                      ? "text-slate-900 dark:text-slate-100"
                      : "text-blue-900 dark:text-blue-400",
                  )}
                >
                  {notification.title || "Értesítés"}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl transition-colors">
                  {notification.message || notification.body}
                </p>

                {actionLink && (
                  <Link
                    to={actionLink}
                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                  >
                    Művelet megtekintése
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isRead && (
                  <button
                    onClick={() => onMarkRead(String(notification.id))}
                    className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    title="Megjelölés olvasottként"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => onArchive(String(notification.id))}
                  className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Archiválás"
                >
                  <Archive className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(String(notification.id))}
                  className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  title="Törlés"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
