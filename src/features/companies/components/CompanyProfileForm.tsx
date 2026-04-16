// src/components/company-profile/CompanyProfileForm.tsx

interface CompanyProfileFormData {
  name: string;
  taxId: string;
  hqCountry: string;
  hqZipCode: string;
  hqCity: string;
  hqAddress: string;
  contactName: string;
  contactEmail: string;
  description: string;
  website?: string;
  hasOwnApplication?: boolean;
  externalApplicationUrl?: string;
}

interface CompanyProfileFormProps {
  formData: CompanyProfileFormData;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onCancel: () => void;
}

const inputClasses =
  "w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-colors";
const labelClasses =
  "block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors";

export default function CompanyProfileForm({
  formData,
  loading,
  onSubmit,
  onChange,
  onCancel,
}: CompanyProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={labelClasses}>Cég neve *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className={inputClasses}
            required
          />
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Adószám *</label>
          <input
            type="text"
            name="taxId"
            value={formData.taxId}
            onChange={onChange}
            className={inputClasses}
            required
          />
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Ország *</label>
          <input
            type="text"
            name="hqCountry"
            value={formData.hqCountry}
            onChange={onChange}
            className={inputClasses}
            required
          />
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Irányítószám *</label>
          <input
            type="text"
            name="hqZipCode"
            value={formData.hqZipCode}
            onChange={onChange}
            className={inputClasses}
            required
          />
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Város *</label>
          <input
            type="text"
            name="hqCity"
            value={formData.hqCity}
            onChange={onChange}
            className={inputClasses}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className={labelClasses}>Cím *</label>
          <input
            type="text"
            name="hqAddress"
            value={formData.hqAddress}
            onChange={onChange}
            className={inputClasses}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className={labelClasses}>Weboldal</label>
          <input
            type="url"
            name="website"
            value={formData.website || ""}
            onChange={onChange}
            className={inputClasses}
            placeholder="https://pelda.hu"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className={labelClasses}>Cég leírása</label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={onChange}
            rows={4}
            className={inputClasses}
          />
        </div>

        <div className="md:col-span-2 space-y-3 pt-2 border-t border-gray-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasOwnApplication"
              name="hasOwnApplication"
              checked={!!formData.hasOwnApplication}
              onChange={(e) => {
                onChange(e);
              }}
              className="h-4 w-4 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="hasOwnApplication"
              className="text-sm font-medium text-gray-700 dark:text-slate-300 cursor-pointer select-none transition-colors"
            >
              Saját jelentkezési felület használata
            </label>
          </div>

          {formData.hasOwnApplication && (
            <div className="space-y-2">
              <div className="space-y-1">
                <label className={labelClasses}>Külső jelentkezési link *</label>
                <input
                  type="url"
                  name="externalApplicationUrl"
                  value={formData.externalApplicationUrl || ""}
                  onChange={onChange}
                  placeholder="https://cegnev.hu/karrier"
                  className={inputClasses}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-100 dark:border-blue-800/50 transition-colors">
                Bekapcsolt állapotban a "Jelentkezés" gomb erre a linkre irányít
                át. A cég általános weboldala ettől függetlenül beállítható.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Kapcsolattartó neve *</label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={onChange}
            className={inputClasses}
            required
          />
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Kapcsolattartó e-mail *</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={onChange}
            className={inputClasses}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          Mégse
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Mentés..." : "Mentés"}
        </button>
      </div>
    </form>
  );
}
