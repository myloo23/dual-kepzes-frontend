/**
 * Filter and sort constants
 */

import type { SortKey, DeadlineFilter, TabType } from '../types/ui.types';

// ============= Sort Options =============
export const SORT_OPTIONS: Record<SortKey, string> = {
    NEWEST: 'Legújabb',
    DEADLINE_ASC: 'Határidő (növekvő)',
    DEADLINE_DESC: 'Határidő (csökkenő)',
    TITLE_ASC: 'Cím (A-Z)',
} as const;

export const DEFAULT_SORT: SortKey = 'NEWEST';

// ============= Deadline Filter Options =============
export const DEADLINE_FILTER_OPTIONS: Record<DeadlineFilter, string> = {
    ALL: 'Összes',
    '7D': '7 napon belül',
    '30D': '30 napon belül',
    '90D': '90 napon belül',
    NO_DEADLINE: 'Nincs határidő',
} as const;

export const DEFAULT_DEADLINE_FILTER: DeadlineFilter = 'ALL';

// ============= Filter Defaults =============
export const FILTER_ALL = 'ALL';

export const DEFAULT_FILTERS = {
    search: '',
    city: FILTER_ALL,
    company: FILTER_ALL,
    tagCategory: FILTER_ALL,
    deadlineFilter: DEFAULT_DEADLINE_FILTER,
    activeOnly: true,
    selectedTags: [],
    sortKey: DEFAULT_SORT,
} as const;

// ============= Tab Configuration =============
export const USER_TABS: Record<TabType, string> = {
    STUDENT: 'Hallgatók',
    COMPANY_ADMIN: 'Cégadminok',
    UNIVERSITY_USER: 'Egyetemi felhasználók',
    INACTIVE_USER: 'Inaktív felhasználók',
} as const;

export const USER_TAB_ORDER: TabType[] = [
    'STUDENT',
    'COMPANY_ADMIN',
    'UNIVERSITY_USER',
    'INACTIVE_USER',
];
