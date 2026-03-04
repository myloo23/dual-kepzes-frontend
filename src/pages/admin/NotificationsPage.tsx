import { AdminNotifications } from "@/features/notifications";

export default function NotificationsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight transition-colors">
          Értesítési központ
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 transition-colors">
          Rendszerüzenetek és egyéb értesítések kezelése.
        </p>
      </div>

      <AdminNotifications />
    </div>
  );
}
