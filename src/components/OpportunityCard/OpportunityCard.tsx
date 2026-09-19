import type { Opportunity } from '../../types';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../common/Badge';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

function formatINR(val: number): string {
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(val % 10000000 === 0 ? 0 : 2)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)} Lakh`;
  }
  return `₹${val.toLocaleString('en-IN')}`;
}

export function OpportunityCard({ opportunity: opp }: OpportunityCardProps) {
  const { state, toggleCompare, setDetail, setEligibilityOpp } = useApp();

  const isSelected = state.compareIds.includes(opp.opportunity_id);

  // Determine if this opportunity matches requirement parameters
  const req = state.requirement;
  const isAmountMatch = !req || (req.amount >= opp.min_amount && req.amount <= opp.max_amount);
  const isTenureMatch = !req || (req.tenure >= opp.min_tenure_months && req.tenure <= opp.max_tenure_months);

  return (
    <div className={`opportunity-card ${isSelected ? 'selected' : ''}`}>
      <div className="card-top-bar">
        <div className="provider-info">
          <span className="product-tag">{opp.product}</span>
          <h3 className="provider-name">{opp.provider}</h3>
          <span className="opp-id">{opp.opportunity_id}</span>
        </div>
        <div className="card-badges">
          <RiskBadge risk={opp.risk_profile} />
          {isAmountMatch && isTenureMatch && req && (
            <span className="badge badge-fit">Fits Profile</span>
          )}
        </div>
      </div>

      <div className="card-rate-box">
        <div className="rate-item">
          <span className="rate-label">Interest Rate</span>
          <span className="rate-value highlight">{opp.interest_rate.toFixed(2)}% <span className="rate-period">p.a.</span></span>
        </div>
        <div className="rate-item">
          <span className="rate-label">Max LTV</span>
          <span className="rate-value">{opp.ltv}%</span>
        </div>
        <div className="rate-item">
          <span className="rate-label">Proc. Fee</span>
          <span className="rate-value">{opp.processing_fee.toFixed(2)}%</span>
        </div>
      </div>

      <div className="card-metrics-grid">
        <div className="metric">
          <span className="metric-title">Borrowing Limit</span>
          <span className="metric-text">{formatINR(opp.min_amount)} – {formatINR(opp.max_amount)}</span>
        </div>
        <div className="metric">
          <span className="metric-title">Tenure Range</span>
          <span className="metric-text">{opp.min_tenure_months} – {opp.max_tenure_months} Months</span>
        </div>
      </div>

      <div className="card-footer">
        <label className="compare-checkbox-label">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleCompare(opp.opportunity_id)}
            className="compare-checkbox"
          />
          <span className="compare-text">
            {isSelected ? 'Selected' : 'Compare'}
          </span>
        </label>

        <div className="card-actions">
          <button
            type="button"
            className="btn-outline-small"
            onClick={() => setDetail(opp.opportunity_id)}
            aria-label={`View details for ${opp.provider}`}
          >
            Details
          </button>
          <button
            type="button"
            className="btn-primary-small"
            onClick={() => setEligibilityOpp(opp.opportunity_id)}
          >
            Check Eligibility
          </button>
        </div>
      </div>
    </div>
  );
}

export default OpportunityCard;
