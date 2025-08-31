// hooks/useDebounce.ts
import { useEffect, useState } from 'react';

/**
 * Custom hook that debounces a value by a specified delay
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Alternative hook for search functionality with additional features
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds
 * @returns Object with search value, debounced value, and setter
 */
export function useSearchDebounce(initialValue: string = '', delay: number = 500) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const debouncedSearchValue = useDebounce(searchValue, delay);

  const clearSearch = () => setSearchValue('');

  return {
    searchValue,
    debouncedSearchValue,
    setSearchValue,
    clearSearch,
    isSearching: searchValue !== debouncedSearchValue,
  };
}