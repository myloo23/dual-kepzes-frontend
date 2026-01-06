export default function PlaceholderPage(props: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold text-slate-900">{props.title}</h1>
      <p className="text-sm text-slate-600">
        {props.description ?? "Ez még csak sablon. Később ide kerül a funkció."}
      </p>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        ✅ Követelmény: menüpont megvan, oldal külön fülként kezelhető.
      </div>
    </div>
  );
}
