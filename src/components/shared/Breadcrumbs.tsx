import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Auto-generate breadcrumbs from current path if items not provided
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Főoldal', path: '/' }
  ];

  // Map of path segments to Hungarian labels
  const labelMap: Record<string, string> = {
    'admin': 'Admin',
    'student': 'Hallgató',
    'hr': 'HR',
    'mentor': 'Mentor',
    'teacher': 'Oktató',
    'university': 'Egyetem',
    'positions': 'Állások',
    'companies': 'Cégek',
    'applications': 'Jelentkezések',
    'news': 'Hírek',
    'profile': 'Profil',
    'settings': 'Beállítások',
    'dashboard': 'Irányítópult',
    'worklog': 'Munkanapló',
    'evaluations': 'Értékelések',
  };

  let currentPath = '';
  paths.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      label,
      path: index === paths.length - 1 ? undefined : currentPath
    });
  });

  return breadcrumbs;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const location = useLocation();
  const breadcrumbs = items || generateBreadcrumbs(location.pathname);

  // Don't show breadcrumbs on home page
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2 text-sm', className)}>
      <ol className="flex items-center gap-2">
        {breadcrumbs.map((item, index) => {
          const isFirst = index === 0;

          return (
            <li key={item.path || item.label} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
              )}
              
              {item.path ? (
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-1.5 hover:text-dkk-blue transition-colors',
                    isFirst ? 'text-slate-600' : 'text-slate-500'
                  )}
                >
                  {isFirst && <Home className="h-4 w-4" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="text-slate-900 font-medium flex items-center gap-1.5">
                  {isFirst && <Home className="h-4 w-4" />}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
