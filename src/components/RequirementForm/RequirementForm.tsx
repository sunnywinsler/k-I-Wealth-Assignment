import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { RiskProfile, RequirementValues } from '../../types';

const RISK_PROFILES: RiskProfile[] = ['Low', 'Moderate', 'Moderately High', 'High', 'Very High'];
const SECURITY_TYPES = ['Equity Shares', 'Mutual Funds', 'Bonds & Debentures', 'Government Securities'];

const AMOUNT_PRESETS = [
  { label: '₹2 Lakh', value: 200000 },
  { label: '₹5 Lakh', value: 500000 },
  { label: '₹10 Lakh', value: 1000000 },
  { label: '₹25 Lakh', value: 2500000 },
  { label: '₹50 Lakh', value: 5000000 },
];

const TENURE_PRESETS = [
  { label: '12M', value: 12 },
  { label: '24M', value: 24 },
  { label: '36M', value: 36 },
  { label: '48M', value: 48 },
  { label: '60M', value: 60 },
];

export function RequirementForm() {
  const { state, setRequirement, setScreen } = useApp();

  const [amount, setAmount] = useState<number>(state.requirement?.amount ?? 1000000);
  const [tenure, setTenure] = useState<number>(state.requirement?.tenure ?? 24);
  const [risk, setRisk] = useState<RiskProfile>(state.requirement?.risk ?? 'Moderate');
  const [securityType, setSecurityType] = useState<string>(state.requirement?.security_type ?? 'Equity Shares');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 50000) {
      setError('Please enter a valid loan amount (minimum ₹50,000).');
      return;
    }
    if (!tenure || tenure < 3 || tenure > 84) {
      setError('Tenure must be between 3 and 84 months.');
      return;
    }
    setError(null);

    const values: RequirementValues = {
      amount,
      tenure,
      risk,
      security_type: securityType,
    };
    setRequirement(values);
    setScreen('listing');
  };

  return (
    <div className="requirement-container">
      <div className="requirement-card">
        <div className="requirement-header">
          <div className="brand-badge">Loan Against Securities</div>
          <h1 className="requirement-title">Find Your Best Lending Opportunities</h1>
          <p className="requirement-subtitle">
            Pledge your portfolio of equities, mutual funds, or bonds for instant liquidity with competitive interest rates.
          </p>
        </div>

        {error && (
          <div className="form-error-banner" role="alert">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="requirement-form" noValidate>
          {/* Amount Section */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="req-amount" className="form-label">
                Required Loan Amount (INR)
              </label>
              <span className="form-value-highlight">
                ₹{amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="input-with-symbol">
              <span className="currency-symbol">₹</span>
              <input
                id="req-amount"
                type="number"
                min={50000}
                max={50000000}
                step={25000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="form-input"
                placeholder="e.g. 1000000"
                required
              />
            </div>
            <div className="preset-row" aria-label="Amount quick presets">
              {AMOUNT_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={`preset-btn ${amount === p.value ? 'active' : ''}`}
                  onClick={() => setAmount(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tenure Section */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="req-tenure" className="form-label">
                Desired Tenure
              </label>
              <span className="form-value-highlight">{tenure} Months ({(tenure / 12).toFixed(1)} yrs)</span>
            </div>
            <input
              id="req-tenure"
              type="range"
              min={6}
              max={60}
              step={6}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="form-range"
            />
            <div className="preset-row" aria-label="Tenure quick presets">
              {TENURE_PRESETS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={`preset-btn ${tenure === t.value ? 'active' : ''}`}
                  onClick={() => setTenure(t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Profile & Security Type Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Your Risk Preference</label>
              <div className="pill-group" role="radiogroup" aria-label="Risk preference">
                {RISK_PROFILES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    role="radio"
                    aria-checked={risk === r}
                    className={`pill-option ${risk === r ? 'active' : ''}`}
                    onClick={() => setRisk(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="req-security" className="form-label">
                Pledged Collateral Type
              </label>
              <select
                id="req-security"
                value={securityType}
                onChange={(e) => setSecurityType(e.target.value)}
                className="form-select"
              >
                {SECURITY_TYPES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <p className="form-helper-text">
                Loan Against Securities (LAS) loan-to-value limits depend on collateral asset classification.
              </p>
            </div>
          </div>

          <div className="form-action-row">
            <button type="submit" className="btn-primary-large" id="find-opportunities-btn">
              Discover Matching Opportunities →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequirementForm;
