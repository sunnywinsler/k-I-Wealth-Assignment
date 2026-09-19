import { describe, expect, it } from 'vitest';
import { filterOpportunities, sortOpportunities } from '../src/utils/filters';
import { OPPORTUNITIES } from '../src/data/opportunities';

describe('filterOpportunities', () => {
  it('filters by provider search text', () => {
    const items = filterOpportunities(OPPORTUNITIES, { search: 'apex' });
    expect(items).toHaveLength(1);
    expect(items[0].opportunity_id).toBe('OPP-1001');
  });

  it('excludes opportunities that cannot fund the requested amount', () => {
    const items = filterOpportunities(OPPORTUNITIES, { amount: 9000000 });
    expect(items.every((o) => o.min_amount <= 9000000 && o.max_amount >= 9000000)).toBe(true);
    expect(items.map((o) => o.opportunity_id)).toEqual(['OPP-1006']);
  });

  it('excludes opportunities whose tenure window does not include the request', () => {
    const items = filterOpportunities(OPPORTUNITIES, { tenure: 60 });
    expect(items.every((o) => o.min_tenure_months <= 60 && o.max_tenure_months >= 60)).toBe(true);
  });

  it('filters by risk profile chip', () => {
    const items = filterOpportunities(OPPORTUNITIES, { riskFilter: 'High' });
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((o) => o.risk_profile === 'High')).toBe(true);
  });
});

describe('sortOpportunities', () => {
  it('sorts by interest rate ascending', () => {
    const items = sortOpportunities(OPPORTUNITIES, 'interest_rate_asc');
    const rates = items.map((o) => o.interest_rate);
    expect(rates).toEqual([...rates].sort((a, b) => a - b));
  });

  it('sorts by LTV descending', () => {
    const items = sortOpportunities(OPPORTUNITIES, 'ltv_desc');
    expect(items[0].ltv).toBeGreaterThanOrEqual(items[items.length - 1].ltv);
  });
});
