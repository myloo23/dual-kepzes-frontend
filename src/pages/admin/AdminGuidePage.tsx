import { ADMIN_FAQ_SECTIONS } from "../../data/faqData";

export default function AdminGuidePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm dark:shadow-none text-center transition-colors">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
          GYIK - Adminisztrátori felület
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto transition-colors">
          Ez az oldal a rendszergazdai feladatokhoz kapcsolódó leggyakoribb kérdéseket és válaszokat tartalmazza.
        </p>
      </div>

      <div className="space-y-4">
        {ADMIN_FAQ_SECTIONS.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <details
                  key={item.question}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 px-4 py-3"
                >
                  <summary className="cursor-pointer list-none font-medium text-slate-900 dark:text-slate-100">
                    {item.question}
                  </summary>
                  <div className="mt-3 space-y-2">
                    {item.answer.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>    </div>
  );
}


