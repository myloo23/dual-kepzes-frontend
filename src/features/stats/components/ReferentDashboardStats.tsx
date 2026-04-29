import { useEffect, useMemo, useState } from "react";
import { useReferentOverview } from "../hooks/useStats";
import { Building2, Users, GraduationCap, Mail } from "lucide-react";
import { companyApi } from "@/features/companies/services/companyApi";
import type { Company } from "@/types/api.types";

export function ReferentDashboardStats() {
  const { data, loading, error } = useReferentOverview();
  const [companyProfiles, setCompanyProfiles] = useState<Record<string, Company>>(
    {},
  );

  const companies = useMemo(() => data?.companies || [], [data?.companies]);

  useEffect(() => {
    if (companies.length === 0) {
      return;
    }

    const companyIds = Array.from(
      new Set(
        companies
          .map((company) => String(company.companyId ?? "").trim())
          .filter(Boolean),
      ),
    );

    let cancelled = false;

    const loadCompanyProfiles = async () => {
      try {
        const results = await Promise.allSettled(
          companyIds.map(async (companyId) => {
            const profile = await companyApi.get(companyId);
            return [companyId, profile] as const;
          }),
        );

        if (cancelled) return;

        const profiles: Record<string, Company> = {};
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            const [companyId, profile] = result.value;
            profiles[companyId] = profile;
          }
        });
        setCompanyProfiles(profiles);
      } catch {
        if (!cancelled) setCompanyProfiles({});
      }
    };

    void loadCompanyProfiles();

    return () => {
      cancelled = true;
    };
  }, [companies]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm dark:shadow-none transition-colors animate-pulse space-y-4">
        <div className="h-6 w-1/4 rounded bg-slate-200 dark:bg-slate-800"></div>
        <div className="h-4 w-2/4 rounded bg-slate-200 dark:bg-slate-800 mt-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400">
        Hiba az áttekintés betöltésekor: {error}
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm dark:shadow-none transition-colors">
        <Building2 className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
          Nincsenek hozzád rendelt cégek
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Jelenleg nem tartozik hozzád egyetlen partnercég vagy duális hallgató sem.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => {
          const companyProfile = companyProfiles[String(company.companyId)];
          const primaryLocation = companyProfile?.locations?.[0];
          const totalStudents = company.studentsByMajor.reduce(
            (acc, curr) => acc + curr.count,
            0
          );

          return (
            <div
              key={company.companyId}
              className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm dark:shadow-none transition-colors hover:border-blue-500/30 dark:hover:border-blue-500/30 group"
            >
              {/* Header */}
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                    {company.companyName}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <Users className="h-4 w-4" />
                    Összesen {totalStudents} hallgató
                  </p>
                </div>
              </div>

              <div className="mb-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 p-3.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Cegprofil
                </h4>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
                  {companyProfile?.description?.trim() ||
                    "Ehhez a ceghez jelenleg nincs rovid profil leiras."}
                </p>
                <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  {primaryLocation && (
                    <div>
                      {primaryLocation.zipCode} {primaryLocation.city},{" "}
                      {primaryLocation.address}
                    </div>
                  )}
                  {companyProfile?.contactEmail && (
                    <a
                      href={`mailto:${companyProfile.contactEmail}`}
                      className="inline-block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {companyProfile.contactEmail}
                    </a>
                  )}
                  {companyProfile?.website && (
                    <a
                      href={companyProfile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {companyProfile.website}
                    </a>
                  )}
                </div>
              </div>

              {/* Szakok (Majors) */}
              <div className="mb-6 flex-1 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                  Hallgatók szakok szerint
                </h4>
                {company.studentsByMajor.length > 0 ? (
                  <ul className="space-y-2.5">
                    {company.studentsByMajor.map((major, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between text-sm group/item"
                      >
                        <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <GraduationCap className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                          <span className="line-clamp-1" title={major.majorName}>{major.majorName}</span>
                        </span>
                        <span className="shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                          {major.count} fő
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-slate-400 dark:text-slate-500 italic">
                    Nincsenek aktív hallgatók
                  </div>
                )}
              </div>

              {/* További Referensek (Other Referents) */}
              <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-4">
                <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Mail className="h-3.5 w-3.5" />
                  További kari referensek
                </h4>
                {company.otherReferents.length > 0 ? (
                  <div className="space-y-2">
                    {company.otherReferents.map((ref) => (
                      <div
                        key={ref.id}
                        className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2.5 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {ref.fullName}
                        </div>
                        <a
                          href={`mailto:${ref.email}`}
                          className="mt-0.5 inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                        >
                          {ref.email}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-400 dark:text-slate-500 italic">
                    Nincs más referens ehhez a céghez.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
