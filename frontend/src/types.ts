export type RoleType = 'factory' | 'recycler' | 'logistics';

export interface WorkflowStep {
  id: number;
  stepNumber: string;
  title: string;
  iconName: string;
  description: string;
  detailText: string;
  metrics: string;
}

export interface BentoCapability {
  id: string;
  title: string;
  description: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
  badge: string;
  demoType: 'classification' | 'marketplace' | 'compliance' | 'esg';
}

export interface StakeholderRole {
  id: RoleType;
  title: string;
  description: string;
  iconName: string;
  features: string[];
  ctaText: string;
  accentColor: string;
  stats: { label: string; value: string }[];
}
