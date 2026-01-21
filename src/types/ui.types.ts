/**
 * UI component prop types and interfaces
 */

// ============= Modal Types =============
export interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface FormModalProps<T> extends BaseModalProps {
    onSave: (data: T) => void | Promise<void>;
    initialData?: T | null;
}

// ============= Table Types =============
export interface TableColumn<T> {
    key: keyof T | string;
    label: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

export interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
}

// ============= Feedback Types =============
export interface FeedbackMessage {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

export interface FeedbackMessagesProps {
    error?: string | null;
    success?: string | null;
    warning?: string | null;
    info?: string | null;
}

// ============= Tab Types =============
export type TabType = 'STUDENT' | 'COMPANY_ADMIN' | 'UNIVERSITY_USER' | 'INACTIVE_USER';

export interface TabConfig {
    key: TabType;
    label: string;
}

// ============= Filter Types =============
export type SortKey = 'NEWEST' | 'DEADLINE_ASC' | 'DEADLINE_DESC' | 'TITLE_ASC';
export type DeadlineFilter = 'ALL' | '7D' | '30D' | '90D' | 'NO_DEADLINE';

export interface FilterState {
    search: string;
    city: string;
    company: string;
    tagCategory: string;
    deadlineFilter: DeadlineFilter;
    activeOnly: boolean;
    selectedTags: string[];
    sortKey: SortKey;
}

// ============= Pagination Types =============
export interface PaginationState {
    page: number;
    pageSize: number;
    total: number;
}

export interface PaginationProps extends PaginationState {
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}
