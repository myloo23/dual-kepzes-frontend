import { useEffect, useState, useMemo } from "react";
import MentorPartnershipsList from "../../features/partnerships/components/MentorPartnershipsList";
import { api } from "../../lib/api";
import type { Partnership, EmployeeProfile } from "../../types/api.types";

export default function MentorPartnerships() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [me, setMe] = useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load both partnerships and my profile to filter
      const [partnershipsData, meData] = await Promise.all([
        api.partnerships.listCompany(),
        api.employees.me.get(),
      ]);
      setPartnerships(partnershipsData);
      setMe(meData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const myPartnerships = useMemo(() => {
    if (!me?.user?.id) return [];
    return partnerships.filter((p) => p.mentor?.id === me.user?.id);
  }, [partnerships, me]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Saját Partnerek</h2>
          <p className="mt-1 text-sm text-slate-500">
            Az Önhöz rendelt hallgatók és együttműködések.
          </p>
        </div>
        <button
          onClick={loadData}
          className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
        >
          Frissítés
        </button>
      </div>

      <MentorPartnershipsList
        partnerships={myPartnerships}
        isLoading={isLoading}
      />
    </div>
  );
}
