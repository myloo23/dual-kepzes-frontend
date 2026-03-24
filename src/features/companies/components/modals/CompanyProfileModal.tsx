import { type Company } from "../../../../lib/api";
import { Modal } from "../../../../components/ui/Modal";

type CompanyProfileModalProps = {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function CompanyProfileModal({
  company,
  isOpen,
  onClose,
}: CompanyProfileModalProps) {
  if (!company) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cég profilja" size="2xl">
      <div className="space-y-6">
        {/* Cég neve */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{company.name}</h3>
        </div>

        {/* Leírás */}
        {company.description && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 transition-colors">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors">
              Leírás
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed transition-colors">
              {company.description}
            </p>
          </div>
        )}

        {/* Kapcsolattartó */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4 transition-colors">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 transition-colors">
            Kapcsolattartó
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-slate-500 dark:text-slate-400 min-w-[100px] transition-colors">Név:</span>
              <span className="text-slate-900 dark:text-slate-100 font-medium transition-colors">
                {company.contactName}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-500 dark:text-slate-400 min-w-[100px] transition-colors">Email:</span>
              <a
                href={`mailto:${company.contactEmail}`}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors"
              >
                {company.contactEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Székhely */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4 transition-colors">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 transition-colors">
            Székhely
          </h4>
          {company.locations && company.locations.length > 0 ? (
            company.locations.map(
              (loc: Company["locations"][number], index: number) => (
                <div
                  key={index}
                  className="space-y-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0 pb-2 last:pb-0 mb-2 last:mb-0 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 dark:text-slate-400 min-w-[100px] transition-colors">
                      Ország:
                    </span>
                    <span className="text-slate-900 dark:text-slate-100 transition-colors">{loc.country}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 dark:text-slate-400 min-w-[100px] transition-colors">
                      Irányítószám:
                    </span>
                    <span className="text-slate-900 dark:text-slate-100 transition-colors">{loc.zipCode}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 dark:text-slate-400 min-w-[100px] transition-colors">Város:</span>
                    <span className="text-slate-900 dark:text-slate-100 transition-colors">{loc.city}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 dark:text-slate-400 min-w-[100px] transition-colors">Cím:</span>
                    <span className="text-slate-900 dark:text-slate-100 transition-colors">{loc.address}</span>
                  </div>
                </div>
              ),
            )
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-sm italic transition-colors">Nincs megadva cím.</p>
          )}
        </div>

        {/* Lábléc */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 transition-colors">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-slate-900 dark:bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
          >
            Bezárás
          </button>
        </div>
      </div>
    </Modal>
  );
}
