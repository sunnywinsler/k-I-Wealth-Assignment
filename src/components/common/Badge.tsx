import type { RiskProfile, EligibilityStatus } from '../../types';

const RISK_CLASS: Record<RiskProfile, string> = {
  'Low': 'badge-low',
  'Moderate': 'badge-moderate',
  'Moderately High': 'badge-mod-high',
  'High': 'badge-high',
  'Very High': 'badge-very-high',
};

const STATUS_CLASS: Record<EligibilityStatus, string> = {
  eligible: 'badge-eligible',
  conditional: 'badge-conditional',
  not_eligible: 'badge-not-eligible',
};

export function RiskBadge({ risk }: { risk: RiskProfile }) {
  return <span className={`badge ${RISK_CLASS[risk]}`}>{risk}</span>;
}

export function StatusBadge({ status }: { status: EligibilityStatus }) {
  const label = status === 'not_eligible' ? 'Not Eligible' : status === 'conditional' ? 'Conditional' : 'Eligible';
  return <span className={`badge ${STATUS_CLASS[status]}`}>{label}</span>;
}
