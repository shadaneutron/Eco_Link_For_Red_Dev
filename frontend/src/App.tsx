import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ValuePropositions } from './components/ValuePropositions';
import { WorkflowSection } from './components/WorkflowSection';
import { StakeholdersSection } from './components/StakeholdersSection';
import { BadgesAndCta } from './components/BadgesAndCta';
import { Footer } from './components/Footer';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { DemoModal } from './components/DemoModal';
import { DocModal } from './components/DocModal';
import { LoginPage } from './components/authentication/LoginPage';
import { ProtectedRoute } from './components/authentication/ProtectedRoute';
import { FactoryDashboard } from './components/factory/FactoryDashboard';
import { RecyclerDashboard } from './components/recycler/RecyclerDashboard';
import { LogisticsDashboard } from './components/logistics/LogisticsDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SubscriptionPlansPage } from './components/subscription';
import { BentoCapability, RoleType } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'dashboard' | 'recycler_dashboard' | 'logistics_dashboard' | 'admin_dashboard' | 'pricing'>('home');
  const [selectedOrg, setSelectedOrg] = useState<string>('Industrial Hub');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState<BentoCapability | null>(null);
  const [initialRole, setInitialRole] = useState<RoleType>('factory');

  const handleOpenOnboarding = (role: RoleType = 'factory') => {
    setInitialRole(role);
    setIsOnboardingOpen(true);
  };

  const handleAuthSuccess = (role: RoleType) => {
    if (role === 'recycler') {
      setSelectedOrg(user?.company_name || 'Green Recycling Ltd.');
      setCurrentView('recycler_dashboard');
    } else if (role === 'logistics') {
      setSelectedOrg(user?.company_name || 'Sustainable Supply Logistics');
      setCurrentView('logistics_dashboard');
    } else if (role === 'admin') {
      setCurrentView('admin_dashboard');
    } else {
      setSelectedOrg(user?.company_name || 'Industrial Hub');
      setCurrentView('dashboard');
    }
  };

  const handleSelectOrgFromLogin = (orgName: string) => {
    setSelectedOrg(orgName);
    if (orgName === 'Circular Economy') {
      setCurrentView('recycler_dashboard');
    } else if (orgName === 'Sustainable Supply') {
      setCurrentView('logistics_dashboard');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleSignOut = () => {
    logout();
    setCurrentView('login');
  };

  const getDashboardViewForUser = () => {
    if (!user) return 'login';
    if (user.role === 'admin') return 'admin_dashboard';
    if (user.role === 'recycler') return 'recycler_dashboard';
    if (user.role === 'logistics') return 'logistics_dashboard';
    return 'dashboard';
  };

  if (currentView === 'login') {
    return (
      <LoginPage
        onBackToHome={() => setCurrentView('home')}
        onSelectOrg={handleSelectOrgFromLogin}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  if (currentView === 'admin_dashboard') {
    return (
      <ProtectedRoute allowedRoles={['admin']} onUnauthenticated={() => setCurrentView('login')}>
        <AdminDashboard
          onBackToHome={() => setCurrentView('home')}
          onOpenLogin={handleSignOut}
        />
      </ProtectedRoute>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <ProtectedRoute allowedRoles={['factory', 'admin']} onUnauthenticated={() => setCurrentView('login')}>
        <FactoryDashboard
          onBackToHome={() => setCurrentView('home')}
          onOpenLogin={handleSignOut}
          userName={user?.full_name || user?.email || 'Factory User'}
          orgName={user?.company_name || selectedOrg}
        />
      </ProtectedRoute>
    );
  }

  if (currentView === 'recycler_dashboard') {
    return (
      <ProtectedRoute allowedRoles={['recycler', 'admin']} onUnauthenticated={() => setCurrentView('login')}>
        <RecyclerDashboard
          onBackToHome={() => setCurrentView('home')}
          onOpenLogin={handleSignOut}
          userName={user?.full_name || user?.email || 'Recycler User'}
          orgName={user?.company_name || 'Circular Economy Partner'}
        />
      </ProtectedRoute>
    );
  }

  if (currentView === 'logistics_dashboard') {
    return (
      <ProtectedRoute allowedRoles={['logistics', 'admin']} onUnauthenticated={() => setCurrentView('login')}>
        <LogisticsDashboard
          onBackToHome={() => setCurrentView('home')}
          onOpenLogin={handleSignOut}
          userName={user?.full_name || user?.email || 'Logistics Carrier'}
          orgName={user?.company_name || 'Logistics Fleet Partner'}
        />
      </ProtectedRoute>
    );
  }

  if (currentView === 'pricing') {
    return (
      <SubscriptionPlansPage
        onBackToDashboard={() => setCurrentView('home')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF9] text-[#181C1C] font-body selection:bg-[#8CF3F3] selection:text-[#004F4F]">
      {/* Top Navigation Bar */}
      <Header
        onOpenOnboarding={() => handleOpenOnboarding('factory')}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenLogin={() => setCurrentView('login')}
        onOpenPricing={() => setCurrentView('pricing')}
      />


      {/* Main Page Content */}
      <main className="flex-grow space-y-12 lg:space-y-16 pb-16">
        {/* Hero Section */}
        <HeroSection
          onStartOnboarding={() => handleOpenOnboarding('factory')}
          onViewDocs={() => setIsDocsOpen(true)}
        />

        {/* Capabilities Bento Grid */}
        <ValuePropositions
          onSelectCapability={(capability) => setSelectedCapability(capability)}
        />

        {/* How EcoLink Works Stepper Workflow */}
        <WorkflowSection />

        {/* Stakeholder Ecosystem Roles */}
        <StakeholdersSection
          onSelectRole={(role) => handleOpenOnboarding(role)}
        />

        {/* Feature Badges & Final CTA */}
        <BadgesAndCta
          onStartOnboarding={() => handleOpenOnboarding('factory')}
          onOpenDocs={() => setIsDocsOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer onOpenDocs={() => setIsDocsOpen(true)} onOpenLogin={() => setCurrentView(isAuthenticated ? 'dashboard' : 'login')} />

      {/* Interactive Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        initialRole={initialRole}
        onClose={() => setIsOnboardingOpen(false)}
        onOpenLogin={() => setCurrentView('login')}
      />

      <DemoModal
        capability={selectedCapability}
        onClose={() => setSelectedCapability(null)}
      />

      <DocModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        onStartOnboarding={() => handleOpenOnboarding('factory')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

