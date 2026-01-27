/**
 * Central export for all shared hooks
 */

export { useCRUD } from './useCRUD';
export type { UseCRUDReturn } from './useCRUD';

export { useModal } from './useModal';
export type { UseModalReturn } from './useModal';

export { useToast } from './useToast';
export type { UseToastReturn } from './useToast';

// Re-export existing hooks
// Note: useGeocoding moved to features/positions
// Note: useLocationGeocoding moved to features/applications
// Note: usePositionsFilters moved to features/positions
