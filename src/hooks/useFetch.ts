import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string, params: Record<string, any> = {}) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const serializedParams = JSON.stringify(params);

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // In a real app we'd use the configured axios instance, but here we construct the full URL or use baseURL
      const response = await axios.get(`http://localhost:3001${url}`, { 
        params: JSON.parse(serializedParams) 
      });
      setState({ data: response.data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: 'Failed to fetch data' });
    }
  }, [url, serializedParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}
