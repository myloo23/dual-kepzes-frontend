/**
 * Positions Page - Refactored
 * Displays public positions with filtering, sorting, and map view
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { usePositions } from '../../features/positions/hooks/usePositions';
import { usePositionsFilters } from '../../features/positions/hooks/usePositionsFilters';
import { useModal } from '../../hooks';
import { useToast } from '../../hooks/useToast';
import ApplicationModal from '../../features/applications/components/ApplicationModal';
import FilterSidebar from '../../features/positions/components/FilterSidebar';
import PositionsList from '../../features/positions/components/PositionsList';
import PositionsMap from '../../features/positions/components/PositionsMap';
import { PAGE_TITLES, PAGE_DESCRIPTIONS, ERROR_MESSAGES } from '../../constants';
import type { Position } from '../../lib/api';
import { Combobox } from '../../components/ui/Combobox';
import HUCities from '../../assets/hu.json'; // Import the JSON
import { MapPin, Navigation } from 'lucide-react';
import ToastContainer from '../../components/shared/ToastContainer';

type LocationMode = 'gps' | 'city';

export default function PositionsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { positions, loading, error, applicationSuccess, submitApplication } = usePositions();
  const filters = usePositionsFilters(positions);
  const applicationModal = useModal<Position>();
  
  const [locationMode, setLocationMode] = useState<LocationMode>('gps');
  const [selectedCity, setSelectedCity] = useState<string>('Kecskemét'); // Default to Kecskemet
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Memoize city options for Combobox
  const cityOptions = useMemo(() => {
    return HUCities.map(city => ({
        value: city.city,
        label: city.city
    })).sort((a, b) => a.label.localeCompare(b.label, 'hu'));
  }, []);

  // Get user location for map
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
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

  // Calculate effective user location based on mode
  const userLocation = useMemo(() => {
    if (locationMode === 'gps') {
      return gpsLocation;
    } else {
      const cityData = HUCities.find(c => c.city === selectedCity);
      if (cityData) {
          return {
              lat: parseFloat(cityData.lat),
              lng: parseFloat(cityData.lng)
          };
      }
      return null;
    }
  }, [locationMode, gpsLocation, selectedCity]);

  const [searchParams, setSearchParams] = useSearchParams();

  // Check if we should auto-open a position from URL query param
  useEffect(() => {
    if (positions.length === 0) return;

    const positionId = searchParams.get('id');
    if (positionId) {
      // Prevent infinite re-opening loop if already open with same ID
      if (applicationModal.isOpen && String(applicationModal.data?.id) === positionId) {
        return;
      }

      const position = positions.find((p: Position) => String(p.id) === positionId);
      if (position) {
        applicationModal.open(position);
      }
    }
  }, [positions, applicationModal, searchParams]);

  // Navigate to company profile page
  const showCompanyInfo = useCallback(async (
    companyData: { id?: string | number; name?: string; logoUrl?: string | null } | undefined
  ) => {
    if (!companyData || !companyData.name) {
      toast.showError(ERROR_MESSAGES.NO_COMPANY_DATA);
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
      toast.showError(ERROR_MESSAGES.COMPANY_NOT_FOUND);
    }
  }, [navigate, toast]);

  // Handle apply button click
  const handleApply = useCallback(async (positionId: string | number) => {
    const position = positions.find((p: Position) => String(p.id) === String(positionId));
    if (!position) return;

    // Fix: Check for external application details if missing from list view
    if (position.companyId && (!position.company?.hasOwnApplication || position.company?.website === undefined)) {
        try {
            const companyDetails = await api.companies.get(position.companyId);
            if (companyDetails.hasOwnApplication && companyDetails.website) {
                toast.showInfo(`Átirányítás a(z) ${companyDetails.name} karrier oldalára...`);
                // Short delay to let the user see the message
                setTimeout(() => {
                    window.open(companyDetails.website!, '_blank');
                }, 1500);
                return;
            }
        } catch (error) {
            console.error("Failed to verify company application settings:", error);
            // Fallback to internal apply if check fails
        }
    }

    applicationModal.open(position);
    // Update URL to reflect the open modal
    setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('id', String(positionId));
        return newParams;
    });
  }, [positions, applicationModal, setSearchParams]);

  // Handle application submission
  const handleSubmitApplication = useCallback(async (note: string) => {
    if (!applicationModal.data?.id) return;

    try {
      await submitApplication(String(applicationModal.data.id), note);
      applicationModal.close();
      // Clear URL param on successful submission too
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('id');
        return newParams;
      });
    } catch (err) {
      throw err; // Let ApplicationModal handle the error
    }
  }, [applicationModal, submitApplication, setSearchParams]);

  const handleModalClose = useCallback(() => {
    applicationModal.close();
    // Clear URL param when closing manually
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('id');
      return newParams;
    });
  }, [applicationModal, setSearchParams]);

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
      {!loading && filters.filtered.length > 0 && (
        <div className="mb-8 space-y-4">
            <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-fit">
              <button
                onClick={() => setLocationMode('gps')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  locationMode === 'gps'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Navigation className="w-4 h-4" />
                Jelenlegi pozíció
              </button>
              <div className="h-6 w-px bg-slate-200 my-auto" />
              <div className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all ${
                  locationMode === 'city' ? 'bg-blue-50' : ''
              }`}>
                  <button
                    onClick={() => setLocationMode('city')}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      locationMode === 'city'
                        ? 'text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    Város választása:
                  </button>
                  {locationMode === 'city' && (
                    <div className="min-w-[200px]">
                      <Combobox
                        options={cityOptions}
                        value={selectedCity}
                        onChange={setSelectedCity}
                        placeholder="Válassz várost..."
                        searchPlaceholder="Keresés..."
                        className="w-full"
                      />
                    </div>
                  )}
              </div>
            </div>

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
          onClose={handleModalClose}
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
      {/* Success Message - keeping existing one for application modal success if handled separately, 
          but ideally we should unify. For now, just adding generic toast container */}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </div>
  );
}
