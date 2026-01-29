import { useState, useEffect, useMemo } from "react";
import { api, type Application, type ApplicationStatus } from "../../../lib/api";

export const useCompanyApplications = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionId, setActionId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);



    // Filtering states
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "student-asc" | "student-desc" | "position-asc">("newest");

    const loadApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await api.applications.listCompany();
            setApplications(Array.isArray(list) ? list : []);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Hiba a jelentkezések betöltésekor.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadApplications();
    }, []);

    const handleApplicationDecision = async (id: string, status: "ACCEPTED" | "REJECTED") => {
        setActionId(id);
        setActionError(null);
        try {
            await api.applications.evaluateCompany(id, { status });
            await loadApplications();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Hiba a jelentkezés frissítésekor.";
            setActionError(message);
        } finally {
            setActionId(null);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteConfirmId(id);
        setDeleteError(null);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmId) return;

        try {
            setDeletingId(deleteConfirmId);
            setDeleteError(null);
            await api.applications.updateCompanyApplication(deleteConfirmId, {
                status: "REJECTED",
                companyNote: "Jelentkezés törölve a cég által."
            });

            // Remove the application from the list
            setApplications(prev => prev.filter(app => app.id !== deleteConfirmId));
            setDeleteConfirmId(null);
        } catch (err: any) {
            const errorMsg = err.message || "Hiba történt a jelentkezés törlése során.";
            setDeleteError(errorMsg);
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmId(null);
        setDeleteError(null);
    };

    const toggleExpand = (applicationId: string) => {
        if (expandedId === applicationId) {
            setExpandedId(null);
        } else {
            setExpandedId(applicationId);
        }
    };

    // Filtered and sorted applications
    const filteredApplications = useMemo(() => {
        let filtered = [...applications];

        // Status filter
        if (statusFilter !== "ALL") {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        // Search filter
        if (searchQuery.trim()) {
            const searchLower = searchQuery.toLowerCase();
            filtered = filtered.filter(app =>
                (app.student?.fullName?.toLowerCase() || "").includes(searchLower) ||
                (app.student?.email?.toLowerCase() || "").includes(searchLower) ||
                (app.student?.studentProfile?.currentMajor?.toLowerCase() || "").includes(searchLower) ||
                (app.position?.title?.toLowerCase() || "").includes(searchLower)
            );
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "student-asc":
                    return (a.student?.fullName || "").localeCompare(b.student?.fullName || "", "hu");
                case "student-desc":
                    return (b.student?.fullName || "").localeCompare(a.student?.fullName || "", "hu");
                case "position-asc":
                    return (a.position?.title || "").localeCompare(b.position?.title || "", "hu");
                default:
                    return 0;
            }
        });

        return filtered;
    }, [applications, statusFilter, searchQuery, sortBy]);

    const clearFilters = () => {
        setStatusFilter("ALL");
        setSearchQuery("");
        setSortBy("newest");
    };

    // Helper to get the display application (partial or detailed)
    const getDisplayApplication = (app: Application) => {
        return app;
    };

    return {
        // Data
        applications,
        filteredApplications,
        
        // UI State
        loading,
        error,
        actionError,
        actionId,
        expandedId,
        deleteConfirmId,
        deletingId,
        deleteError,
        
        // Filters State
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        
        // Actions
        loadApplications,
        handleApplicationDecision,
        handleDeleteClick,
        handleDeleteConfirm,
        handleDeleteCancel,
        toggleExpand,
        clearFilters,
        getDisplayApplication
    };
};
