import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { AppScreen, RequirementValues, AppFilters } from '../types';

const MAX_COMPARE = 3;

interface AppState {
  screen: AppScreen;
  requirement: RequirementValues | null;
  filters: AppFilters;
  compareIds: string[];
  compareNotice: string | null;
  detailId: string | null;
  eligibilityOpportunityId: string | null;
}

type Action =
  | { type: 'SET_SCREEN'; screen: AppScreen }
  | { type: 'SET_REQUIREMENT'; values: RequirementValues }
  | { type: 'SET_FILTER'; patch: Partial<AppFilters> }
  | { type: 'TOGGLE_COMPARE'; id: string }
  | { type: 'CLEAR_COMPARE' }
  | { type: 'SET_COMPARE_NOTICE'; notice: string | null }
  | { type: 'SET_DETAIL'; id: string | null }
  | { type: 'SET_ELIGIBILITY_OPP'; id: string | null };

const DEFAULT_FILTERS: AppFilters = { search: '', sort: 'interest_rate_asc', riskFilter: '' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SCREEN': return { ...state, screen: action.screen };
    case 'SET_REQUIREMENT': return { ...state, requirement: action.values };
    case 'SET_FILTER': return { ...state, filters: { ...state.filters, ...action.patch } };
    case 'TOGGLE_COMPARE': {
      const ids = state.compareIds;
      if (ids.includes(action.id)) {
        return {
          ...state,
          compareIds: ids.filter((x) => x !== action.id),
          compareNotice: null,
        };
      }
      if (ids.length >= MAX_COMPARE) {
        return {
          ...state,
          compareNotice: `You can compare a maximum of ${MAX_COMPARE} opportunities at a time. Deselect one to add another.`,
        };
      }
      return {
        ...state,
        compareIds: [...ids, action.id],
        compareNotice: null,
      };
    }
    case 'CLEAR_COMPARE': return { ...state, compareIds: [], compareNotice: null };
    case 'SET_COMPARE_NOTICE': return { ...state, compareNotice: action.notice };
    case 'SET_DETAIL': return { ...state, detailId: action.id };
    case 'SET_ELIGIBILITY_OPP': return { ...state, eligibilityOpportunityId: action.id };
    default: return state;
  }
}

interface AppContextValue {
  state: AppState;
  maxCompare: number;
  setScreen: (s: AppScreen) => void;
  setRequirement: (v: RequirementValues) => void;
  setFilter: (p: Partial<AppFilters>) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  setCompareNotice: (notice: string | null) => void;
  startCompare: () => boolean;
  setDetail: (id: string | null) => void;
  setEligibilityOpp: (id: string | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    screen: 'requirement',
    requirement: null,
    filters: DEFAULT_FILTERS,
    compareIds: [],
    compareNotice: null,
    detailId: null,
    eligibilityOpportunityId: null,
  });

  const setScreen = useCallback((s: AppScreen) => dispatch({ type: 'SET_SCREEN', screen: s }), []);
  const setRequirement = useCallback((v: RequirementValues) => dispatch({ type: 'SET_REQUIREMENT', values: v }), []);
  const setFilter = useCallback((p: Partial<AppFilters>) => dispatch({ type: 'SET_FILTER', patch: p }), []);
  const toggleCompare = useCallback((id: string) => dispatch({ type: 'TOGGLE_COMPARE', id }), []);
  const clearCompare = useCallback(() => dispatch({ type: 'CLEAR_COMPARE' }), []);
  const setCompareNotice = useCallback((notice: string | null) => dispatch({ type: 'SET_COMPARE_NOTICE', notice }), []);
  const setDetail = useCallback((id: string | null) => dispatch({ type: 'SET_DETAIL', id }), []);
  const setEligibilityOpp = useCallback((id: string | null) => dispatch({ type: 'SET_ELIGIBILITY_OPP', id }), []);

  const startCompare = useCallback((): boolean => {
    if (state.compareIds.length < 2) {
      dispatch({
        type: 'SET_COMPARE_NOTICE',
        notice: 'Please select at least 2 opportunities to view side-by-side comparison (up to 3).',
      });
      return false;
    }
    dispatch({ type: 'SET_COMPARE_NOTICE', notice: null });
    dispatch({ type: 'SET_SCREEN', screen: 'comparison' });
    return true;
  }, [state.compareIds.length]);

  return (
    <AppContext.Provider
      value={{
        state,
        maxCompare: MAX_COMPARE,
        setScreen,
        setRequirement,
        setFilter,
        toggleCompare,
        clearCompare,
        setCompareNotice,
        startCompare,
        setDetail,
        setEligibilityOpp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
