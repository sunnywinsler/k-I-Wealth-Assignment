import { OPPORTUNITIES } from '../data/opportunities';
import { filterOpportunities, sortOpportunities } from '../utils/filters';
import { checkEligibility } from '../utils/eligibility';
import type {
  OpportunitiesRequest, OpportunitiesResponse,
  Opportunity, EligibilityRequest, EligibilityResult,
  CompareRequest, CompareResponse,
} from '../types';

const SIMULATED_LATENCY_MS = import.meta.env.MODE === 'test' ? 0 : 600;

let _forceNextFailure = false;

/** Call before the next API call to simulate a network failure (for demo/testing). */
export function simulateNextFailure(): void { _forceNextFailure = true; }

function delay(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }

async function withLatency<T>(fn: () => T): Promise<T> {
  await delay(SIMULATED_LATENCY_MS);
  if (_forceNextFailure) { _forceNextFailure = false; throw new Error('Simulated network failure. Please retry.'); }
  return fn();
}

/** GET /api/opportunities */
export async function getOpportunities(req: OpportunitiesRequest = {}): Promise<OpportunitiesResponse> {
  return withLatency(() => {
    const { amount, tenure, risk, search, sort = 'interest_rate_asc', riskFilter, page = 1, limit = 12 } = req as OpportunitiesRequest & { riskFilter?: string };
    let items = filterOpportunities(OPPORTUNITIES, {
      search,
      amount,
      tenure,
      riskFilter: (riskFilter || risk) as never,
    });
    items = sortOpportunities(items, sort);
    const total = items.length;
    const start = (page - 1) * limit;
    return { items: items.slice(start, start + limit), total, page, limit };
  });
}

/** GET /api/opportunities/:id */
export async function getOpportunityById(id: string): Promise<Opportunity> {
  return withLatency(() => {
    const opp = OPPORTUNITIES.find((o) => o.opportunity_id === id);
    if (!opp) throw new Error(`Opportunity ${id} not found.`);
    return opp;
  });
}

/** POST /api/eligibility/check */
export async function postEligibilityCheck(req: EligibilityRequest): Promise<EligibilityResult> {
  return withLatency(() => {
    const opp = OPPORTUNITIES.find((o) => o.opportunity_id === req.opportunity_id);
    if (!opp) throw new Error(`Opportunity ${req.opportunity_id} not found.`);
    return checkEligibility(opp, req);
  });
}

/** POST /api/compare */
export async function postCompare(req: CompareRequest): Promise<CompareResponse> {
  return withLatency(() => {
    const items = req.opportunity_ids.map((id) => {
      const o = OPPORTUNITIES.find((x) => x.opportunity_id === id);
      if (!o) throw new Error(`Opportunity ${id} not found.`);
      return o;
    });
    return { items };
  });
}
