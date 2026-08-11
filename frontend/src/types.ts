export type RoleType = 'factory' | 'recycler' | 'logistics' | 'admin';

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: RoleType;
  company_name?: string;
  phone?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  message?: string;
  tokens: AuthTokens;
  access: string;
  refresh: string;
  user: User;
}

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
