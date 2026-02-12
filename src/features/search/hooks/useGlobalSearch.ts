import { useState, useEffect, useMemo } from "react";
import { useNavigation } from "../../../hooks/useNavigation";
import { api } from "../../../lib/api";
import { companyApi } from "../../../features/companies/services/companyApi";
import { useAuth } from "../../../features/auth";
import type { SearchResult } from "../types";

export function useGlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { dashboard: dashboardLink, news: newsLink } = useNavigation();
  const { isAuthenticated } = useAuth();

  // Pre-define static pages
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
        link: "/login",
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
      return;
    }

    // Initial show of static pages when opening
    if (query.trim() === "") {
      setResults(staticPages);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const searchQuery = query.toLowerCase();

        // Filter static pages locally
        const pageResults = staticPages.filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery) ||
            p.subtitle?.toLowerCase().includes(searchQuery),
        );

        // Fetch dynamic data
        // Note: In a real "Global Search" we might need a dedicated endpoint.
        // Here we fetch a reasonable amount of top items and filter client-side.
        // We catch errors silently to show at least what we have.

        const [positions, companies, news] = await Promise.all([
          api.positions
            .listPublic({ limit: 50 })
            .then((res) => res || [])
            .catch(() => []),
          companyApi
            .list({ limit: 50 })
            .then((res) => res || [])
            .catch(() => []),
          // Only fetch news if link exists found roughly implies logic but api.news.list is generic usually.
          // api.news.list({ limit: 20 }) would be ideal if public. Assuming listPublic or list.
          api.news
            .list({ limit: 20 })
            .then((res) => res || [])
            .catch(() => []),
        ]);

        const positionResults: SearchResult[] = positions
          // Client side filtering
          .filter(
            (p: any) =>
              p.title.toLowerCase().includes(searchQuery) ||
              p.company?.name.toLowerCase().includes(searchQuery) ||
              p.description?.toLowerCase().includes(searchQuery),
          )
          .map((p: any) => ({
            id: `pos-${p.id}`,
            type: "position",
            title: p.title,
            subtitle: p.company?.name || "Ismeretlen cég",
            link: `/positions?id=${p.id}`,
          }));

        const companyResults: SearchResult[] = companies
          .filter(
            (c: any) =>
              c.name.toLowerCase().includes(searchQuery) ||
              c.description?.toLowerCase().includes(searchQuery),
          )
          .map((c: any) => ({
            id: `comp-${c.id}`,
            type: "company",
            title: c.name,
            subtitle: c.website || "Cég profilja", // Description might be too long for subtitle
            link: `/companies/${c.id}`,
          }));

        const newsResults: SearchResult[] = news
          .filter(
            (n: any) =>
              n.title.toLowerCase().includes(searchQuery) ||
              n.content?.toLowerCase().includes(searchQuery),
          )
          .map((n: any) => ({
            id: `news-${n.id}`,
            type: "news",
            title: n.title,
            subtitle: "Hír",
            link: newsLink ? `${newsLink}/${n.id}` : `/news/${n.id}`,
          }));

        setResults([
          ...pageResults,
          ...positionResults,
          ...companyResults,
          ...newsResults,
        ]);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query, open, staticPages, newsLink]);

  return {
    query,
    setQuery,
    results,
    loading,
    open,
    setOpen,
  };
}
