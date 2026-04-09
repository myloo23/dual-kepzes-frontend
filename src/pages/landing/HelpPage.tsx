import { Link } from "react-router-dom";

export default function HelpPage() {
  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10 lg:py-14 space-y-10">
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 lg:p-8 transition-colors">
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Súgó és Segítség
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Útmutató a felület használatához
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Ez az oldal röviden bemutatja a rendszer fő részeit és a tipikus
            felhasználói folyamatokat. A tartalom itt bővíthető tovább részletes
            lépésről-lépésre útmutatókkal.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1. Kezdés
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Jelentkezz be, majd nyisd meg az irányítópultot. A rendszer a
              szerepköröd alapján a megfelelő felületre irányít.
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              2. Navigáció
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              A felső menüben érheted el a publikus oldalakat, a szerepkörös
              oldalsávban pedig az adott munkafolyamatokhoz tartozó menüpontokat.
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              3. Fő modulok
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Állásajánlatok, jelentkezések, partnerkapcsolatok, hírek és profil
              kezelés. Minden modul önálló oldalon érhető el.
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              4. Továbblépés
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              A későbbiekben ide bővíthető részletes tudásbázis, GYIK és
              képernyőképes útmutató is.
            </p>
          </article>
        </section>

        <section className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 transition-colors">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Gyors hivatkozások
          </h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Kezdőlap
            </Link>
            <Link
              to="/positions"
              className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Állásajánlatok
            </Link>
            <Link
              to="/gallery"
              className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Galéria
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
