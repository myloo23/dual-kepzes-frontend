// src/components/student/NewsCard.tsx
import type { NewsItem } from "../../lib/api";

function formatDate(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("hu-HU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

interface NewsCardProps {
    news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-semibold text-slate-900">
                    {news.title}
                </h2>

                <div className="flex items-center gap-2">
                    {news.important && (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 border border-red-100">
                            Fontos
                        </span>
                    )}
                    {(news.createdAt || news.updatedAt) && (
                        <span className="text-xs text-slate-500">
                            {formatDate(news.updatedAt || news.createdAt)}
                        </span>
                    )}
                </div>
            </div>

            {(news.tags || []).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {(news.tags || []).map((t) => (
                        <span
                            key={t}
                            className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                        >
                            {t}
                        </span>
                    ))}
                </div>
            )}

            <p className="mt-3 whitespace-pre-line text-sm text-slate-700">
                {news.content}
            </p>
        </article>
    );
}
