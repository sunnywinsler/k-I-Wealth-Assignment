import { useApp } from '../../context/AppContext';
import { useOpportunity } from '../../hooks/useOpportunity';
import { Modal } from '../common/Modal';
import { RiskBadge } from '../common/Badge';

function formatINR(val: number): string {
  return `₹${val.toLocaleString('en-IN')}`;
}

export function OpportunityDetail() {
  const { state, setDetail, toggleCompare, setEligibilityOpp } = useApp();
  const { item: opp, loading, error, retry } = useOpportunity(state.detailId);

  const isOpen = state.detailId !== null;
  const onClose = () => setDetail(null);

  const reqAmount = state.requirement?.amount ?? opp?.min_amount ?? 500000;
  const isSelected = opp ? state.compareIds.includes(opp.opportunity_id) : false;

  // Approximate monthly interest: (Principal * Rate / 100) / 12
  const approxMonthlyInterest = opp
    ? Math.round((reqAmount * (opp.interest_rate / 100)) / 12)
    : 0;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={opp ? `${opp.provider} — Detailed Overview` : 'Opportunity Details'}
      width="720px"
    >
      {loading && (
        <div className="modal-loading-state">
          <div className="spinner" />
          <p>Retrieving opportunity details...</p>
        </div>
      )}

      {error && (
        <div className="modal-error-state">
          <p className="error-text">Failed to load opportunity: {error}</p>
          <button type="button" className="btn-secondary" onClick={retry}>
            Retry Loading
          </button>
        </div>
      )}

      {opp && !loading && (
        <div className="opportunity-detail-content">
          <div className="detail-header-row">
            <div>
              <span className="product-tag">{opp.product}</span>
              <h3 className="detail-provider-title">{opp.provider}</h3>
              <p className="detail-opp-code">Opportunity ID: {opp.opportunity_id}</p>
            </div>
            <div className="detail-badges">
              <RiskBadge risk={opp.risk_profile} />
            </div>
          </div>

          <div className="detail-key-metrics">
            <div className="key-metric-card highlight-card">
              <span className="key-metric-label">Annual Interest Rate</span>
              <span className="key-metric-value">{opp.interest_rate.toFixed(2)}%</span>
              <span className="key-metric-hint">Fixed rate p.a.</span>
            </div>
            <div className="key-metric-card">
              <span className="key-metric-label">Loan to Value (LTV)</span>
              <span className="key-metric-value">{opp.ltv}%</span>
              <span className="key-metric-hint">Against eligible collateral</span>
            </div>
            <div className="key-metric-card">
              <span className="key-metric-label">Processing Fee</span>
              <span className="key-metric-value">{opp.processing_fee.toFixed(2)}%</span>
              <span className="key-metric-hint">One-time processing cost</span>
            </div>
          </div>

          <div className="detail-specs-table">
            <div className="specs-row">
              <span className="spec-label">Minimum Borrowing Limit</span>
              <span className="spec-val">{formatINR(opp.min_amount)}</span>
            </div>
            <div className="specs-row">
              <span className="spec-label">Maximum Borrowing Limit</span>
              <span className="spec-val">{formatINR(opp.max_amount)}</span>
            </div>
            <div className="specs-row">
              <span className="spec-label">Tenure Permitted</span>
              <span className="spec-val">{opp.min_tenure_months} to {opp.max_tenure_months} Months</span>
            </div>
            <div className="specs-row">
              <span className="spec-label">Risk Profile Category</span>
              <span className="spec-val">{opp.risk_profile}</span>
            </div>
          </div>

          <div className="detail-simulation-box">
            <h4 className="sim-title">Estimated Monthly Cost Calculation</h4>
            <p className="sim-desc">
              Based on required amount of <strong>{formatINR(reqAmount)}</strong>:
            </p>
            <div className="sim-stats">
              <div className="sim-stat">
                <span className="sim-stat-label">Estimated Monthly Interest</span>
                <span className="sim-stat-val">₹{approxMonthlyInterest.toLocaleString('en-IN')}/mo</span>
              </div>
              <div className="sim-stat">
                <span className="sim-stat-label">Upfront Processing Fee</span>
                <span className="sim-stat-val">₹{Math.round((reqAmount * opp.processing_fee) / 100).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="modal-actions-row">
            <button
              type="button"
              className={`btn-outline ${isSelected ? 'active' : ''}`}
              onClick={() => toggleCompare(opp.opportunity_id)}
            >
              {isSelected ? '✓ In Comparison List' : '+ Add to Comparison'}
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                onClose();
                setEligibilityOpp(opp.opportunity_id);
              }}
            >
              Check Eligibility for this Offer →
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default OpportunityDetail;
