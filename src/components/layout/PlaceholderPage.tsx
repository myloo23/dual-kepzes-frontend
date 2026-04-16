export default function PlaceholderPage(props: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{props.title}</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {props.description ?? "Ez még csak sablon. Később ide kerül a funkció."}
      </p>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-700 dark:text-slate-300">
        ✅ Követelmény: menüpont megvan, oldal külön fülként kezelhető.
      </div>
    </div>
  );
}
