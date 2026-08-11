import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import logoImg from '../assets/logo.png';

interface HeaderProps {
  onOpenOnboarding: () => void;
  onOpenDocs: () => void;
  onOpenLogin: () => void;
  onOpenPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenOnboarding,
  onOpenDocs,
  onOpenLogin,
  onOpenPricing
}) => {
  const [activeTab, setActiveTab] = useState<'platform' | 'solutions' | 'resources'>('platform');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 border-b border-[#C4C6D0] ${
        isScrolled
          ? 'bg-[#F7FAF9]/90 backdrop-blur-md shadow-xs'
          : 'bg-[#F7FAF9]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
        {/* Logo and Nav */}
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 font-headline font-bold text-xl text-[#000A1F] tracking-tight group focus:outline-none"
          >
            <img
              src={logoImg}
              alt="Eco Link Logo"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 h-16">
            <button
              onClick={() => setActiveTab('platform')}
              className={`font-body text-base transition-colors relative h-full flex items-center cursor-pointer ${
                activeTab === 'platform'
                  ? 'text-[#006A6A] font-semibold border-b-2 border-[#006A6A]'
                  : 'text-[#44474F] hover:text-[#006A6A]'
              }`}
            >
              Platform
            </button>
            <button
              onClick={() => setActiveTab('solutions')}
              className={`font-body text-base transition-colors relative h-full flex items-center cursor-pointer ${
                activeTab === 'solutions'
                  ? 'text-[#006A6A] font-semibold border-b-2 border-[#006A6A]'
                  : 'text-[#44474F] hover:text-[#006A6A]'
              }`}
            >
              Solutions
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`font-body text-base transition-colors relative h-full flex items-center cursor-pointer ${
                activeTab === 'resources'
                  ? 'text-[#006A6A] font-semibold border-b-2 border-[#006A6A]'
                  : 'text-[#44474F] hover:text-[#006A6A]'
              }`}
            >
              Resources
            </button>
            {onOpenPricing && (
              <button
                onClick={onOpenPricing}
                className="font-body text-base transition-colors relative h-full flex items-center text-[#44474F] hover:text-[#006A6A] cursor-pointer"
              >
                Pricing & Plans
              </button>
            )}
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenLogin}
            className="font-mono text-sm text-[#006A6A] hover:text-[#004F4F] font-semibold transition-colors px-4 py-2 rounded-xl hover:bg-[#EBEEED] cursor-pointer h-10 flex items-center"
          >
            Sign In
          </button>
          <button
            onClick={onOpenDocs}
            className="font-mono text-sm text-[#44474F] hover:text-[#006A6A] transition-colors px-4 py-2 rounded-xl font-medium hover:bg-[#EBEEED] cursor-pointer h-10 flex items-center"
          >
            Support
          </button>
          <button
            onClick={onOpenOnboarding}
            className="bg-[#000A1F] text-white px-5 py-2 rounded-xl font-mono text-sm hover:bg-[#00204A] active:scale-95 transition-all shadow-xs flex items-center gap-2 group cursor-pointer h-10"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-[#8CF3F3]" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#000A1F] hover:bg-[#EBEEED] rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F7FAF9] border-b border-[#C4C6D0] px-6 py-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
          <button
            onClick={() => {
              setActiveTab('platform');
              setMobileMenuOpen(false);
            }}
            className="text-left font-body text-base py-2 text-[#000A1F] hover:text-[#006A6A]"
          >
            Platform
          </button>
          <button
            onClick={() => {
              setActiveTab('solutions');
              setMobileMenuOpen(false);
            }}
            className="text-left font-body text-base py-2 text-[#000A1F] hover:text-[#006A6A]"
          >
            Solutions
          </button>
          <button
            onClick={() => {
              setActiveTab('resources');
              setMobileMenuOpen(false);
            }}
            className="text-left font-body text-base py-2 text-[#000A1F] hover:text-[#006A6A]"
          >
            Resources
          </button>
          {onOpenPricing && (
            <button
              onClick={() => {
                onOpenPricing();
                setMobileMenuOpen(false);
              }}
              className="text-left font-body text-base py-2 text-[#000A1F] hover:text-[#006A6A]"
            >
              Pricing & Plans
            </button>
          )}
          <div className="pt-2 border-t border-[#C4C6D0] flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center font-mono text-sm py-2 text-[#006A6A] font-semibold hover:bg-[#EBEEED] rounded-lg"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                onOpenDocs();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center font-mono text-sm py-2 text-[#44474F] hover:text-[#006A6A]"
            >
              Support
            </button>
            <button
              onClick={() => {
                onOpenOnboarding();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#000A1F] text-white py-3 rounded-lg font-mono text-sm flex items-center justify-center gap-2"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
