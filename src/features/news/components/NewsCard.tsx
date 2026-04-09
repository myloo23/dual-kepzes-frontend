// src/components/student/NewsCard.tsx
import { Calendar, Clock, Tag } from "lucide-react";
import type { NewsItem } from "../../../lib/api";
import { cn } from "../../../utils/cn";

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

interface NewsCardProps {
  news: NewsItem;
  onOpen?: (news: NewsItem) => void;
}

export default function NewsCard({ news, onOpen }: NewsCardProps) {
  const isImportant = news.isImportant;
  const isInteractive = typeof onOpen === "function";

  return (
    <article
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? () => onOpen(news) : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen(news);
              }
            }
          : undefined
      }
      className={cn(
        "group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white dark:bg-slate-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        isInteractive &&
          "cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/60",
        isImportant
          ? "border-2 border-red-100 dark:border-red-900/50 shadow-red-50/50 dark:shadow-red-900/20"
          : "border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none",
      )}
    >
      {/* Decorative gradient background for header */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1.5",
          isImportant
            ? "bg-gradient-to-r from-red-500 to-orange-500"
            : "bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        )}
      />

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Header: Date & Badges */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={news.createdAt}>
              {formatDate(news.createdAt || news.updatedAt)}
            </time>
          </div>
          {isImportant && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 dark:bg-red-900/20 px-2.5 py-1 text-[11px] font-bold text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 shadow-sm animate-pulse-subtle transition-colors">
              <Clock className="w-3 h-3" />
              FONTOS
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {news.title}
        </h2>

        {/* Content Preview */}
        <div className="flex-1">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4 transition-colors">
            {news.content}
          </p>
        </div>

        {/* Footer: Tags */}
        {(news.tags || []).length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 transition-colors">
            {(news.tags || []).map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-md bg-slate-50 dark:bg-slate-800/50 px-2 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-100 dark:group-hover:border-blue-900/50 transition-colors"
              >
                <Tag className="w-3 h-3 opacity-50" />
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
