import React, { useState } from 'react';
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
import { FactoryDashboard } from './components/factory/FactoryDashboard';
import { RecyclerDashboard } from './components/recycler/RecyclerDashboard';
import { LogisticsDashboard } from './components/logistics/LogisticsDashboard';
import { SubscriptionPlansPage } from './components/subscription';
import { BentoCapability, RoleType } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'dashboard' | 'recycler_dashboard' | 'logistics_dashboard' | 'pricing'>('home');
  const [selectedOrg, setSelectedOrg] = useState<string>('Industrial Hub');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState<BentoCapability | null>(null);
  const [initialRole, setInitialRole] = useState<RoleType>('factory');

  const handleOpenOnboarding = (role: RoleType = 'factory') => {
    setInitialRole(role);
    setIsOnboardingOpen(true);
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

  if (currentView === 'login') {
    return (
      <LoginPage
        onBackToHome={() => setCurrentView('home')}
        onSelectOrg={handleSelectOrgFromLogin}
      />
    );
  }

  if (currentView === 'dashboard') {
    return (
      <FactoryDashboard
        onBackToHome={() => setCurrentView('home')}
        onOpenLogin={() => setCurrentView('login')}
        userName="Ahmed"
        orgName={selectedOrg}
      />
    );
  }

  if (currentView === 'recycler_dashboard') {
    return (
      <RecyclerDashboard
        onBackToHome={() => setCurrentView('home')}
        onOpenLogin={() => setCurrentView('login')}
        userName="Ahmed Recycler"
        orgName="Green Recycling Ltd."
      />
    );
  }

  if (currentView === 'logistics_dashboard') {
    return (
      <LogisticsDashboard
        onBackToHome={() => setCurrentView('home')}
        onOpenLogin={() => setCurrentView('login')}
        userName="Ahmed Transport"
        orgName="Sustainable Supply Logistics"
      />
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
      <Footer onOpenDocs={() => setIsDocsOpen(true)} onOpenLogin={() => setCurrentView('login')} />

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
