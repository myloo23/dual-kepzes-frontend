// src/components/student/NewsFilter.tsx

interface NewsFilterProps {
    search: string;
    tag: string;
    onlyImportant: boolean;
    allTags: string[];
    onSearchChange: (value: string) => void;
    onTagChange: (value: string) => void;
    onImportantChange: (value: boolean) => void;
    onRefresh: () => void;
}

export default function NewsFilter({
    search,
    tag,
    onlyImportant,
    allTags,
    onSearchChange,
    onTagChange,
    onImportantChange,
    onRefresh,
}: NewsFilterProps) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="grid gap-3 lg:grid-cols-4">
                <div className="lg:col-span-2">
                    <label className="text-xs font-medium text-slate-700">Keresés</label>
                    <input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Cím, szöveg, címke..."
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="text-xs font-medium text-slate-700">Címke</label>
                    <select
                        value={tag}
                        onChange={(e) => onTagChange(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    >
                        <option value="ALL">Bármely</option>
                        {allTags.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-end justify-between gap-3">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={onlyImportant}
                            onChange={(e) => onImportantChange(e.target.checked)}
                        />
                        Csak fontos
                    </label>

                    <button
                        type="button"
                        onClick={onRefresh}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                    >
                        Frissítés
                    </button>
                </div>
            </div>
        </section>
    );
}
