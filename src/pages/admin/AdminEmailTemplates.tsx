import { useMemo, useState } from "react";
import Button from "../../components/ui/Button";

type TemplateModel = {
  templateName: string;
  subject: string;
  preheader: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  senderName: string;
  senderEmail: string;
  replyTo: string;
};

type TemplateType = "company_registration_invite" | "student_registration_invite";

type TemplateDefinition = {
  id: TemplateType;
  label: string;
  description: string;
  defaultTemplate: TemplateModel;
  sampleValues: Record<string, string>;
  tokens: string[];
};

const TEMPLATE_DEFINITIONS: Record<TemplateType, TemplateDefinition> = {
  company_registration_invite: {
    id: "company_registration_invite",
    label: "Céges regisztrációs felkérő email",
    description:
      "Kész állapotban tarthatod az admin felületről küldhető partnercéges meghívó szöveget.",
    defaultTemplate: {
      templateName: "Céges regisztrációs felkérő",
      subject:
        "{{company_name}} - csatlakozzon a {{university_name}} duális partneri hálózatához",
      preheader:
        "Gyors, 5 perces regisztráció a partnercégek számára a következő szemeszterre.",
      body: [
        "Tisztelt {{contact_name}}!",
        "",
        "Örülünk, hogy a {{company_name}} érdeklődik a {{university_name}} duális képzési programja iránt.",
        "A partnercéges regisztrációhoz kattintson az alábbi gombra, majd töltse ki a rövid adatlapot.",
        "",
        "Regisztrációs határidő: {{deadline}}",
        "",
        "Kérdés esetén az alábbi elérhetőségen állunk rendelkezésre:",
        "{{sender_email}}",
        "",
        "Üdvözlettel,",
        "{{sender_name}}",
      ].join("\n"),
      ctaLabel: "Regisztráció indítása",
      ctaUrl: "https://example.hu/register-company-partner",
      senderName: "Duális Képzési Koordináció",
      senderEmail: "dual@egyetem.hu",
      replyTo: "dual@egyetem.hu",
    },
    sampleValues: {
      company_name: "Mintaceg Kft.",
      contact_name: "Nagy Petra",
      university_name: "Neumann János Egyetem",
      deadline: "2026. június 15.",
      sender_name: "Duális Képzési Koordináció",
      sender_email: "dual@egyetem.hu",
    },
    tokens: [
      "{{company_name}}",
      "{{contact_name}}",
      "{{university_name}}",
      "{{deadline}}",
      "{{sender_name}}",
      "{{sender_email}}",
    ],
  },
  student_registration_invite: {
    id: "student_registration_invite",
    label: "Diák regisztrációs felkérő email",
    description:
      "Szerkeszthető diákoknak küldött felkérő sablon, az admin meghívási folyamat támogatására.",
    defaultTemplate: {
      templateName: "Diák regisztrációs felkérő",
      subject: "Csatlakozz a duális képzéshez - regisztrálj most",
      preheader: "2 perc alatt kitölthető jelentkezési folyamat.",
      body: [
        "Kedves {{student_name}}!",
        "",
        "Szeretettel várunk a {{university_name}} duális képzési programjába.",
        "A regisztrációhoz kattints az alábbi gombra, és töltsd ki a rövid adatlapot.",
        "",
        "Határidő: {{deadline}}",
        "",
        "Üdvözlettel,",
        "{{sender_name}}",
      ].join("\n"),
      ctaLabel: "Regisztráció indítása",
      ctaUrl: "https://example.hu/register",
      senderName: "Duális Képzési Koordináció",
      senderEmail: "dual@egyetem.hu",
      replyTo: "dual@egyetem.hu",
    },
    sampleValues: {
      student_name: "Kiss Anna",
      university_name: "Neumann János Egyetem",
      deadline: "2026. június 15.",
      sender_name: "Duális Képzési Koordináció",
      sender_email: "dual@egyetem.hu",
    },
    tokens: [
      "{{student_name}}",
      "{{university_name}}",
      "{{deadline}}",
      "{{sender_name}}",
      "{{sender_email}}",
    ],
  },
};

const TEMPLATE_TYPES = Object.keys(TEMPLATE_DEFINITIONS) as TemplateType[];
const DEFAULT_TYPE: TemplateType = "company_registration_invite";

function getStorageKey(type: TemplateType) {
  return `admin.email.template.${type}.v1`;
}

function loadTemplate(type: TemplateType): TemplateModel {
  const definition = TEMPLATE_DEFINITIONS[type];
  try {
    const raw = localStorage.getItem(getStorageKey(type));
    if (!raw) return definition.defaultTemplate;
    return { ...definition.defaultTemplate, ...JSON.parse(raw) };
  } catch {
    return definition.defaultTemplate;
  }
}

function replaceVariables(
  text: string,
  values: Record<string, string>,
  fallback: Pick<TemplateModel, "senderName" | "senderEmail">,
) {
  return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key: string) => {
    if (key === "sender_name") return values.sender_name || fallback.senderName;
    if (key === "sender_email") return values.sender_email || fallback.senderEmail;
    return values[key] ?? `{{${key}}}`;
  });
}

