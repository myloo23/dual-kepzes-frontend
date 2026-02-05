import { Filter, Users } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface NotificationFiltersProps {
  filters: {
    role: string;
    type: string;
  };
  onFilterChange: (key: 'role' | 'type', value: string) => void;
}

export function NotificationFilters({ filters, onFilterChange }: NotificationFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative">
        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <select
          value={filters.role}
          onChange={(e) => onFilterChange('role', e.target.value)}
          className={cn(
            "appearance-none pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
            "hover:bg-slate-50 cursor-pointer min-w-[200px]"
          )}
        >
          <option value="">Összes szerepkör</option>
          <option value="ROLE_STUDENT">Diák</option>
          <option value="ROLE_COMPANY_ADMIN">Cég</option>
          <option value="ROLE_UNIVERSITY_USER">Egyetem</option>
          <option value="ROLE_SYSTEM_ADMIN">Rendszergazda</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className={cn(
            "appearance-none pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
            "hover:bg-slate-50 cursor-pointer min-w-[200px]"
          )}
        >
          <option value="">Összes típus</option>
          <option value="SYSTEM">Rendszerüzenet</option>
          <option value="DATA_CHANGE">Adatmódosítás</option>
          <option value="APPLICATION">Jelentkezés</option>
          <option value="POSITION">Pozíció</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
