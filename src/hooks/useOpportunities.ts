import { useState, useEffect, useCallback } from 'react';
import { getOpportunities } from '../api';
import type { Opportunity, OpportunitiesRequest } from '../types';

interface State { items: Opportunity[]; total: number; loading: boolean; error: string | null; }

export function useOpportunities(req: OpportunitiesRequest) {
  const [state, setState] = useState<State>({ items: [], total: 0, loading: true, error: null });

  const fetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    getOpportunities(req)
      .then((res) => setState({ items: res.items, total: res.total, loading: false, error: null }))
      .catch((e: Error) => setState({ items: [], total: 0, loading: false, error: e.message }));
  }, [JSON.stringify(req)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  return { ...state, retry: fetch };
}
