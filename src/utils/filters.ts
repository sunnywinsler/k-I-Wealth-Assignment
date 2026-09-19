import type { Opportunity, RiskProfile, SortOption } from '../types';

/** Pure filter — no side-effects, easily unit-testable */
export function filterOpportunities(
  items: Opportunity[],
  opts: {
    search?: string;
    amount?: number;
    tenure?: number;
    riskFilter?: RiskProfile | '';
  },
): Opportunity[] {
  const search = opts.search?.toLowerCase().trim() ?? '';
  return items.filter((o) => {
    if (search && !o.provider.toLowerCase().includes(search) && !o.product.toLowerCase().includes(search) && !o.opportunity_id.toLowerCase().includes(search)) return false;
    if (opts.amount !== undefined) {
      if (opts.amount > o.max_amount || opts.amount < o.min_amount) return false;
    }
    if (opts.tenure !== undefined) {
      if (opts.tenure < o.min_tenure_months || opts.tenure > o.max_tenure_months) return false;
    }
    if (opts.riskFilter) {
      if (o.risk_profile !== opts.riskFilter) return false;
    }
    return true;
  });
}

/** Pure sort — returns a new sorted array */
export function sortOpportunities(items: Opportunity[], sort: SortOption): Opportunity[] {
  const copy = [...items];
  switch (sort) {
    case 'interest_rate_asc':  return copy.sort((a, b) => a.interest_rate - b.interest_rate);
    case 'interest_rate_desc': return copy.sort((a, b) => b.interest_rate - a.interest_rate);
    case 'max_amount_desc':    return copy.sort((a, b) => b.max_amount - a.max_amount);
    case 'min_amount_asc':     return copy.sort((a, b) => a.min_amount - b.min_amount);
    case 'ltv_desc':           return copy.sort((a, b) => b.ltv - a.ltv);
    default:                   return copy;
  }
}
