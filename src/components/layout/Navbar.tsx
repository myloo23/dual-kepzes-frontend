import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNotifications } from "../../features/notifications/hooks/useNotifications";
import { useAuth } from "../../features/auth";
import { useNavigation } from "../../hooks/useNavigation";
import type { NotificationItem } from "../../lib/api";
import logoImage from "../../assets/logos/dkk_logos/logó.png";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { news: newsLink, dashboard: dashboardLink } = useNavigation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsTab, setNotificationsTab] = useState<"active" | "archived">("active");
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const location = useLocation();
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated } = useAuth();
  
  // Use auth state directly
  const isLoggedIn = isAuthenticated;

  const {
    active,
    archived,
    unreadCount,
    loading: notificationsLoading,
    error: notificationsError,
    loadActive,
    loadArchived,
    refreshUnreadCount,
    getById,
    markRead,
    markAllRead,
    archive,
    unarchive,
    remove,
  } = useNotifications();

  useEffect(() => {
    if (!isLoggedIn) return;
    refreshUnreadCount();

    const interval = window.setInterval(() => {
      refreshUnreadCount();
    }, 60000);

    return () => window.clearInterval(interval);
  }, [isLoggedIn, refreshUnreadCount]);

  useEffect(() => {
    if (!notificationsOpen || !isLoggedIn) return;
    if (notificationsTab === "active") {
      loadActive();
    } else {
      loadArchived();
    }
  }, [notificationsOpen, notificationsTab, isLoggedIn, loadActive, loadArchived]);

  useEffect(() => {
    if (!notificationsOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [notificationsOpen]);

  const closeMobileMenu = () => setMobileOpen(false);

  const getLinkClass = (path: string) => {
    // Kezdőlap esetén pontos egyezés kell, különben mindenhol aktív lenne
    const isActive = path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

    const baseClass = "transition-colors duration-200";
    const activeClass = "text-dkk-blue font-semibold";
    const inactiveClass = "text-slate-600 hover:text-dkk-blue";

    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  // Mobil nézethez külön class generátor (nagyobb padding/margin)
  const getMobileLinkClass = (path: string) => {
    // Kezdőlap esetén pontos egyezés kell
    const isActive = path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

    const baseClass = "py-1 block transition-colors duration-200";
    const activeClass = "text-dkk-blue font-semibold";
    const inactiveClass = "text-slate-700 hover:text-dkk-blue";

    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  const notifications = notificationsTab === "active" ? active : archived;

  const getNotificationTitle = (item: NotificationItem) =>
    item.title || item.message || item.body || "Értesítés";

  const getNotificationPreview = (item: NotificationItem) =>
    item.message || item.body || item.title || "";

  const handleSelectNotification = async (id: string) => {
    setDetailsLoading(true);
    setActionError(null);
    try {
      const detail = await getById(id);
      setSelectedNotification(detail);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nem sikerült betölteni az értesítést.";
      setActionError(message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleAction = async (action: () => Promise<void>) => {
    setActionError(null);
    try {
      await action();
      if (notificationsTab === "active") {
        await loadActive();
      } else {
        await loadArchived();
      }
      await refreshUnreadCount();
      setSelectedNotification(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Az értesítési művelet sikertelen.";
      setActionError(message);
    }
  };

  useEffect(() => {
    setSelectedNotification(null);
    setActionError(null);
  }, [notificationsTab]);

  return (
    <header className="sticky top-0 z-[1100] border-b border-dkk-gray/30 bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center gap-4 px-4 lg:px-8 py-3">
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={closeMobileMenu}
        >
          <img
            src={logoImage}
            alt="Duális Képzési Központ"
            className="h-10 object-contain"
          />
        </Link>

        <div className="ml-auto flex items-center gap-3">
          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link to="/" className={getLinkClass("/")}>Kezdőlap</Link>

          {dashboardLink && (
            <Link to={dashboardLink} className={getLinkClass(dashboardLink)}>
              Irányítópult
            </Link>
          )}

          <Link to="/positions" className={getLinkClass("/positions")}>Elérhető állások</Link>

          {newsLink && (
            <Link to={newsLink} className={getLinkClass(newsLink)}>Hírek</Link>
          )}
          </nav>
          {isLoggedIn && (
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 sm:h-9 sm:w-9"
                aria-label="Értesítések"
                onClick={() => setNotificationsOpen((prev) => !prev)}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute left-1/2 mt-2 w-[90vw] max-w-sm -translate-x-1/2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg sm:left-auto sm:right-0 sm:translate-x-0 sm:w-80">
                  <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                    <span className="text-sm font-semibold text-slate-800">Értesítések</span>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        className="rounded px-2 py-1 text-slate-600 hover:bg-slate-100"
                        onClick={() => handleAction(markAllRead)}
                      >
                        Mind olvasottnak
                      </button>
                      <button
                        type="button"
                        className="rounded px-2 py-1 text-slate-600 hover:bg-slate-100"
                        onClick={() => refreshUnreadCount()}
                      >
                        Frissítés
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 text-xs">
                    <button
                      type="button"
                      className={`rounded px-2 py-1 ${notificationsTab === "active"
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                        }`}
                      onClick={() => setNotificationsTab("active")}
                    >
                      Aktív
                    </button>
                    <button
                      type="button"
                      className={`rounded px-2 py-1 ${notificationsTab === "archived"
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                        }`}
                      onClick={() => setNotificationsTab("archived")}
                    >
                      Archivált
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {notificationsLoading && (
                      <div className="px-3 py-4 text-xs text-slate-500">Értesítések betöltése...</div>
                    )}
                    {!notificationsLoading && notifications.length === 0 && (
                      <div className="px-3 py-4 text-xs text-slate-500">Nincs még értesítés.</div>
                    )}
                    {notifications.map((item) => {
                      const hasReadFlag = typeof item.isRead === "boolean";
                      const isUnread = hasReadFlag
                        ? !item.isRead
                        : !item.readAt && notificationsTab === "active";
                      return (
                        <div
                          key={item.id}
                          className="border-b border-slate-100 px-3 py-2 last:border-b-0"
                        >
                          <button
                            type="button"
                            className="w-full text-left"
                            onClick={() => handleSelectNotification(String(item.id))}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${isUnread ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                                {getNotificationTitle(item)}
                              </span>
                              {isUnread && (
                                <span className="h-2 w-2 rounded-full bg-blue-500" aria-label="Olvasatlan" />
                              )}
                            </div>
                            {getNotificationPreview(item) && (
                              <div className="mt-1 text-xs text-slate-500">
                                {getNotificationPreview(item)}
                              </div>
                            )}
                          </button>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                            {notificationsTab === "active" && (
                              <button
                                type="button"
                                className="rounded px-2 py-1 hover:bg-slate-100"
                                onClick={() => handleAction(() => markRead(String(item.id)))}
                              >
                                Olvasottnak
                              </button>
                            )}
                            {notificationsTab === "active" ? (
                              <button
                                type="button"
                                className="rounded px-2 py-1 hover:bg-slate-100"
                                onClick={() => handleAction(() => archive(String(item.id)))}
                              >
                                Archiválás
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="rounded px-2 py-1 hover:bg-slate-100"
                                onClick={() => handleAction(() => unarchive(String(item.id)))}
                              >
                                Visszaállítás
                              </button>
                            )}
                            <button
                              type="button"
                              className="rounded px-2 py-1 text-red-500 hover:bg-red-50"
                              onClick={() => handleAction(() => remove(String(item.id)))}
                            >
                              Törlés
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {(notificationsError || actionError) && (
                    <div className="border-t border-slate-100 px-3 py-2 text-xs text-red-500">
                      {actionError || notificationsError}
                    </div>
                  )}

                  {detailsLoading && (
                    <div className="border-t border-slate-100 px-3 py-2 text-xs text-slate-500">
                      Részletek betöltése...
                    </div>
                  )}

                  {selectedNotification && !detailsLoading && (
                    <div className="border-t border-slate-100 px-3 py-2 text-xs text-slate-600">
                      <div className="text-sm font-semibold text-slate-800">
                        {getNotificationTitle(selectedNotification)}
                      </div>
                      {getNotificationPreview(selectedNotification) && (
                        <div className="mt-1 text-xs text-slate-500">
                          {getNotificationPreview(selectedNotification)}
                        </div>
                      )}
                      {selectedNotification.link && (
                        <div className="mt-2">
                          <a
                            href={selectedNotification.link}
                            className="text-xs font-semibold text-dkk-blue hover:underline"
                          >
                            Hivatkozás megnyitása
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
        <button
          type="button"
          className="sm:hidden inline-flex items-center justify-center rounded-md border border-slate-300 px-2 py-1 text-slate-700 bg-white shadow-sm"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Menü megnyitása"
        >
          <div className="space-y-1">
            <span
              className={`block h-0.5 w-5 rounded bg-slate-700 transition-transform ${mobileOpen ? "translate-y-[5px] rotate-45" : ""
                }`}
            />
            <span
              className={`block h-0.5 w-5 rounded bg-slate-700 transition-opacity ${mobileOpen ? "opacity-0" : "opacity-100"
                }`}
            />
            <span
              className={`block h-0.5 w-5 rounded bg-slate-700 transition-transform ${mobileOpen ? "-translate-y-[5px] -rotate-45" : ""
                }`}
            />
          </div>
        </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <nav className="sm:hidden border-t border-dkk-gray/30 bg-white">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-3 flex flex-col items-end gap-2 text-right text-sm">
            <Link to="/" className={getMobileLinkClass("/")} onClick={closeMobileMenu}>Kezdőlap</Link>

            {dashboardLink && (
              <Link to={dashboardLink} className={getMobileLinkClass(dashboardLink)} onClick={closeMobileMenu}>
                Irányítópult
              </Link>
            )}

            <Link to="/positions" className={getMobileLinkClass("/positions")} onClick={closeMobileMenu}>Elérhető állások</Link>

            {newsLink && (
              <Link to={newsLink} className={getMobileLinkClass(newsLink)} onClick={closeMobileMenu}>Hírek</Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
