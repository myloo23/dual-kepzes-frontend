import { useState, useEffect, useMemo } from "react";
import { useNavigation } from "../../../hooks/useNavigation";
import { api } from "../../../lib/api";
import type { Position, Company, NewsItem } from "../../../lib/api";
import { useAuth } from "../../../features/auth";
import type { SearchResult } from "../types";

export function useGlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const { dashboard: dashboardLink, news: newsLink } = useNavigation();
  const { isAuthenticated } = useAuth();

  const staticPages: SearchResult[] = useMemo(() => {
    const pages: SearchResult[] = [
      {
        id: "home",
        type: "page",
        title: "Kezdőlap",
        link: "/",
        subtitle: "Főoldal",
      },
      {
        id: "jobs",
        type: "page",
        title: "Elérhető állások",
        link: "/positions",
        subtitle: "Minden aktuális állásajánlat",
      },
    ];

    if (isAuthenticated) {
      if (dashboardLink) {
        pages.push({
          id: "dashboard",
          type: "page",
          title: "Irányítópult",
          link: dashboardLink,
          subtitle: "Saját vezérlőpult",
        });
      }
    } else {
      pages.push({
        id: "login",
        type: "page",
        title: "Bejelentkezés",
        link: "/",
        subtitle: "Belépés a fiókba",
      });
      pages.push({
        id: "register",
        type: "page",
        title: "Regisztráció",
        link: "/register",
        subtitle: "Új fiók létrehozása",
      });
    }

    if (newsLink) {
      pages.push({
        id: "news",
        type: "page",
        title: "Hírek",
        link: newsLink,
        subtitle: "Aktuális hírek és információk",
      });
    }

    return pages;
  }, [dashboardLink, newsLink, isAuthenticated]);

  useEffect(() => {
    if (!open) {
      setResults([]);
      setQuery("");
      setError(null);
      return;
    }

    if (query.trim() === "") {
      setResults(staticPages);
      setError(null);
      return;
    }

    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.search(query.trim());

        const positionResults: SearchResult[] = (data.positions ?? []).map(
          (p: Position) => ({
            id: `pos-${p.id}`,
            type: "position" as const,
            title: p.title,
            subtitle: p.company?.name ?? "Ismeretlen cég",
            link: `/positions?id=${p.id}`,
          }),
        );

        const companyResults: SearchResult[] = (data.companies ?? []).map(
          (c: Company) => ({
            id: `comp-${c.id}`,
            type: "company" as const,
            title: c.name,
            subtitle: c.website ?? "Cég profilja",
            link: `/companies/${c.id}`,
          }),
        );

        const newsResults: SearchResult[] = (data.news ?? []).map(
          (n: NewsItem) => ({
            id: `news-${n.id}`,
            type: "news" as const,
            title: n.title,
            subtitle: "Hír",
            link: newsLink ? `${newsLink}/${n.id}` : `/news/${n.id}`,
          }),
        );

        setResults([...positionResults, ...companyResults, ...newsResults]);
      } catch {
        setError("A keresés nem sikerült. Próbáld újra később.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, open, staticPages, newsLink]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    open,
    setOpen,
  };
}
