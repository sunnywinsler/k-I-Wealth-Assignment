import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useEligibility } from '../../hooks/useEligibility';
import { OPPORTUNITIES } from '../../data/opportunities';
import { Modal } from '../common/Modal';
import { StatusBadge, RiskBadge } from '../common/Badge';
import type { RiskProfile } from '../../types';

export function EligibilityCheck() {
  const { state, setEligibilityOpp, setScreen } = useApp();
  const { result, loading, error, check, reset } = useEligibility();

  const oppId = state.eligibilityOpportunityId;
  const opp = OPPORTUNITIES.find((o) => o.opportunity_id === oppId);

  const [amount, setAmount] = useState<number>(state.requirement?.amount ?? 1000000);
  const [tenure, setTenure] = useState<number>(state.requirement?.tenure ?? 24);
  const [risk, setRisk] = useState<RiskProfile>(state.requirement?.risk ?? 'Moderate');
  const [securityType, setSecurityType] = useState<string>(state.requirement?.security_type ?? 'Equity Shares');
  const [applied, setApplied] = useState<boolean>(false);
  const [applicationRef, setApplicationRef] = useState<string | null>(null);

  // Sync state if initial requirement or opp changes
  useEffect(() => {
    if (state.requirement) {
      setAmount(state.requirement.amount);
      setTenure(state.requirement.tenure);
      setRisk(state.requirement.risk);
      setSecurityType(state.requirement.security_type);
    }
    setApplied(false);
    setApplicationRef(null);
    reset();
  }, [oppId, state.requirement, reset]);

  const handleEvaluate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!oppId) return;
    setApplied(false);
    check({
      opportunity_id: oppId,
      amount,
      tenure,
      risk,
      security_type: securityType,
    });
  };

  const handleClose = () => {
    setEligibilityOpp(null);
    reset();
    setApplied(false);
    setApplicationRef(null);
  };

  if (!oppId || !opp) return null;

  return (
    <Modal
      open={Boolean(oppId)}
      onClose={handleClose}
      title={`Eligibility Verification — ${opp.provider}`}
      width="680px"
    >
      <div className="eligibility-container">
        {/* Opportunity Summary Card */}
        <div className="eligibility-opp-banner">
          <div className="banner-details">
            <span className="product-tag">{opp.product}</span>
            <h3 className="banner-provider">{opp.provider}</h3>
            <span className="banner-terms">
              {opp.interest_rate.toFixed(2)}% p.a. • LTV {opp.ltv}% • Limits: ₹{(opp.min_amount / 100000).toFixed(1)}L – ₹{(opp.max_amount / 100000).toFixed(1)}L
            </span>
          </div>
          <RiskBadge risk={opp.risk_profile} />
        </div>

        {/* Input Parameters Form (allows adjusting in-place) */}
        <form onSubmit={handleEvaluate} className="eligibility-params-form">
          <div className="form-grid-2">
            <div className="form-group-compact">
              <label htmlFor="check-amount" className="form-label-small">
                Amount Requested (INR)
              </label>
              <input
                id="check-amount"
                type="number"
                min={10000}
                step={25000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="form-input-compact"
                required
              />
            </div>
            <div className="form-group-compact">
              <label htmlFor="check-tenure" className="form-label-small">
                Tenure (Months)
              </label>
              <input
                id="check-tenure"
                type="number"
                min={3}
                max={120}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="form-input-compact"
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group-compact">
              <label htmlFor="check-risk" className="form-label-small">
                Risk Preference
              </label>
              <select
                id="check-risk"
                value={risk}
                onChange={(e) => setRisk(e.target.value as RiskProfile)}
                className="form-select-compact"
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="Moderately High">Moderately High</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>
            <div className="form-group-compact">
              <label htmlFor="check-collateral" className="form-label-small">
                Collateral Type
              </label>
              <select
                id="check-collateral"
                value={securityType}
                onChange={(e) => setSecurityType(e.target.value)}
                className="form-select-compact"
              >
                <option value="Equity Shares">Equity Shares</option>
                <option value="Mutual Funds">Mutual Funds</option>
                <option value="Bonds & Debentures">Bonds & Debentures</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn-secondary full-width"
            disabled={loading}
            id="run-eligibility-btn"
          >
            {loading ? 'Evaluating Eligibility Criteria...' : 'Run Eligibility Check ⚡'}
          </button>
        </form>

        {/* Loading Spinner */}
        {loading && (
          <div className="eligibility-evaluating-box">
            <div className="spinner" />
            <p>Assessing loan requirements against {opp.provider}'s policy engine...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="eligibility-error-banner" role="alert">
            <p>Verification service error: {error}</p>
            <button type="button" className="btn-secondary" onClick={() => handleEvaluate()}>
              Retry
            </button>
          </div>
        )}

        {/* Result Outcome Display */}
        {result && !loading && (
          <div className={`eligibility-result-card result-${result.status}`}>
            <div className="result-header">
              <div className="result-status-group">
                <StatusBadge status={result.status} />
                <h4 className="result-headline">
                  {result.status === 'eligible' && 'Great News! You Are Eligible'}
                  {result.status === 'conditional' && 'Conditionally Approved'}
                  {result.status === 'not_eligible' && 'Currently Ineligible'}
                </h4>
              </div>
            </div>

            {/* Reasons List */}
            {result.reasons.length > 0 && (
              <div className="result-reasons-box">
                <span className="reasons-label">Key Assessment Points:</span>
                <ul className="reasons-list">
                  {result.reasons.map((r, idx) => (
                    <li key={idx} className="reason-item">
                      {result.status === 'not_eligible' ? '✕' : 'ℹ️'} {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Max supported amount info */}
            {result.max_supported_amount && (
              <div className="result-meta-row">
                <span className="meta-label">Maximum Supported Loan by Lender:</span>
                <strong className="meta-val">₹{result.max_supported_amount.toLocaleString('en-IN')}</strong>
              </div>
            )}

            {/* Next Step / Action */}
            <div className="result-action-section">
              <div className="next-step-box">
                <span className="next-step-title">Recommended Next Step:</span>
                <p className="next-step-text">{result.next_step}</p>
              </div>

              {applied ? (
                <div className="application-success-banner" role="status">
                  <span className="success-icon">🎉</span>
                  <div>
                    <strong>Application Initiated Successfully!</strong>
                    <p>Reference: {applicationRef}. A representative will reach out shortly.</p>
                  </div>
                </div>
              ) : (
                <div className="action-button-group">
                  {result.status === 'eligible' && (
                    <button
                      type="button"
                      className="btn-primary-large"
                      onClick={() => {
                        setApplicationRef(`APP-${opp.opportunity_id}-${Math.floor(1000 + Math.random() * 9000)}`);
                        setApplied(true);
                      }}
                      id="apply-now-btn"
                    >
                      Instant Loan Application →
                    </button>
                  )}

                  {result.status === 'conditional' && (
                    <button
                      type="button"
                      className="btn-primary-large"
                      onClick={() => {
                        setApplicationRef(`APP-${opp.opportunity_id}-${Math.floor(1000 + Math.random() * 9000)}`);
                        setApplied(true);
                      }}
                      id="conditional-apply-btn"
                    >
                      Upload Documents & Apply →
                    </button>
                  )}

                  {result.status === 'not_eligible' && (
                    <div className="not-eligible-actions">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => {
                          // Adjust amount to max supported or min
                          if (amount > opp.max_amount) setAmount(opp.max_amount);
                          else if (amount < opp.min_amount) setAmount(opp.min_amount);
                          if (tenure < opp.min_tenure_months) setTenure(opp.min_tenure_months);
                          else if (tenure > opp.max_tenure_months) setTenure(opp.max_tenure_months);
                        }}
                      >
                        Adjust to Lender's Limits
                      </button>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          handleClose();
                          setScreen('listing');
                        }}
                      >
                        Explore Other Matching Lenders
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default EligibilityCheck;
