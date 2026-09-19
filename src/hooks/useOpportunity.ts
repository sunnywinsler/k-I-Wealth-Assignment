import { useState, useEffect, useCallback } from 'react';
import { getOpportunityById } from '../api';
import type { Opportunity } from '../types';

interface State { item: Opportunity | null; loading: boolean; error: string | null; }

export function useOpportunity(id: string | null) {
  const [state, setState] = useState<State>({ item: null, loading: false, error: null });

  const fetch = useCallback(() => {
    if (!id) return;
    setState({ item: null, loading: true, error: null });
    getOpportunityById(id)
      .then((item) => setState({ item, loading: false, error: null }))
      .catch((e: Error) => setState({ item: null, loading: false, error: e.message }));
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);
  return { ...state, retry: fetch };
}
