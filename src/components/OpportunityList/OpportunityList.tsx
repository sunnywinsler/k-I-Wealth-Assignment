import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useOpportunities } from '../../hooks/useOpportunities';
import { OpportunityCard } from '../OpportunityCard';
import { SkeletonCard } from '../common/SkeletonCard';
import { simulateNextFailure } from '../../api';
import type { RiskProfile, SortOption } from '../../types';

const RISK_FILTER_OPTIONS: Array<RiskProfile | 'All'> = [
  'All',
  'Low',
  'Moderate',
  'Moderately High',
  'High',
];

const SORT_LABELS: Record<SortOption, string> = {
  interest_rate_asc: 'Interest Rate: Low to High',
  interest_rate_desc: 'Interest Rate: High to Low',
  max_amount_desc: 'Max Borrowing: High to Low',
  min_amount_asc: 'Min Borrowing: Low to High',
  ltv_desc: 'LTV: High to Low',
};

export function OpportunityList() {
  const {
    state,
    setScreen,
    setFilter,
    startCompare,
    clearCompare,
    toggleCompare,
    setCompareNotice,
  } = useApp();

  const reqQuery = useMemo(() => {
    return {
      amount: state.requirement?.amount,
      tenure: state.requirement?.tenure,
      search: state.filters.search,
      sort: state.filters.sort,
      riskFilter: state.filters.riskFilter || undefined,
    };
  }, [
    state.requirement?.amount,
    state.requirement?.tenure,
    state.filters.search,
    state.filters.sort,
    state.filters.riskFilter,
  ]);

  const { items, total, loading, error, retry } = useOpportunities(reqQuery);

  const handleSimulateError = () => {
    simulateNextFailure();
    retry();
  };

  const selectedCount = state.compareIds.length;

  return (
    <div className="opportunities-page">
      {/* Top Active Requirement Summary Banner */}
      {state.requirement && (
        <div className="requirement-summary-bar">
          <div className="summary-left">
            <span className="summary-pill">Active Search</span>
            <span className="summary-metric">
              Loan: <strong>₹{state.requirement.amount.toLocaleString('en-IN')}</strong>
            </span>
            <span className="summary-divider">•</span>
            <span className="summary-metric">
              Tenure: <strong>{state.requirement.tenure}M</strong>
            </span>
            <span className="summary-divider">•</span>
            <span className="summary-metric">
              Risk: <strong>{state.requirement.risk}</strong>
            </span>
            <span className="summary-divider">•</span>
            <span className="summary-metric">
              Collateral: <strong>{state.requirement.security_type}</strong>
            </span>
          </div>
          <button
            type="button"
            className="btn-link"
            onClick={() => setScreen('requirement')}
          >
            Edit Criteria ✏️
          </button>
        </div>
      )}

      {/* Compare Notice Toast / Banner */}
      {state.compareNotice && (
        <div className="feedback-notice-banner" role="alert">
          <div className="notice-content">
            <span className="notice-icon">ℹ️</span>
            <span>{state.compareNotice}</span>
          </div>
          <button
            type="button"
            className="notice-close"
            onClick={() => setCompareNotice(null)}
            aria-label="Dismiss notice"
          >
            ✕
          </button>
        </div>
      )}

      {/* Control Filters Bar */}
      <div className="controls-card">
        <div className="controls-top-row">
          {/* Search Input */}
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              id="opp-search-input"
              type="text"
              className="search-input"
              placeholder="Search by provider, product, or ID..."
              value={state.filters.search}
              onChange={(e) => setFilter({ search: e.target.value })}
            />
            {state.filters.search && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setFilter({ search: '' })}
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="sort-wrapper">
            <label htmlFor="opp-sort-select" className="sort-label">
              Sort By:
            </label>
            <select
              id="opp-sort-select"
              className="sort-select"
              value={state.filters.sort}
              onChange={(e) => setFilter({ sort: e.target.value as SortOption })}
            >
              {Object.entries(SORT_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Test Error Simulator */}
          <button
            type="button"
            className="btn-ghost-small"
            onClick={handleSimulateError}
            title="Simulate network failure to test error and retry state"
          >
            ⚡ Test Error State
          </button>
        </div>

        {/* Risk Filter Chips */}
        <div className="risk-filter-row">
          <span className="filter-row-label">Risk Profile:</span>
          <div className="chip-list" role="radiogroup" aria-label="Filter by risk profile">
            {RISK_FILTER_OPTIONS.map((opt) => {
              const isSelected =
                (opt === 'All' && !state.filters.riskFilter) ||
                state.filters.riskFilter === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`chip ${isSelected ? 'active' : ''}`}
                  onClick={() =>
                    setFilter({ riskFilter: opt === 'All' ? '' : (opt as RiskProfile) })
                  }
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="results-container">
        {/* Results Header */}
        <div className="results-meta-header">
          <h2 className="results-heading">Available Opportunities</h2>
          {!loading && !error && (
            <span className="results-count">
              Showing <strong>{total}</strong> matching {total === 1 ? 'provider' : 'providers'}
            </span>
          )}
        </div>

        {/* 1. Loading State */}
        {loading && (
          <div className="cards-grid" aria-busy="true" aria-label="Loading opportunities">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* 2. Error State */}
        {!loading && error && (
          <div className="error-state-card" role="alert">
            <div className="error-icon-box">⚠️</div>
            <h3 className="error-title">Unable to load opportunities</h3>
            <p className="error-message">{error}</p>
            <button
              type="button"
              className="btn-primary"
              onClick={retry}
              id="retry-fetch-btn"
            >
              ↻ Try Again
            </button>
          </div>
        )}

        {/* 3. Empty State */}
        {!loading && !error && items.length === 0 && (
          <div className="empty-state-card">
            <div className="empty-icon-box">🔎</div>
            <h3 className="empty-title">No opportunities found</h3>
            <p className="empty-desc">
              No lending partners matched your active search or filter criteria. Try adjusting your search keyword or clearing filters.
            </p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setFilter({ search: '', riskFilter: '' })}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 4. Loaded Cards Grid */}
        {!loading && !error && items.length > 0 && (
          <div className="cards-grid">
            {items.map((opp) => (
              <OpportunityCard key={opp.opportunity_id} opportunity={opp} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Comparison Drawer / Action Bar */}
      {selectedCount > 0 && (
        <aside className="compare-bar" aria-label="Opportunity comparison tray">
          <div className="compare-bar-inner">
            <div className="compare-bar-info">
              <span className="compare-badge-count">{selectedCount} of 3</span>
              <div className="compare-bar-text">
                <span className="compare-bar-title">Comparing Opportunities</span>
                <span className="compare-bar-hint">
                  {selectedCount === 1
                    ? 'Select at least 1 more opportunity to compare (2–3 max).'
                    : selectedCount === 3
                    ? 'Maximum limit of 3 reached.'
                    : 'Ready to compare side-by-side!'}
                </span>
              </div>
            </div>

            <div className="compare-bar-chips">
              {state.compareIds.map((id) => (
                <span key={id} className="selected-opp-chip">
                  {id}
                  <button
                    type="button"
                    onClick={() => toggleCompare(id)}
                    aria-label={`Remove ${id} from comparison`}
                    className="chip-remove"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="compare-bar-actions">
              <button
                type="button"
                className="btn-ghost-small"
                onClick={clearCompare}
              >
                Clear
              </button>
              <button
                type="button"
                className={`btn-compare-action ${selectedCount >= 2 ? 'ready' : ''}`}
                onClick={startCompare}
                id="view-comparison-btn"
              >
                Compare Now ({selectedCount}) →
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

export default OpportunityList;
