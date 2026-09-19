import { useState, useEffect, useCallback } from 'react';
import { postCompare } from '../api';
import type { Opportunity } from '../types';

interface State { items: Opportunity[]; loading: boolean; error: string | null; }

export function useCompare(ids: string[]) {
  const [state, setState] = useState<State>({ items: [], loading: false, error: null });

  const fetch = useCallback(() => {
    if (ids.length === 0) { setState({ items: [], loading: false, error: null }); return; }
    setState((s) => ({ ...s, loading: true, error: null }));
    postCompare({ opportunity_ids: ids })
      .then((res) => setState({ items: res.items, loading: false, error: null }))
      .catch((e: Error) => setState({ items: [], loading: false, error: e.message }));
  }, [ids.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);
  return { ...state, retry: fetch };
}
