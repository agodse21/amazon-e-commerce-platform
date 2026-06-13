import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import type { ProductSummary } from '@/types';

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;
const MAX_SUGGESTIONS = 6;

interface SearchSuggestionsState {
  suggestions: ProductSummary[];
  isLoading: boolean;
  error: boolean;
}

export const useSearchSuggestions = (query: string): SearchSuggestionsState => {
  const [suggestions, setSuggestions] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // Keep a ref to the latest AbortController so we can cancel in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsLoading(false);
      setError(false);
      return;
    }

    setIsLoading(true);
    setError(false);

    // Cancel any previous in-flight request immediately
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const res = await api.get<{ items: ProductSummary[] }>('/products', {
          params: { search: trimmed, limit: MAX_SUGGESTIONS },
          signal: controller.signal,
        });
        setSuggestions(res.data.items ?? []);
        setError(false);
      } catch (err: unknown) {
        // Axios names cancelled requests "CanceledError" (note the spelling)
        if ((err as { name?: string })?.name === 'CanceledError') return;
        setSuggestions([]);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return { suggestions, isLoading, error };
};
