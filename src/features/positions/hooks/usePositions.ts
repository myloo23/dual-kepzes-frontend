/**
 * Positions Hook
 * Manages position data fetching and application submission
 */

import { useState, useEffect, useCallback } from "react";
import { api } from "../../../lib/api";
import type { Position } from "../../../lib/api";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../constants";
import { companyApi } from "../../companies/services/companyApi";
import { resolveApiAssetUrl } from "../../../lib/media-url";
import { fetchPrimaryCompanyImageMap } from "../../companies/utils/companyImageLogo";

export interface UsePositionsReturn {
  positions: Position[];
  loading: boolean;
  error: string | null;
  applicationSuccess: string | null;
  submitApplication: (
    positionId: string,
    note?: string,
    cvFile?: File,
    motivationLetterFile?: File,
  ) => Promise<void>;
  clearApplicationSuccess: () => void;
}

export function usePositions(): UsePositionsReturn {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationSuccess, setApplicationSuccess] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const loadPositions = async () => {
      try {
        setLoading(true);
        setError(null);
        const [positionsRes, companies] = await Promise.all([
          api.positions.listPublic({ limit: 1000 }),
          companyApi.list({ limit: 1000 }).catch(() => []),
        ]);

        const companyById = new Map(companies.map((c) => [String(c.id), c]));
        const companyByName = new Map(
          companies.map((c) => [c.name.trim().toLowerCase(), c]),
        );
        const rows = Array.isArray(positionsRes) ? positionsRes : [];
        const requiredCompanyIds = new Set<string>();

        rows.forEach((position) => {
          const companyId = String(position.company?.id ?? position.companyId ?? "").trim();
          const companyName = String(position.company?.name ?? "").trim().toLowerCase();
          const matchedCompany =
            companyById.get(companyId) ||
            (companyName ? companyByName.get(companyName) : undefined);

          if (companyId) requiredCompanyIds.add(companyId);
          if (matchedCompany?.id) requiredCompanyIds.add(String(matchedCompany.id));
        });

        const primaryCompanyImageById = await fetchPrimaryCompanyImageMap(
          Array.from(requiredCompanyIds),
        );

        const enriched = rows.map((position) => {
          const companyId = String(position.company?.id ?? position.companyId ?? "");
          const positionCompanyName = String(position.company?.name ?? "")
            .trim()
            .toLowerCase();
          const matchedCompany =
            companyById.get(companyId) ||
            (positionCompanyName ? companyByName.get(positionCompanyName) : undefined);
          const resolvedCompanyId = String(
            position.company?.id ?? position.companyId ?? matchedCompany?.id ?? "",
          ).trim();
          const logoUrl =
            (resolvedCompanyId
              ? primaryCompanyImageById.get(resolvedCompanyId)
              : undefined) ??
            resolveApiAssetUrl(position.company?.logoUrl) ??
            matchedCompany?.logoUrl ??
            null;

          if (!position.company && matchedCompany) {
            return {
              ...position,
              company: {
                id: matchedCompany.id,
                name: matchedCompany.name,
                logoUrl,
                locations: matchedCompany.locations ?? [],
                website: matchedCompany.website ?? null,
                hasOwnApplication: matchedCompany.hasOwnApplication ?? false,
              },
            };
          }

          return {
            ...position,
            company: position.company
              ? {
                  ...position.company,
                  id:
                    position.company.id ??
                    position.companyId ??
                    matchedCompany?.id,
                  logoUrl,
                  website: position.company.website ?? matchedCompany?.website ?? null,
                  hasOwnApplication:
                    position.company.hasOwnApplication ??
                    matchedCompany?.hasOwnApplication ??
                    false,
                }
              : position.company,
          };
        });

        setPositions(enriched);
      } catch (e) {
        console.error("Failed to load positions:", e);
        setError(ERROR_MESSAGES.FETCH_POSITIONS);
      } finally {
        setLoading(false);
      }
    };

    loadPositions();
  }, []);

  const submitApplication = useCallback(
    async (
      positionId: string,
      note?: string,
      cvFile?: File,
      motivationLetterFile?: File,
    ) => {
      try {
        if (cvFile || motivationLetterFile) {
          // Use new endpoint with FormData if files are present
          const formData = new FormData();
          formData.append("positionId", positionId);
          if (note) formData.append("studentNote", note);
          if (cvFile) formData.append("cv", cvFile);
          if (motivationLetterFile)
            formData.append("motivationLetter", motivationLetterFile);

          await api.applications.submitWithFiles(formData);
        } else {
          // Use old endpoint with JSON if no files
          await api.applications.submit({
            positionId,
            studentNote: note,
          });
        }

        setApplicationSuccess(SUCCESS_MESSAGES.APPLICATION_SUBMITTED);

        // Clear success message after 5 seconds
        setTimeout(() => setApplicationSuccess(null), 5000);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC;
        throw new Error(errorMessage);
      }
    },
    [],
  );

  const clearApplicationSuccess = useCallback(() => {
    setApplicationSuccess(null);
  }, []);

  return {
    positions,
    loading,
    error,
    applicationSuccess,
    submitApplication,
    clearApplicationSuccess,
  };
}
