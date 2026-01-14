// src/pages/hr/CompanyProfilePage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type Company } from "../../lib/api";

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Omit<Company, 'id'>>({
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

  const navigate = useNavigate();

  useEffect(() => {
    const loadCompanyProfile = async () => {
      try {
        // Assuming we have an endpoint to get the current user's company
        const companies = await api.companies.list();
        if (companies.length > 0) {
          const companyData = await api.companies.get(companies[0].id);
          setCompany(companyData);
          setFormData(companyData);
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
      await api.companies.update(company.id, formData);
      setCompany({ ...company, ...formData });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Hiba a mentés során");
    } finally {
      setLoading(false);
    }
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

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Cég neve *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Adószám *</label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Ország *</label>
              <input
                type="text"
                name="hqCountry"
                value={formData.hqCountry}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Irányítószám *</label>
              <input
                type="text"
                name="hqZipCode"
                value={formData.hqZipCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Város *</label>
              <input
                type="text"
                name="hqCity"
                value={formData.hqCity}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Cím *</label>
              <input
                type="text"
                name="hqAddress"
                value={formData.hqAddress}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Cég leírása</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Kapcsolattartó neve *</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Kapcsolattartó e-mail *</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setFormData(company);
                setIsEditing(false);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">{company.name}</h2>
            <p className="mt-1 text-sm text-gray-500">Cég adatai</p>
          </div>
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Adószám</dt>
                <dd className="mt-1 text-sm text-gray-900">{company.taxId}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Székhely</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {[company.hqZipCode, company.hqCity, company.hqAddress].filter(Boolean).join(', ')}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Ország</dt>
                <dd className="mt-1 text-sm text-gray-900">{company.hqCountry}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Kapcsolattartó</dt>
                <dd className="mt-1 text-sm text-gray-900">{company.contactName}</dd>
                <dd className="text-sm text-blue-600">{company.contactEmail}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Leírás</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {company.description || 'Nincs megadott leírás.'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}