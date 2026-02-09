// src/components/company-profile/CompanyProfileDisplay.tsx
import { Globe } from "lucide-react";
import { type Company } from "../../../lib/api";

interface CompanyProfileDisplayProps {
  company: Company;
}

export default function CompanyProfileDisplay({
  company,
}: CompanyProfileDisplayProps) {
  return (
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
            <dt className="text-sm font-medium text-gray-500">Telephelyek</dt>
            <dd className="mt-1 text-sm text-gray-900 space-y-1">
              {company.locations?.map((loc: any, i: number) => (
                <div key={i}>
                  {[loc.zipCode, loc.city, loc.address]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )) || "-"}
            </dd>
          </div>

          {company.hasOwnApplication && company.website && (
            <div className="sm:col-span-2">
              <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-start gap-2">
                <Globe size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">
                    Külső jelentkezési felület aktív
                  </div>
                  <div className="mt-1 text-xs opacity-90 break-all">
                    A jelentkezők a <strong>{company.website}</strong> címre
                    lesznek irányítva.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">
              Kapcsolattartó
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {company.contactName}
            </dd>
            <dd className="text-sm text-blue-600">{company.contactEmail}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Leírás</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
              {company.description || "Nincs megadott leírás."}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
