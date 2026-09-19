import type { Opportunity, EligibilityRequest, EligibilityResult, RiskProfile } from '../types';

const RISK_ORDER: RiskProfile[] = ['Low', 'Moderate', 'Moderately High', 'High', 'Very High'];

function riskRank(r: RiskProfile): number {
  return RISK_ORDER.indexOf(r);
}

/**
 * Pure, framework-free eligibility evaluation.
 * Returns status, reasons[], max_supported_amount, next_step.
 */
export function checkEligibility(
  opp: Opportunity,
  req: EligibilityRequest,
): EligibilityResult {
  const reasons: string[] = [];
  let status: EligibilityResult['status'] = 'eligible';

  const { amount, tenure, risk } = req;

  // ── 1. Amount above max ────────────────────────────────────────────────────
  if (amount > opp.max_amount) {
    reasons.push(
      `Requested amount ₹${amount.toLocaleString('en-IN')} exceeds the maximum of ₹${opp.max_amount.toLocaleString('en-IN')} for this opportunity.`,
    );
    return { status: 'not_eligible', reasons, max_supported_amount: opp.max_amount, next_step: 'Adjust your requirement or choose another opportunity.' };
  }

  // ── 2. Amount below min ────────────────────────────────────────────────────
  if (amount < opp.min_amount) {
    reasons.push(
      `Requested amount ₹${amount.toLocaleString('en-IN')} is below the minimum of ₹${opp.min_amount.toLocaleString('en-IN')} for this opportunity.`,
    );
    return { status: 'not_eligible', reasons, max_supported_amount: opp.max_amount, next_step: 'Adjust your requirement or choose another opportunity.' };
  }

  // ── 3. Tenure outside range ────────────────────────────────────────────────
  if (tenure < opp.min_tenure_months || tenure > opp.max_tenure_months) {
    reasons.push(
      `Requested tenure of ${tenure} months is outside the supported range of ${opp.min_tenure_months}–${opp.max_tenure_months} months.`,
    );
    return { status: 'not_eligible', reasons, max_supported_amount: opp.max_amount, next_step: 'Adjust your requirement or choose another opportunity.' };
  }

  // ── 4. Amount in top 10 % of range — conditional ──────────────────────────
  const range = opp.max_amount - opp.min_amount;
  const topTenPctThreshold = opp.max_amount - range * 0.1;
  if (amount >= topTenPctThreshold) {
    status = 'conditional';
    reasons.push(
      `Your requested amount is within the top 10 % of this opportunity's range. Extra documentation may be required.`,
    );
  }

  // ── 5. Risk preference lower than opportunity's risk profile — conditional ─
  if (riskRank(risk) < riskRank(opp.risk_profile)) {
    status = 'conditional';
    reasons.push(
      `Your risk preference (${risk}) is lower than this opportunity's risk profile (${opp.risk_profile}). Please review the terms carefully.`,
    );
  }

  const next_step =
    status === 'eligible'
      ? 'Proceed to application.'
      : 'Proceed with additional documentation.';

  return { status, reasons, max_supported_amount: opp.max_amount, next_step };
}
