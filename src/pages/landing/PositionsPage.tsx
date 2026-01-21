/**
 * Positions Page - Refactored
 * Displays public positions with filtering, sorting, and map view
 */

import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { usePositions } from '../../features/positions/hooks/usePositions';
import usePositionsFilters from '../../hooks/usePositionsFilters';
import { useModal } from '../../shared/hooks';
import ApplicationModal from '../../components/applications/ApplicationModal';
import FilterSidebar from '../../components/positions/FilterSidebar';
import PositionsList from '../../features/positions/components/PositionsList';
import PositionsMap from '../../components/positions/PositionsMap';
import { PAGE_TITLES, PAGE_DESCRIPTIONS, ERROR_MESSAGES } from '../../constants';
import type { Position } from '../../lib/api';

export default function PositionsPage() {
  const navigate = useNavigate();
  const { positions, loading, error, applicationSuccess, submitApplication } = usePositions();
  const filters = usePositionsFilters(positions);
  const applicationModal = useModal<Position>();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get user location for map
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Check if we should auto-open a position from map navigation
  useEffect(() => {
    if (positions.length === 0) return;

    const openPositionId = sessionStorage.getItem('openPositionId');
    if (openPositionId) {
      sessionStorage.removeItem('openPositionId');

      const position = positions.find((p: Position) => String(p.id) === openPositionId);
      if (position) {
        applicationModal.open(position);
      }
    }
  }, [positions, applicationModal]);

  // Navigate to company profile page
  const showCompanyInfo = useCallback(async (
    companyData: { id?: string | number; name?: string; logoUrl?: string | null } | undefined
  ) => {
    if (!companyData || !companyData.name) {
      alert(ERROR_MESSAGES.NO_COMPANY_DATA);
      return;
    }

    let targetId = companyData.id;

    // If no ID, try to find it from the list of companies
    if (!targetId) {
      try {
        const allCompanies = await api.companies.list();
        const matchingCompany = allCompanies.find(
          (c) => c.name.trim().toLowerCase() === companyData.name!.trim().toLowerCase()
        );

        if (matchingCompany) {
          targetId = matchingCompany.id;
        }
      } catch (error) {
        console.error('Failed to fetch companies list:', error);
      }
    }

    if (targetId) {
      navigate(`/companies/${targetId}`);
    } else {
      alert(ERROR_MESSAGES.COMPANY_NOT_FOUND);
    }
  }, [navigate]);

  // Handle apply button click
  const handleApply = useCallback((positionId: string | number) => {
    const position = positions.find((p: Position) => String(p.id) === String(positionId));
    if (position) {
      applicationModal.open(position);
    }
  }, [positions, applicationModal]);

  // Handle application submission
  const handleSubmitApplication = useCallback(async (note: string) => {
    if (!applicationModal.data?.id) return;

    try {
      await submitApplication(String(applicationModal.data.id), note);
      applicationModal.close();
    } catch (err) {
      throw err; // Let ApplicationModal handle the error
    }
  }, [applicationModal, submitApplication]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 text-center text-slate-600">
        Betöltés…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* Map */}
      {!loading && filters.filtered.length > 0 && !applicationModal.isOpen && (
        <div className="mb-8">
          <PositionsMap
            positions={filters.filtered}
            userLocation={userLocation}
            onPositionClick={handleApply}
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {PAGE_TITLES.POSITIONS}
          </h1>
          <p className="text-sm text-slate-600">
            {PAGE_DESCRIPTIONS.POSITIONS}
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Találatok:{' '}
          <span className="font-semibold text-slate-800">{filters.filtered.length}</span> / {positions.length}
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[320px,minmax(0,1fr)]">
        {/* Filters */}
        <FilterSidebar
          search={filters.search}
          city={filters.city}
          company={filters.company}
          tagCategory={filters.tagCategory}
          deadlineFilter={filters.deadlineFilter}
          activeOnly={filters.activeOnly}
          selectedTags={filters.selectedTags}
          sortKey={filters.sortKey}
          setSearch={filters.setSearch}
          setCity={filters.setCity}
          setCompany={filters.setCompany}
          setTagCategory={filters.setTagCategory}
          setDeadlineFilter={filters.setDeadlineFilter}
          setActiveOnly={filters.setActiveOnly}
          setSelectedTags={filters.setSelectedTags}
          setSortKey={filters.setSortKey}
          derived={filters.derived}
          onResetFilters={filters.resetFilters}
          onToggleTag={filters.toggleTag}
        />

        {/* Positions List */}
        <section className="min-w-0">
          <PositionsList
            positions={filters.filtered}
            onCompanyClick={showCompanyInfo}
            onApply={handleApply}
          />
        </section>
      </div>

      {/* Application Modal */}
      {applicationModal.data && (
        <ApplicationModal
          isOpen={applicationModal.isOpen}
          position={{
            id: String(applicationModal.data.id),
            title: applicationModal.data.title || 'Pozíció',
            company: applicationModal.data.company,
            city: applicationModal.data.location?.city,
            address: applicationModal.data.location?.address,
          }}
          onClose={applicationModal.close}
          onSubmit={handleSubmitApplication}
        />
      )}

      {/* Success Message */}
      {applicationSuccess && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 shadow-lg">
            <p className="text-sm font-medium text-green-800">
              ✅ {applicationSuccess}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
