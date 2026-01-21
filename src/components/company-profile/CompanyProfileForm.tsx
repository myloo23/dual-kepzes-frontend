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
}

interface CompanyProfileFormProps {
    formData: CompanyProfileFormData;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onCancel: () => void;
}

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
                    <label className="block text-sm font-medium text-gray-700">Cég neve *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
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
                        onChange={onChange}
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
                        onChange={onChange}
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
                        onChange={onChange}
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
                        onChange={onChange}
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
                        onChange={onChange}
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Cég leírása</label>
                    <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={onChange}
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
                        onChange={onChange}
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
                        onChange={onChange}
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
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
    );
}
