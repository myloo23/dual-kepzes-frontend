/**
 * Positions Page - Refactored
 * Displays public positions with filtering, sorting, and map view
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';
import { usePositions } from '../../../features/positions/hooks/usePositions';
import { usePositionsFilters } from '../../../hooks/usePositionsFilters';
import { useModal } from '../../../shared/hooks';
import ApplicationModal from '../../../components/applications/ApplicationModal';
import FilterSidebar from '../../../components/positions/FilterSidebar';
import PositionsList from '../../../features/positions/components/PositionsList';
import PositionsMap from '../../../components/positions/PositionsMap';
import { PAGE_TITLES, PAGE_DESCRIPTIONS, ERROR_MESSAGES } from '../../../constants';
import { lower } from '../../../lib/positions-utils';
import type { Position } from '../../../lib/api';
import type { DeadlineFilter, SortKey } from '../../../hooks/usePositionsFilters';

export default function PositionsPage() {
  const navigate = useNavigate();
  const { positions, loading, error, applicationSuccess, submitApplication } = usePositions();
  const applicationModal = useModal<Position>();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('ALL');
  const [company, setCompany] = useState('ALL');
  const [tagCategory, setTagCategory] = useState('ALL');
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>('ALL');
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('NEWEST');

  const {
    cities,
    companies,
    tagCategories,
    allTags,
    filteredPositions,
  } = usePositionsFilters({
    positions,
    search,
    city,
    company,
    tagCategory,
    deadlineFilter,
    activeOnly,
    selectedTags,
    sortKey,
  });

  const sanitizedCompanies = useMemo(
    () => companies.filter((companyName): companyName is string => Boolean(companyName)),
    [companies]
  );

  const derived = useMemo(() => {
    const maxChips = 8;
    return {
      cities,
      companies: sanitizedCompanies,
      tags: allTags,
      categories: tagCategories,
      showCityChips: cities.length > 0 && cities.length <= maxChips,
      showCompanyChips: sanitizedCompanies.length > 0 && sanitizedCompanies.length <= maxChips,
    };
  }, [cities, sanitizedCompanies, allTags, tagCategories]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setCity('ALL');
    setCompany('ALL');
    setTagCategory('ALL');
    setDeadlineFilter('ALL');
    setActiveOnly(false);
    setSelectedTags([]);
    setSortKey('NEWEST');
  }, []);

  const toggleTag = useCallback((name: string) => {
    setSelectedTags((prev) => {
      const exists = prev.some((tag) => lower(tag) === lower(name));
      if (exists) {
        return prev.filter((tag) => lower(tag) !== lower(name));
      }
      return [...prev, name];
    });
  }, []);

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

      const position = positions.find(p => String(p.id) === openPositionId);
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
    const position = positions.find(p => String(p.id) === String(positionId));
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
      {!loading && filteredPositions.length > 0 && !applicationModal.isOpen && (
        <div className="mb-8">
          <PositionsMap
            positions={filteredPositions}
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
          <span className="font-semibold text-slate-800">{filteredPositions.length}</span> / {positions.length}
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[320px,minmax(0,1fr)]">
        {/* Filters */}
        <FilterSidebar
          search={search}
          city={city}
          company={company}
          tagCategory={tagCategory}
          deadlineFilter={deadlineFilter}
          activeOnly={activeOnly}
          selectedTags={selectedTags}
          sortKey={sortKey}
          setSearch={setSearch}
          setCity={setCity}
          setCompany={setCompany}
          setTagCategory={setTagCategory}
          setDeadlineFilter={setDeadlineFilter}
          setActiveOnly={setActiveOnly}
          setSelectedTags={setSelectedTags}
          setSortKey={setSortKey}
          derived={derived}
          onResetFilters={resetFilters}
          onToggleTag={toggleTag}
        />

        {/* Positions List */}
        <section className="min-w-0">
          <PositionsList
            positions={filteredPositions}
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
