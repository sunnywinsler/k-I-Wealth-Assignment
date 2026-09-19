import { useState, useCallback } from 'react';
import { postEligibilityCheck } from '../api';
import type { EligibilityRequest, EligibilityResult } from '../types';

interface State { result: EligibilityResult | null; loading: boolean; error: string | null; }

export function useEligibility() {
  const [state, setState] = useState<State>({ result: null, loading: false, error: null });

  const check = useCallback((req: EligibilityRequest) => {
    setState({ result: null, loading: true, error: null });
    postEligibilityCheck(req)
      .then((result) => setState({ result, loading: false, error: null }))
      .catch((e: Error) => setState({ result: null, loading: false, error: e.message }));
  }, []);

  const reset = useCallback(() => setState({ result: null, loading: false, error: null }), []);
  return { ...state, check, reset };
}
