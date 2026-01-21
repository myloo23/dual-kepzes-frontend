// src/pages/hr/CompanyProfilePage.tsx
import { useEffect, useState } from "react";
import { api, type Company } from "../../lib/api";
import ErrorAlert from "../../components/company-profile/ErrorAlert";
import CompanyProfileForm from "../../components/company-profile/CompanyProfileForm";
import CompanyProfileDisplay from "../../components/company-profile/CompanyProfileDisplay";

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    hqCountry: '',
    hqZipCode: '',
    hqCity: '',
    hqAddress: '',
    contactName: '',
    contactEmail: '',
    description: ''
  });

  useEffect(() => {
    const loadCompanyProfile = async () => {
      try {
        // Assuming we have an endpoint to get the current user's company
        const companies = await api.companies.list();
        if (companies.length > 0) {
          const companyData = await api.companies.get(companies[0].id);
          setCompany(companyData);
          setFormData({
            name: companyData.name,
            taxId: companyData.taxId,
            hqCountry: companyData.locations?.[0]?.country || '',
            hqZipCode: String(companyData.locations?.[0]?.zipCode || ''),
            hqCity: companyData.locations?.[0]?.city || '',
            hqAddress: companyData.locations?.[0]?.address || '',
            contactName: companyData.contactName,
            contactEmail: companyData.contactEmail,
            description: companyData.description || ''
          });
        }
      } catch (err: any) {
        setError(err.message || "Hiba a cégadatok betöltésekor");
      } finally {
        setLoading(false);
      }
    };

    loadCompanyProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    try {
      setLoading(true);
      // Convert hqZipCode to number for backend


      const payload = {
        name: formData.name,
        taxId: formData.taxId,
        description: formData.description,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        locations: [{
          country: formData.hqCountry,
          zipCode: formData.hqZipCode ? Number(formData.hqZipCode) : 0, // Ensure number
          city: formData.hqCity,
          address: formData.hqAddress
        }]
      };
      await api.companies.update(company.id, payload);
      // We need to re-fetch or construct the full object manually if updating local state
      // Simpler to just re-fetch or assume success and mix in new data
      const updatedCompany = { ...company, ...payload, locations: payload.locations };
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
        hqCountry: company.locations?.[0]?.country || '',
        hqZipCode: String(company.locations?.[0]?.zipCode || ''),
        hqCity: company.locations?.[0]?.city || '',
        hqAddress: company.locations?.[0]?.address || '',
        contactName: company.contactName,
        contactEmail: company.contactEmail,
        description: company.description || ''
      });
    }
    setIsEditing(false);
  };

  if (loading && !company) {
    return <div className="p-6">Betöltés...</div>;
  }

  if (!company) {
    return <div className="p-6">Nincs megjeleníthető cégadatok</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cégprofil</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onCancel={handleCancel}
        />
      ) : (
        <CompanyProfileDisplay company={company} />
      )}
    </div>
  );
}