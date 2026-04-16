// src/pages/hr/CompanyProfilePage.tsx
import { useEffect, useState } from "react";
import { api, type Company } from "../../lib/api";
import { companyApi } from "../../features/companies/services/companyApi";
import ErrorAlert from "../../features/companies/components/ErrorAlert";
import CompanyProfileForm from "../../features/companies/components/CompanyProfileForm";
import CompanyProfileDisplay from "../../features/companies/components/CompanyProfileDisplay";
import CompanyImagesManager from "../../features/companies/components/CompanyImagesManager";

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [autoFillLoading, setAutoFillLoading] = useState(false);
  const [autoFillError, setAutoFillError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    taxId: "",
    hqCountry: "",
    hqZipCode: "",
    hqCity: "",
    hqAddress: "",
    contactName: "",
    contactEmail: "",
    description: "",
    website: "",
    hasOwnApplication: false,
    externalApplicationUrl: "",
  });

  useEffect(() => {
    const loadCompanyProfile = async () => {
      try {
        // Fetch current user's company ID first
        const adminProfile = await api.companyAdmins.me.get();
        const companyId = adminProfile.companyEmployee?.company?.id;

        if (companyId) {
          const companyData = await companyApi.get(companyId);
          setCompany(companyData);
          setFormData({
            name: companyData.name,
            taxId: companyData.taxId,
            hqCountry: companyData.locations?.[0]?.country || "",
            hqZipCode: String(companyData.locations?.[0]?.zipCode || ""),
            hqCity: companyData.locations?.[0]?.city || "",
            hqAddress: companyData.locations?.[0]?.address || "",
            contactName: companyData.contactName,
            contactEmail: companyData.contactEmail,
            description: companyData.description || "",
            website: companyData.website || "",
            hasOwnApplication: companyData.hasOwnApplication || false,
            externalApplicationUrl: companyData.externalApplicationUrl || "",
          });
        } else {
          setError("Nem található a felhasználóhoz rendelt cég.");
        }
      } catch (err: any) {
        setError(err.message || "Hiba a cégadatok betöltésekor");
      } finally {
        setLoading(false);
      }
    };

    loadCompanyProfile();
  }, []);

  const parseDescriptionFromHtml = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const selectors = [
      "meta[name='description']",
      "meta[property='og:description']",
      "meta[name='twitter:description']",
    ];

    for (const selector of selectors) {
      const content = doc.querySelector(selector)?.getAttribute("content");
      const normalized = content?.trim();
      if (normalized) return normalized;
    }

    return "";
  };

  const normalizeWebsiteUrl = (website: string): string => {
    const trimmed = website.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const handleAutoFillDescription = async () => {
    const normalizedWebsite = normalizeWebsiteUrl(formData.website || "");

    if (!normalizedWebsite) {
      setAutoFillError("Adj meg egy weboldal URL-t az előtöltéshez.");
      return;
    }

    try {
      setAutoFillLoading(true);
      setAutoFillError(null);

      const response = await fetch(normalizedWebsite, {
        method: "GET",
        mode: "cors",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`A weboldal nem elérhető (HTTP ${response.status}).`);
      }

      const html = await response.text();
      const extractedDescription = parseDescriptionFromHtml(html);

      if (!extractedDescription) {
        throw new Error(
          "A weboldalon nem található meta leírás (description/og:description).",
        );
      }

      setFormData((prev) => ({
        ...prev,
        description: extractedDescription,
        website: normalizedWebsite,
      }));
    } catch (_err) {
      setAutoFillError(
        "Nem sikerült automatikusan beolvasni a leírást. Ellenőrizd az URL-t, vagy töltsd ki kézzel.",
      );
    } finally {
      setAutoFillLoading(false);
    }
  };

  useEffect(() => {
    if (!isEditing) return;
    if ((formData.description || "").trim()) return;
    if (!(formData.website || "").trim()) return;
    void handleAutoFillDescription();
  }, [isEditing]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    if (formData.hasOwnApplication && !formData.externalApplicationUrl?.trim()) {
      setError(
        "Külső jelentkezési felület használata esetén a Külső jelentkezési link megadása kötelező.",
      );
      return;
    }

    try {
      setLoading(true);
      // Convert hqZipCode to number for backend

      const payload = {
        name: formData.name,
        taxId: formData.taxId,
        description: formData.description,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        locations: [
          {
            id: company.locations?.[0]?.id,
            country: formData.hqCountry,
            zipCode: formData.hqZipCode ? Number(formData.hqZipCode) : 0, // Ensure number
            city: formData.hqCity,
            address: formData.hqAddress,
          },
        ],
        hasOwnApplication: formData.hasOwnApplication,
        website: formData.website || undefined,
        externalApplicationUrl:
          formData.hasOwnApplication && formData.externalApplicationUrl?.trim()
            ? formData.externalApplicationUrl.trim()
            : null,
      };
      await companyApi.update(company.id, payload);
      // We need to re-fetch or construct the full object manually if updating local state
      // Simpler to just re-fetch or assume success and mix in new data
      const updatedCompany = {
        ...company,
        ...payload,
        locations: payload.locations,
      };
      setCompany(updatedCompany as any); // Cast as quick fix if types mismatch slightly on complex nested objects
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Hiba a mentés során");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (company) {
      setFormData({
        name: company.name,
        taxId: company.taxId,
        hqCountry: company.locations?.[0]?.country || "",
        hqZipCode: String(company.locations?.[0]?.zipCode || ""),
        hqCity: company.locations?.[0]?.city || "",
        hqAddress: company.locations?.[0]?.address || "",
        contactName: company.contactName,
        contactEmail: company.contactEmail,
        description: company.description || "",
        website: company.website || "",
        hasOwnApplication: company.hasOwnApplication || false,
        externalApplicationUrl: company.externalApplicationUrl || "",
      });
    }
    setAutoFillError(null);
    setIsEditing(false);
  };

  if (loading && !company) {
    return (
      <div className="p-6 text-slate-600 dark:text-slate-400 transition-colors">
        Betöltés...
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-6 text-slate-600 dark:text-slate-400 transition-colors">
        Nincs megjeleníthető cégadatok
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
          Cégprofil
        </h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Szerkesztés
          </button>
        )}
      </div>

      <ErrorAlert message={error} />

      {isEditing ? (
        <CompanyProfileForm
          formData={formData}
          loading={loading}
          autoFillLoading={autoFillLoading}
          autoFillError={autoFillError}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onAutoFillDescription={handleAutoFillDescription}
          onCancel={handleCancel}
        />
      ) : (
        <CompanyProfileDisplay company={company} />
      )}

      <CompanyImagesManager companyId={company.id} />
    </div>
  );
}
