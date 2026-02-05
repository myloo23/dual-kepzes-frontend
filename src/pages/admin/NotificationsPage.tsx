import { AdminNotifications } from '@/features/notifications';

export default function NotificationsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Értesítési központ</h1>
        <p className="mt-2 text-slate-500">
          Rendszerüzenetek és egyéb értesítések kezelése.
        </p>
      </div>

      <AdminNotifications />
    </div>
  );
}
