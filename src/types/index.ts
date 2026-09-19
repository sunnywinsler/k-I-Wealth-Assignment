export type RiskProfile = 'Low' | 'Moderate' | 'Moderately High' | 'High' | 'Very High';

export interface Opportunity {
  opportunity_id: string;
  provider: string;
  product: string;
  interest_rate: number;
  min_amount: number;
  max_amount: number;
  min_tenure_months: number;
  max_tenure_months: number;
  ltv: number;
  processing_fee: number;
  risk_profile: RiskProfile;
}

export type SortOption =
  | 'interest_rate_asc' | 'interest_rate_desc'
  | 'max_amount_desc' | 'min_amount_asc' | 'ltv_desc';

export interface OpportunitiesRequest {
  amount?: number; tenure?: number; risk?: RiskProfile;
  security_type?: string; search?: string; sort?: SortOption;
  page?: number; limit?: number;
}
export interface OpportunitiesResponse { items: Opportunity[]; total: number; page: number; limit: number; }

export type EligibilityStatus = 'eligible' | 'conditional' | 'not_eligible';
export interface EligibilityRequest { opportunity_id: string; amount: number; tenure: number; risk: RiskProfile; security_type: string; }
export interface EligibilityResult { status: EligibilityStatus; reasons: string[]; max_supported_amount: number; next_step: string; }

export interface CompareRequest { opportunity_ids: string[]; }
export interface CompareResponse { items: Opportunity[]; }

export interface RequirementValues { amount: number; tenure: number; risk: RiskProfile; security_type: string; }
export type AppScreen = 'requirement' | 'listing' | 'comparison' | 'eligibility';
export interface AppFilters { search: string; sort: SortOption; riskFilter: RiskProfile | ''; }
