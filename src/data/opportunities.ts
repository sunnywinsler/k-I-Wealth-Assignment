import type { Opportunity } from '../types';

/** Raw CSV parsed and normalised — percentages stripped of % and cast to number */
export const OPPORTUNITIES: Opportunity[] = [
  { opportunity_id: 'OPP-1001', provider: 'Apex Finance',      product: 'LAS', interest_rate: 9.25,  min_amount: 200000,  max_amount: 5000000,  min_tenure_months: 12, max_tenure_months: 36, ltv: 50, processing_fee: 0.50, risk_profile: 'Moderate' },
  { opportunity_id: 'OPP-1002', provider: 'Bharat Capital',    product: 'LAS', interest_rate: 9.75,  min_amount: 500000,  max_amount: 7500000,  min_tenure_months: 12, max_tenure_months: 48, ltv: 55, processing_fee: 0.75, risk_profile: 'Moderate' },
  { opportunity_id: 'OPP-1003', provider: 'Crescent Wealth',   product: 'LAS', interest_rate: 10.10, min_amount: 300000,  max_amount: 2500000,  min_tenure_months: 6,  max_tenure_months: 24, ltv: 45, processing_fee: 0.50, risk_profile: 'Moderately High' },
  { opportunity_id: 'OPP-1004', provider: 'Delta Securities',  product: 'LAS', interest_rate: 9.50,  min_amount: 100000,  max_amount: 3000000,  min_tenure_months: 12, max_tenure_months: 36, ltv: 50, processing_fee: 0.40, risk_profile: 'Moderate' },
  { opportunity_id: 'OPP-1005', provider: 'Evergreen Finance', product: 'LAS', interest_rate: 10.25, min_amount: 250000,  max_amount: 4000000,  min_tenure_months: 18, max_tenure_months: 36, ltv: 45, processing_fee: 1.00, risk_profile: 'Moderately High' },
  { opportunity_id: 'OPP-1006', provider: 'FinEdge Capital',   product: 'LAS', interest_rate: 9.40,  min_amount: 500000,  max_amount: 10000000, min_tenure_months: 12, max_tenure_months: 60, ltv: 50, processing_fee: 0.50, risk_profile: 'Moderate' },
  { opportunity_id: 'OPP-1007', provider: 'GrowthBridge',      product: 'LAS', interest_rate: 10.50, min_amount: 200000,  max_amount: 2000000,  min_tenure_months: 6,  max_tenure_months: 24, ltv: 40, processing_fee: 0.50, risk_profile: 'High' },
  { opportunity_id: 'OPP-1008', provider: 'Harbor Wealth',     product: 'LAS', interest_rate: 9.60,  min_amount: 300000,  max_amount: 6000000,  min_tenure_months: 12, max_tenure_months: 36, ltv: 52, processing_fee: 0.60, risk_profile: 'Moderate' },
  { opportunity_id: 'OPP-1009', provider: 'Indus Finance',     product: 'LAS', interest_rate: 9.90,  min_amount: 150000,  max_amount: 3500000,  min_tenure_months: 12, max_tenure_months: 48, ltv: 48, processing_fee: 0.50, risk_profile: 'Moderate' },
  { opportunity_id: 'OPP-1010', provider: 'Jade Financial',    product: 'LAS', interest_rate: 10.00, min_amount: 200000,  max_amount: 4500000,  min_tenure_months: 24, max_tenure_months: 48, ltv: 50, processing_fee: 0.75, risk_profile: 'Moderately High' },
  { opportunity_id: 'OPP-1011', provider: 'Kite Capital',      product: 'LAS', interest_rate: 9.35,  min_amount: 500000,  max_amount: 8000000,  min_tenure_months: 12, max_tenure_months: 36, ltv: 55, processing_fee: 0.50, risk_profile: 'Moderate' },
  { opportunity_id: 'OPP-1012', provider: 'Lotus Finance',     product: 'LAS', interest_rate: 10.75, min_amount: 100000,  max_amount: 1500000,  min_tenure_months: 6,  max_tenure_months: 18, ltv: 40, processing_fee: 0.25, risk_profile: 'High' },
];
