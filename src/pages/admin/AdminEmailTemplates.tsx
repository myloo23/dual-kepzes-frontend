import { useMemo, useState } from "react";
import Button from "../../components/ui/Button";

const STORAGE_KEY = "admin.student.invite.email.template.v1";

type TemplateModel = {
  templateName: string;
  subject: string;
  preheader: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  senderName: string;
};

const DEFAULT_TEMPLATE: TemplateModel = {
  templateName: "Diak regisztracios felkero",
  subject: "Csatlakozz a dualis kepzeshez - regisztralj most",
  preheader: "2 perc alatt kitoltheto jelentkezesi folyamat.",
  body: [
    "Kedves {{student_name}}!",
    "",
    "Szeretettel varunk a {{university_name}} dualis kepzesi programjaba.",
    "A regisztraciohoz kattints az alabbi gombra, es toltsd ki a rovid adatlapot.",
    "",
    "Hatarido: {{deadline}}",
    "",
    "Udvozlettel,",
    "{{sender_name}}",
  ].join("\n"),
  ctaLabel: "Regisztracio inditasa",
  ctaUrl: "https://example.hu/register",
  senderName: "Dualis Kepzesi Koordinacio",
};

const SAMPLE_VARS: Record<string, string> = {
  student_name: "Kiss Anna",
  university_name: "Neumann Janos Egyetem",
  deadline: "2026. majus 31.",
  sender_name: "Dualis Kepzesi Koordinacio",
};

const TOKENS = [
  "{{student_name}}",
  "{{university_name}}",
  "{{deadline}}",
  "{{sender_name}}",
];

function replaceVariables(
  text: string,
  vars: Record<string, string>,
  fallbackSender: string,
) {
  return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, key: string) => {
    if (key === "sender_name" && !vars.sender_name) {
      return fallbackSender;
    }
    return vars[key] ?? `{{${key}}}`;
  });
}

export default function AdminEmailTemplates() {
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState<TemplateModel>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_TEMPLATE;
      return { ...DEFAULT_TEMPLATE, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_TEMPLATE;
    }
  });

  const previewVars = useMemo(
    () => ({
      ...SAMPLE_VARS,
      sender_name: form.senderName || SAMPLE_VARS.sender_name,
    }),
    [form.senderName],
  );

  const renderedSubject = useMemo(
    () => replaceVariables(form.subject, previewVars, form.senderName),
    [form.subject, previewVars, form.senderName],
  );
  const renderedPreheader = useMemo(
    () => replaceVariables(form.preheader, previewVars, form.senderName),
    [form.preheader, previewVars, form.senderName],
  );
  const renderedBody = useMemo(
    () => replaceVariables(form.body, previewVars, form.senderName),
    [form.body, previewVars, form.senderName],
  );

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    const now = new Date().toLocaleString("hu-HU");
    setSavedAt(now);
    setMsg("Sablon elmentve (helyi tarolas).");
  };

  const handleReset = () => {
    setForm(DEFAULT_TEMPLATE);
    setMsg("Alapertelmezett sablon visszaallitva.");
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
          Email sablonok
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Diak regisztracios felkero email sablon szerkesztese es elonezete.
        </p>
      </header>

      {msg && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-400 transition-colors">
          {msg}
          {savedAt ? ` Utolso mentes: ${savedAt}.` : ""}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Sablon neve
            </label>
            <input
              value={form.templateName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, templateName: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Kuldo neve
            </label>
            <input
              value={form.senderName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, senderName: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Targy
          </label>
          <input
            value={form.subject}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, subject: e.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="mt-4 space-y-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Preheader
          </label>
          <input
            value={form.preheader}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, preheader: e.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="mt-4 space-y-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Uzenet torzs
          </label>
          <textarea
            rows={12}
            value={form.body}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, body: e.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              CTA gomb felirat
            </label>
            <input
              value={form.ctaLabel}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, ctaLabel: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              CTA URL
            </label>
            <input
              value={form.ctaUrl}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, ctaUrl: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={handleSave} variant="primary" size="sm">
            Sablon mentese
          </Button>
          <Button onClick={handleReset} variant="outline" size="sm">
            Visszaallitas
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[280px,minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Hasznalhato valtozok
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Ezeket a jeloloket barmelyik szovegmezoben hasznalhatod.
          </p>
          <ul className="mt-3 space-y-2">
            {TOKENS.map((token) => (
              <li
                key={token}
                className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-mono text-slate-700 dark:text-slate-200"
              >
                {token}
              </li>
            ))}
          </ul>
        </aside>

        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Elo email elonezet
          </h2>
          <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Targy
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {renderedSubject}
            </p>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Preheader
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {renderedPreheader}
            </p>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Torzs
            </p>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700 dark:text-slate-300">
              {renderedBody}
            </pre>

            <a
              href={form.ctaUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {form.ctaLabel}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

