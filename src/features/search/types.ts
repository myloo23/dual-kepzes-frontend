export type SearchResultType = 'page' | 'position' | 'company' | 'news';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string; // e.g. company name for a job, or short description
  link: string;
  icon?: React.ReactNode;
}

export interface SearchState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openSearch: () => void;
  closeSearch: () => void;
}
