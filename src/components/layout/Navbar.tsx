import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNotifications } from "../../features/notifications/hooks/useNotifications";
import { useAuth } from "../../features/auth";
import { useNavigation } from "../../hooks/useNavigation";
import type { NotificationItem } from "../../lib/api";
import logoImage from "../../assets/logos/dkk_logos/logó.png";
import { GlobalSearch } from "../../features/search";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { news: newsLink, dashboard: dashboardLink } = useNavigation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsTab, setNotificationsTab] = useState<
    "active" | "archived"
  >("active");
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const location = useLocation();
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, logout, user } = useAuth();

  // Use auth state directly
  const isLoggedIn = isAuthenticated;
  const isSystemAdmin = (user?.role as string) === "ROLE_SYSTEM_ADMIN";

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
  }, [
    notificationsOpen,
    notificationsTab,
    isLoggedIn,
    loadActive,
    loadArchived,
  ]);

  useEffect(() => {
    if (!notificationsOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
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
    const isActive =
      path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(path);

    // Apple-style: Clean, subtle transition, weight change
    const baseClass =
      "transition-all duration-300 text-[13px] tracking-wide font-medium";
    const activeClass = "text-slate-900";
    const inactiveClass = "text-slate-500 hover:text-slate-900";

    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  const getMobileLinkClass = (path: string) => {
    const isActive =
      path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(path);

    const baseClass =
      "py-3 block transition-colors duration-200 text-lg border-b border-gray-100 last:border-0";
    const activeClass = "text-dkk-blue font-semibold";
    const inactiveClass = "text-slate-600 hover:text-dkk-blue";

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
      const message =
        err instanceof Error
          ? err.message
          : "Nem sikerült betölteni az értesítést.";
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
      const message =
        err instanceof Error
          ? err.message
          : "Az értesítési művelet sikertelen.";
      setActionError(message);
    }
  };

  useEffect(() => {
    setSelectedNotification(null);
    setActionError(null);
  }, [notificationsTab]);

  return (
    <header className="sticky top-0 z-[1100] border-b border-slate-200/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto flex items-center gap-6 px-6 lg:px-8 h-16">
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0 group"
          onClick={closeMobileMenu}
        >
          <img
            src={logoImage}
            alt="Duális Képzési Központ"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop nav - Centered Global Search */}
        <div className="flex-1 max-w-sm hidden sm:block">
          <GlobalSearch />
        </div>

        <div className="flex items-center gap-6 ml-auto">
          {/* Desktop nav links */}
          <nav className="hidden sm:flex items-center gap-8">
            <Link to="/" className={getLinkClass("/")}>
              Kezdőlap
            </Link>
            {dashboardLink && (
              <Link to={dashboardLink} className={getLinkClass(dashboardLink)}>
                Irányítópult
              </Link>
            )}

            <Link to="/positions" className={getLinkClass("/positions")}>
              Állásajánlatok
            </Link>

            {newsLink && (
              <Link to={newsLink} className={getLinkClass(newsLink)}>
                Hírek
              </Link>
            )}

            {isLoggedIn && (
              <button
                onClick={logout}
                className="text-[13px] tracking-wide font-medium text-slate-500 hover:text-red-600 transition-colors duration-300"
              >
                Kijelentkezés
              </button>
            )}
          </nav>

          {isLoggedIn && !isSystemAdmin && (
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 transition-all duration-200 focus:outline-none"
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
                  <span className="absolute right-1 top-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-4 w-80 sm:w-96 origin-top-right rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-slate-900/5 focus:outline-none overflow-hidden animate-scale-in">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/50">
                    <span className="text-sm font-semibold text-slate-900">
                      Értesítések
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200/50 transition-colors"
                        onClick={() => handleAction(markAllRead)}
                      >
                        Mind olvasott
                      </button>
                      <button
                        type="button"
                        className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200/50 transition-colors"
                        onClick={() => refreshUnreadCount()}
                      >
                        Frissítés
                      </button>
                    </div>
                  </div>

                  <div className="p-1.5 flex gap-1 bg-slate-50/50 border-b border-slate-100">
                    <button
                      type="button"
                      className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        notificationsTab === "active"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/30"
                      }`}
                      onClick={() => setNotificationsTab("active")}
                    >
                      Aktív
                    </button>
                    <button
                      type="button"
                      className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        notificationsTab === "archived"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/30"
                      }`}
                      onClick={() => setNotificationsTab("archived")}
                    >
                      Archivált
                    </button>
                  </div>

                  <div className="max-h-[28rem] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                    {notificationsLoading && (
                      <div className="p-8 text-center text-xs text-slate-500">
                        Betöltés...
                      </div>
                    )}
                    {!notificationsLoading && notifications.length === 0 && (
                      <div className="p-12 text-center">
                        <div className="mx-auto mb-3 h-10 w-10 text-slate-300">
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
                            />
                          </svg>
                        </div>
                        <p className="text-xs text-slate-500">
                          Nincs megjeleníthető értesítés.
                        </p>
                      </div>
                    )}
                    {notifications.map((item) => {
                      const hasReadFlag = typeof item.isRead === "boolean";
                      const isUnread = hasReadFlag
                        ? !item.isRead
                        : !item.readAt && notificationsTab === "active";
                      return (
                        <div
                          key={item.id}
                          className={`group relative border-b border-slate-50 p-4 transition-colors last:border-b-0 hover:bg-slate-50/80 ${
                            isUnread ? "bg-blue-50/30" : ""
                          }`}
                        >
                          <button
                            type="button"
                            className="w-full text-left"
                            onClick={() =>
                              handleSelectNotification(String(item.id))
                            }
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-1 space-y-1">
                                <p
                                  className={`text-sm leading-tight ${isUnread ? "font-semibold text-slate-900" : "text-slate-700"}`}
                                >
                                  {getNotificationTitle(item)}
                                </p>
                                {getNotificationPreview(item) && (
                                  <p className="line-clamp-2 text-xs text-slate-500">
                                    {getNotificationPreview(item)}
                                  </p>
                                )}
                              </div>
                              {isUnread && (
                                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                              )}
                            </div>
                          </button>

                          {/* Actions appear on hover */}
                          <div className="mt-3 flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            {notificationsTab === "active" ? (
                              <>
                                <button
                                  type="button"
                                  className="text-[10px] font-medium text-slate-400 hover:text-slate-700 uppercase tracking-wider"
                                  onClick={() =>
                                    handleAction(() =>
                                      markRead(String(item.id)),
                                    )
                                  }
                                >
                                  Olvasott
                                </button>
                                <button
                                  type="button"
                                  className="text-[10px] font-medium text-slate-400 hover:text-slate-700 uppercase tracking-wider"
                                  onClick={() =>
                                    handleAction(() => archive(String(item.id)))
                                  }
                                >
                                  Archivál
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="text-[10px] font-medium text-slate-400 hover:text-slate-700 uppercase tracking-wider"
                                onClick={() =>
                                  handleAction(() => unarchive(String(item.id)))
                                }
                              >
                                Visszaállít
                              </button>
                            )}
                            <button
                              type="button"
                              className="text-[10px] font-medium text-red-300 hover:text-red-500 uppercase tracking-wider"
                              onClick={() =>
                                handleAction(() => remove(String(item.id)))
                              }
                            >
                              Törlés
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {(notificationsError || actionError) && (
                    <div className="bg-red-50 px-4 py-2 text-xs text-red-600">
                      {actionError || notificationsError}
                    </div>
                  )}

                  {detailsLoading && (
                    <div className="bg-slate-50 px-4 py-2 text-center text-xs text-slate-500">
                      Részletek betöltése...
                    </div>
                  )}

                  {selectedNotification && !detailsLoading && (
                    <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3">
                      <h4 className="text-sm font-semibold text-slate-900 mb-1">
                        {getNotificationTitle(selectedNotification)}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {getNotificationPreview(selectedNotification)}
                      </p>
                      {selectedNotification.link && (
                        <a
                          href={selectedNotification.link}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          Hivatkozás megnyitása
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
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
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Menü megnyitása"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? "translate-y-[8px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? "-translate-y-[8px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <nav className="sm:hidden absolute top-full left-0 right-0 border-b border-gray-200 bg-white/95 backdrop-blur-xl animate-fade-in shadow-xl h-screen">
          <div className="px-6 py-6 flex flex-col gap-2">
            <Link
              to="/"
              className={getMobileLinkClass("/")}
              onClick={closeMobileMenu}
            >
              Kezdőlap
            </Link>

            {dashboardLink && (
              <Link
                to={dashboardLink}
                className={getMobileLinkClass(dashboardLink)}
                onClick={closeMobileMenu}
              >
                Irányítópult
              </Link>
            )}

            <Link
              to="/positions"
              className={getMobileLinkClass("/positions")}
              onClick={closeMobileMenu}
            >
              Állásajánlatok
            </Link>

            {newsLink && (
              <Link
                to={newsLink}
                className={getMobileLinkClass(newsLink)}
                onClick={closeMobileMenu}
              >
                Hírek
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
