import { useApp } from '../../context/AppContext';
import { useCompare } from '../../hooks/useCompare';
import { RiskBadge } from '../common/Badge';

function formatINR(val: number): string {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
  return `₹${val.toLocaleString('en-IN')}`;
}

export function ComparisonView() {
  const { state, setScreen, toggleCompare, setEligibilityOpp, clearCompare } = useApp();
  const { items, loading, error, retry } = useCompare(state.compareIds);

  const count = state.compareIds.length;

  if (count < 2) {
    return (
      <div className="comparison-insufficient-container">
        <div className="insufficient-card">
          <span className="insufficient-icon">⚖️</span>
          <h2>At least 2 opportunities required</h2>
          <p>
            You currently have {count} opportunity selected for comparison. Please select 2 or 3 opportunities from the listing to view a side-by-side comparison.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setScreen('listing')}
          >
            ← Return to Opportunities
          </button>
        </div>
      </div>
    );
  }

  // Determine best-in-class values among compared items for highlighting
  const lowestRate = items.length > 0 ? Math.min(...items.map((i) => i.interest_rate)) : null;
  const highestLtv = items.length > 0 ? Math.max(...items.map((i) => i.ltv)) : null;
  const highestMaxAmount = items.length > 0 ? Math.max(...items.map((i) => i.max_amount)) : null;
  const lowestFee = items.length > 0 ? Math.min(...items.map((i) => i.processing_fee)) : null;

  return (
    <div className="comparison-page">
      <div className="comparison-top-nav">
        <button
          type="button"
          className="btn-link-back"
          onClick={() => setScreen('listing')}
        >
          ← Back to Listing
        </button>
        <div className="comparison-title-box">
          <h1 className="comparison-heading">Side-by-Side Opportunity Comparison</h1>
          <p className="comparison-subheading">
            Evaluating {items.length} offers against key financial terms and risk parameters
          </p>
        </div>
        <button
          type="button"
          className="btn-ghost-small"
          onClick={() => {
            clearCompare();
            setScreen('listing');
          }}
        >
          Clear All
        </button>
      </div>

      {loading && (
        <div className="comparison-loading-box">
          <div className="spinner" />
          <p>Analyzing comparison data across lenders...</p>
        </div>
      )}

      {error && (
        <div className="error-state-card" role="alert">
          <h3>Failed to load comparison</h3>
          <p>{error}</p>
          <button type="button" className="btn-primary" onClick={retry}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && items.length >= 2 && (
        <>
        <div className="comparison-matrix-wrapper comparison-table-desktop">
          <table className="comparison-table" role="table">
            <thead>
              <tr>
                <th className="feature-col-header" scope="col">
                  Lender & Product
                </th>
                {items.map((opp) => (
                  <th key={opp.opportunity_id} className="item-col-header" scope="col">
                    <div className="compare-card-head">
                      <button
                        type="button"
                        className="btn-remove-compare"
                        onClick={() => toggleCompare(opp.opportunity_id)}
                        aria-label={`Remove ${opp.provider} from comparison`}
                        title="Remove from comparison"
                      >
                        ✕
                      </button>
                      <span className="product-tag">{opp.product}</span>
                      <h3 className="compare-provider-name">{opp.provider}</h3>
                      <span className="compare-opp-id">{opp.opportunity_id}</span>
                      <RiskBadge risk={opp.risk_profile} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Interest Rate */}
              <tr>
                <td className="feature-cell">
                  <strong>Interest Rate (p.a.)</strong>
                  <span className="feature-note">Lower rate saves borrowing cost</span>
                </td>
                {items.map((opp) => {
                  const isBest = opp.interest_rate === lowestRate;
                  return (
                    <td
                      key={opp.opportunity_id}
                      className={`value-cell ${isBest ? 'best-value' : ''}`}
                    >
                      <div className="metric-display">
                        <span className="metric-main-value">
                          {opp.interest_rate.toFixed(2)}%
                        </span>
                        {isBest && <span className="best-tag">Lowest Rate ★</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 2: Loan to Value (LTV) */}
              <tr>
                <td className="feature-cell">
                  <strong>Max Loan-to-Value (LTV)</strong>
                  <span className="feature-note">% of portfolio value available as loan</span>
                </td>
                {items.map((opp) => {
                  const isBest = opp.ltv === highestLtv;
                  return (
                    <td
                      key={opp.opportunity_id}
                      className={`value-cell ${isBest ? 'best-value' : ''}`}
                    >
                      <div className="metric-display">
                        <span className="metric-main-value">{opp.ltv}%</span>
                        {isBest && <span className="best-tag">Highest LTV ★</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 3: Maximum Borrowing Limit */}
              <tr>
                <td className="feature-cell">
                  <strong>Maximum Amount</strong>
                  <span className="feature-note">Ceiling on available funding</span>
                </td>
                {items.map((opp) => {
                  const isBest = opp.max_amount === highestMaxAmount;
                  return (
                    <td
                      key={opp.opportunity_id}
                      className={`value-cell ${isBest ? 'best-value' : ''}`}
                    >
                      <div className="metric-display">
                        <span className="metric-main-value">{formatINR(opp.max_amount)}</span>
                        {isBest && <span className="best-tag">Highest Cap ★</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 4: Minimum Borrowing Limit */}
              <tr>
                <td className="feature-cell">
                  <strong>Minimum Amount</strong>
                  <span className="feature-note">Minimum ticket size</span>
                </td>
                {items.map((opp) => (
                  <td key={opp.opportunity_id} className="value-cell">
                    <span className="metric-main-value">{formatINR(opp.min_amount)}</span>
                  </td>
                ))}
              </tr>

              {/* Row 5: Tenure Window */}
              <tr>
                <td className="feature-cell">
                  <strong>Tenure Window</strong>
                  <span className="feature-note">Flexibility in repayment span</span>
                </td>
                {items.map((opp) => (
                  <td key={opp.opportunity_id} className="value-cell">
                    <span className="metric-main-value">
                      {opp.min_tenure_months} – {opp.max_tenure_months} Months
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 6: Processing Fee */}
              <tr>
                <td className="feature-cell">
                  <strong>Processing Fee</strong>
                  <span className="feature-note">Upfront administrative levy</span>
                </td>
                {items.map((opp) => {
                  const isBest = opp.processing_fee === lowestFee;
                  return (
                    <td
                      key={opp.opportunity_id}
                      className={`value-cell ${isBest ? 'best-value' : ''}`}
                    >
                      <div className="metric-display">
                        <span className="metric-main-value">
                          {opp.processing_fee.toFixed(2)}%
                        </span>
                        {isBest && <span className="best-tag">Lowest Fee ★</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 7: Action Row */}
              <tr className="action-row">
                <td className="feature-cell">
                  <strong>Check Your Eligibility</strong>
                </td>
                {items.map((opp) => (
                  <td key={opp.opportunity_id} className="value-cell">
                    <button
                      type="button"
                      className="btn-primary full-width"
                      onClick={() => setEligibilityOpp(opp.opportunity_id)}
                    >
                      Verify Eligibility →
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="comparison-cards-mobile" aria-label="Opportunity comparison cards">
          {items.map((opp) => (
            <article key={opp.opportunity_id} className="mobile-compare-card">
              <div className="compare-card-head">
                <button
                  type="button"
                  className="btn-remove-compare"
                  onClick={() => toggleCompare(opp.opportunity_id)}
                  aria-label={`Remove ${opp.provider} from comparison`}
                >
                  ✕
                </button>
                <span className="product-tag">{opp.product}</span>
                <h3 className="compare-provider-name">{opp.provider}</h3>
                <span className="compare-opp-id">{opp.opportunity_id}</span>
                <RiskBadge risk={opp.risk_profile} />
              </div>
              <dl className="mobile-compare-metrics">
                <div className={opp.interest_rate === lowestRate ? 'best-value' : ''}>
                  <dt>Interest Rate (p.a.)</dt>
                  <dd>
                    {opp.interest_rate.toFixed(2)}%
                    {opp.interest_rate === lowestRate && <span className="best-tag">Lowest Rate ★</span>}
                  </dd>
                </div>
                <div className={opp.ltv === highestLtv ? 'best-value' : ''}>
                  <dt>Max LTV</dt>
                  <dd>
                    {opp.ltv}%
                    {opp.ltv === highestLtv && <span className="best-tag">Highest LTV ★</span>}
                  </dd>
                </div>
                <div className={opp.max_amount === highestMaxAmount ? 'best-value' : ''}>
                  <dt>Maximum Amount</dt>
                  <dd>
                    {formatINR(opp.max_amount)}
                    {opp.max_amount === highestMaxAmount && <span className="best-tag">Highest Cap ★</span>}
                  </dd>
                </div>
                <div>
                  <dt>Minimum Amount</dt>
                  <dd>{formatINR(opp.min_amount)}</dd>
                </div>
                <div>
                  <dt>Tenure Window</dt>
                  <dd>{opp.min_tenure_months} – {opp.max_tenure_months} Months</dd>
                </div>
                <div className={opp.processing_fee === lowestFee ? 'best-value' : ''}>
                  <dt>Processing Fee</dt>
                  <dd>
                    {opp.processing_fee.toFixed(2)}%
                    {opp.processing_fee === lowestFee && <span className="best-tag">Lowest Fee ★</span>}
                  </dd>
                </div>
              </dl>
              <button
                type="button"
                className="btn-primary full-width"
                onClick={() => setEligibilityOpp(opp.opportunity_id)}
              >
                Verify Eligibility →
              </button>
            </article>
          ))}
        </div>
        </>
      )}
    </div>
  );
}

export default ComparisonView;
