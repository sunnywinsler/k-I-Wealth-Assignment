import { describe, expect, it } from 'vitest';
import { checkEligibility } from '../src/utils/eligibility';
import { OPPORTUNITIES } from '../src/data/opportunities';
import type { EligibilityRequest, Opportunity } from '../src/types';

const opp = OPPORTUNITIES.find((o) => o.opportunity_id === 'OPP-1001') as Opportunity;

function request(patch: Partial<EligibilityRequest> = {}): EligibilityRequest {
  return {
    opportunity_id: opp.opportunity_id,
    amount: 500000,
    tenure: 24,
    risk: 'Moderate',
    security_type: 'Equity Shares',
    ...patch,
  };
}

describe('checkEligibility', () => {
  it('marks a matching amount, tenure and risk as eligible', () => {
    const result = checkEligibility(opp, request());
    expect(result.status).toBe('eligible');
    expect(result.reasons).toHaveLength(0);
    expect(result.max_supported_amount).toBe(opp.max_amount);
    expect(result.next_step).toMatch(/application/i);
  });

  it('rejects amounts above the opportunity maximum', () => {
    const result = checkEligibility(opp, request({ amount: opp.max_amount + 1 }));
    expect(result.status).toBe('not_eligible');
    expect(result.reasons[0]).toMatch(/exceeds the maximum/i);
  });

  it('rejects tenure outside the supported range', () => {
    const result = checkEligibility(opp, request({ tenure: 6 }));
    expect(result.status).toBe('not_eligible');
    expect(result.reasons[0]).toMatch(/outside the supported range/i);
  });

  it('returns conditional when the user risk preference is lower than the opportunity', () => {
    const result = checkEligibility(opp, request({ risk: 'Low' }));
    expect(result.status).toBe('conditional');
    expect(result.reasons.some((r) => /risk preference/i.test(r))).toBe(true);
  });

  it('returns conditional when the amount sits in the top 10% of the range', () => {
    const result = checkEligibility(opp, request({ amount: 4700000 }));
    expect(result.status).toBe('conditional');
    expect(result.reasons.some((r) => /top 10/i.test(r))).toBe(true);
  });
});
