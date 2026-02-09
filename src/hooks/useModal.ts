/**
 * Generic Modal hook
 * Provides reusable state management for modals
 */

import { useState, useCallback } from "react";

export interface UseModalReturn<T = unknown> {
  isOpen: boolean;
  data: T | null;
  open: (initialData?: T) => void;
  close: () => void;
  setData: (data: T | null) => void;
}

export function useModal<T = unknown>(
  initialData: T | null = null,
): UseModalReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(initialData);

  const open = useCallback((initialData?: T) => {
    if (initialData !== undefined) {
      setData(initialData);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Don't clear data immediately to allow for exit animations
    setTimeout(() => setData(null), 300);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    setData,
  };
}