export default function AdminEmailTemplates() {
  const [selectedType, setSelectedType] = useState<TemplateType>(DEFAULT_TYPE);
  const [message, setMessage] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [formsByType, setFormsByType] = useState<Record<TemplateType, TemplateModel>>(() => ({
    company_registration_invite: loadTemplate("company_registration_invite"),
    student_registration_invite: loadTemplate("student_registration_invite"),
  }));

  const activeDefinition = TEMPLATE_DEFINITIONS[selectedType];
  const form = formsByType[selectedType];

  const updateForm = (
    updater: (current: TemplateModel) => TemplateModel,
  ) => {
    setFormsByType((prev) => ({
      ...prev,
      [selectedType]: updater(prev[selectedType]),
    }));
  };

  const previewValues = useMemo(
    () => ({
      ...activeDefinition.sampleValues,
      sender_name: form.senderName || activeDefinition.sampleValues.sender_name,
      sender_email: form.senderEmail || activeDefinition.sampleValues.sender_email,
    }),
    [activeDefinition.sampleValues, form.senderName, form.senderEmail],
  );

  const renderedSubject = useMemo(
    () =>
      replaceVariables(form.subject, previewValues, {
        senderName: form.senderName,
        senderEmail: form.senderEmail,
      }),
    [form.subject, previewValues, form.senderName, form.senderEmail],
  );

  const renderedPreheader = useMemo(
    () =>
      replaceVariables(form.preheader, previewValues, {
        senderName: form.senderName,
        senderEmail: form.senderEmail,
      }),
    [form.preheader, previewValues, form.senderName, form.senderEmail],
  );

  const renderedBody = useMemo(
    () =>
      replaceVariables(form.body, previewValues, {
        senderName: form.senderName,
        senderEmail: form.senderEmail,
      }),
    [form.body, previewValues, form.senderName, form.senderEmail],
  );

  const handleTemplateChange = (type: TemplateType) => {
    setSelectedType(type);
    setMessage(null);
    setSavedAt(null);
  };

  const handleSave = () => {
    localStorage.setItem(getStorageKey(selectedType), JSON.stringify(form));
    setSavedAt(new Date().toLocaleString("hu-HU"));
    setMessage(`"${activeDefinition.label}" elmentve (helyi tárolás).`);
  };

  const handleReset = () => {
    updateForm(() => activeDefinition.defaultTemplate);
    setMessage(`"${activeDefinition.label}" alapértelmezettje visszaállítva.`);
  };

  const insertTokenToBody = (token: string) => {
    updateForm((prev) => ({
      ...prev,
      body: `${prev.body}${prev.body ? "\n" : ""}${token}`,
    }));
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
          Email sablonkezelő
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
          Céges és diák regisztrációs felkérő emailek szerkesztése és kezelése.
        </p>
      </header>

      {message && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300 transition-colors">
          {message}
          {savedAt ? ` Utolsó mentés: ${savedAt}.` : ""}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
        <div className="mb-4 rounded-xl border border-blue-200 dark:border-blue-500/40 bg-blue-50 dark:bg-slate-800 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-200">
            Sablon típusa
          </p>

          <div className="mt-2">
            <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
              Kiválasztott sablon
            </label>
            <select
              value={selectedType}
              onChange={(event) => handleTemplateChange(event.target.value as TemplateType)}
              className="w-full rounded-lg border border-blue-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              {TEMPLATE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {TEMPLATE_DEFINITIONS[type].label}
                </option>
              ))}
            </select>
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {activeDefinition.label}
          </p>
          <p className="mt-1 text-xs text-slate-700 dark:text-slate-200">
            {activeDefinition.description}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Sablon neve
            </label>
            <input
              value={form.templateName}
              onChange={(event) =>
                updateForm((prev) => ({ ...prev, templateName: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Küldő neve
            </label>
            <input
              value={form.senderName}
              onChange={(event) =>
                updateForm((prev) => ({ ...prev, senderName: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Küldő email
            </label>
            <input
              value={form.senderEmail}
              onChange={(event) =>
                updateForm((prev) => ({ ...prev, senderEmail: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Reply-To
            </label>
            <input
              value={form.replyTo}
              onChange={(event) =>
                updateForm((prev) => ({ ...prev, replyTo: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-4 space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Tárgy
            </label>
          <input
            value={form.subject}
            onChange={(event) =>
              updateForm((prev) => ({ ...prev, subject: event.target.value }))
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
            onChange={(event) =>
              updateForm((prev) => ({ ...prev, preheader: event.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="mt-4 space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Üzenet törzs
          </label>
          <textarea
            rows={12}
            value={form.body}
            onChange={(event) =>
              updateForm((prev) => ({ ...prev, body: event.target.value }))
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
              onChange={(event) =>
                updateForm((prev) => ({ ...prev, ctaLabel: event.target.value }))
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
              onChange={(event) =>
                updateForm((prev) => ({ ...prev, ctaUrl: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={handleSave} variant="primary" size="sm">
            Sablon mentése
          </Button>
          <Button onClick={handleReset} variant="outline" size="sm">
            Alapértelmezett visszaállítása
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px,minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Változó tokenek
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            A tokenekre kattintva beszúrhatod őket az üzenet törzsébe.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {activeDefinition.tokens.map((token) => (
              <button
                key={token}
                type="button"
                onClick={() => insertTokenToBody(token)}
                className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-mono text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {token}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-3">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Előnézeti mintaértékek
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
              {Object.entries(previewValues).map(([key, value]) => (
                <li key={key} className="flex items-start justify-between gap-3">
                  <span className="font-mono text-slate-500 dark:text-slate-300">{`{{${key}}}`}</span>
                  <span className="text-right">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Élő email előnézet
          </h2>
          <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4">
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sablon neve</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{form.templateName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Reply-To</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{form.replyTo || "-"}</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Tárgy</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{renderedSubject}</p>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Preheader</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{renderedPreheader}</p>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Törzs</p>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700 dark:text-slate-300">
              {renderedBody}
            </pre>

            <a
              href={form.ctaUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              {form.ctaLabel}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
