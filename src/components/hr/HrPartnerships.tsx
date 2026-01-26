import { useEffect, useState, useMemo } from "react";
import PartnershipFilters from "../../features/partnerships/components/PartnershipFilters";
import PartnershipsList from "../../features/partnerships/components/PartnershipsList";
import { api } from "../../lib/api";
import type { Partnership, PartnershipStatus, EmployeeProfile } from "../../types/api.types";

export default function HrPartnerships() {
    const [partnerships, setPartnerships] = useState<Partnership[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<PartnershipStatus | "ALL">("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const [mentors, setMentors] = useState<EmployeeProfile[]>([]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [partnershipsData, employeesData] = await Promise.all([
                api.partnerships.listCompany(),
                api.employees.listMentors()
            ]);
            setPartnerships(partnershipsData);
            setMentors(Array.isArray(employeesData) ? employeesData : []);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    const filteredPartnerships = useMemo(() => {
        return partnerships.filter((p) => {
            // Status filter
            if (statusFilter !== "ALL" && p.status !== statusFilter) {
                return false;
            }

            // Search query
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const studentName = p.student?.fullName?.toLowerCase() || "";
                const studentEmail = p.student?.email?.toLowerCase() || "";
                const mentorName = p.mentor?.fullName?.toLowerCase() || ""; // Assuming mentor is populated as employee/user

                return (
                    studentName.includes(query) ||
                    studentEmail.includes(query) ||
                    mentorName.includes(query)
                );
            }

            return true;
        });
    }, [partnerships, statusFilter, searchQuery]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Partnerek</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Kezelje a céggel szerződésben álló hallgatókat és mentorokat.
                    </p>
                </div>
                <button
                    onClick={loadData}
                    className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                >
                    Frissítés
                </button>
            </div>

            <PartnershipFilters
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
            />

            <PartnershipsList
                partnerships={filteredPartnerships}
                mentors={mentors}
                onRefresh={loadData}
                isLoading={isLoading}
            />
        </div>
    );
}
