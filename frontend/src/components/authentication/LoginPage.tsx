import React, { useState } from 'react';
import { Factory, RefreshCw, Truck, ChevronRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { LoginFactoryGraphic } from './LoginFactoryGraphic';

interface LoginPageProps {
  onBackToHome: () => void;
  onSelectOrg: (orgName: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToHome, onSelectOrg }) => {
  const [email, setEmail] = useState('user@enterprise.com');
  const [password, setPassword] = useState('••••••••');
  const [remember, setRemember] = useState(true);
  const [signedInNotice, setSignedInNotice] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignedInNotice('Successfully authenticated! Redirecting to Enterprise Dashboard...');
    setTimeout(() => {
      onSelectOrg('Industrial Hub');
    }, 1200);
  };

  const handleOrgClick = (orgName: string) => {
    onSelectOrg(orgName);
  };

  return (
    <div className="flex w-full min-h-screen bg-[#F7FAF9] text-[#181C1C] font-sans antialiased">
      {/* Top Floating Return to Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/90 backdrop-blur-md border border-[#C4C6D0] text-[#000A1F] hover:bg-[#EBEEED] text-xs font-mono font-medium transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#006A6A]" />
          <span>Back to Landing Page</span>
        </button>
      </div>

      {/* Split Screen Layout Container */}
      <div className="flex w-full min-h-screen">
        {/* Left Column: Brand & Illustration (Hidden on mobile) */}
        <div className="hidden lg:flex flex-col w-1/2 bg-[#F1F4F3] border-r border-[#C4C6D0]/30 p-10 relative overflow-hidden justify-between">
          <div className="z-10 relative pt-10">
            {/* Brand Logo */}
            <div className="flex items-center gap-2 mb-10 cursor-pointer" onClick={onBackToHome}>
              <div className="w-10 h-10 rounded-xl bg-[#00204A] flex items-center justify-center text-[#8CF3F3] shadow-xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-2xl tracking-tight text-[#000A1F]">
                  Eco<span className="text-[#006A6A]">Link</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#747780] uppercase -mt-1">
                  Enterprise Platform
                </span>
              </div>
            </div>

            {/* Headline & Description */}
            <h1 className="font-headline font-bold text-4xl lg:text-5xl text-[#000A1F] leading-tight mb-4 tracking-tight">
              Driving Industrial Sustainability
            </h1>
            <p className="font-sans text-lg text-[#44474F] max-w-md leading-relaxed">
              Connect your operations to a sustainable future. The unified platform for enterprise environmental intelligence.
            </p>
          </div>

          {/* 3D Illustration Graphics Container */}
          <div className="z-10 relative mt-auto pt-6 flex justify-center items-end">
            <LoginFactoryGraphic />
          </div>

          {/* Decorative background element */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F1F4F3] to-[#E6E9E8] opacity-50 z-0 pointer-events-none" />
        </div>

        {/* Right Column: Auth & Organization Selection */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-10 bg-[#F7FAF9] relative overflow-y-auto">
          <div className="w-full max-w-md space-y-8 my-auto pt-10 pb-12">
            {/* Mobile Logo (Visible only on small screens) */}
            <div className="lg:hidden flex justify-center mb-6">
              <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToHome}>
                <div className="w-9 h-9 rounded-xl bg-[#00204A] flex items-center justify-center text-[#8CF3F3]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <span className="font-headline font-bold text-xl text-[#000A1F]">
                  Eco<span className="text-[#006A6A]">Link</span>
                </span>
              </div>
            </div>

            {/* Notification alert */}
            {signedInNotice && (
              <div className="p-4 rounded-xl bg-[#D5F2E1] border border-[#52B788] text-[#004D4D] text-sm font-medium flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-[#006A6A] flex-shrink-0" />
                <span>{signedInNotice}</span>
              </div>
            )}

            {/* Login Section Card */}
            <div className="bg-white p-8 rounded-xl border border-[#C4C6D0] shadow-sm">
              <h2 className="font-headline font-semibold text-2xl md:text-3xl text-[#000A1F] mb-6">
                Sign In
              </h2>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider mb-1.5" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@enterprise.com"
                    required
                    className="w-full h-10 px-4 bg-white border border-[#C4C6D0] rounded focus:outline-none focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] text-sm text-[#181C1C] transition-colors font-sans"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider" htmlFor="password">
                      Password
                    </label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset email dispatched.'); }} className="font-mono text-xs font-medium text-[#006A6A] hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-10 px-4 bg-white border border-[#C4C6D0] rounded focus:outline-none focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] text-sm text-[#181C1C] transition-colors font-sans"
                  />
                </div>

                <div className="flex items-center pt-1">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 text-[#006A6A] bg-white border-[#C4C6D0] rounded focus:ring-[#006A6A] cursor-pointer"
                  />
                  <label htmlFor="remember" className="ml-2 font-sans text-sm text-[#44474F] cursor-pointer select-none">
                    Remember me for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full h-10 bg-[#000A1F] hover:bg-[#00204A] text-white font-mono text-sm font-medium rounded flex items-center justify-center transition-colors mt-6 cursor-pointer tracking-wide"
                >
                  Sign In
                </button>
              </form>
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#C4C6D0]" />
              <span className="flex-shrink-0 mx-4 font-mono text-xs font-medium text-[#44474F] uppercase tracking-widest">
                OR
              </span>
              <div className="flex-grow border-t border-[#C4C6D0]" />
            </div>

            {/* Organization Selection Section */}
            <div>
              <h3 className="font-headline font-semibold text-xl text-[#000A1F] mb-4">
                Choose your organization
              </h3>

              <div className="space-y-4">
                {/* Org Card 1 */}
                <div
                  onClick={() => handleOrgClick('Industrial Hub')}
                  className="group bg-white border border-[#C4C6D0] rounded-lg p-4 flex items-center justify-between hover:border-[#006A6A] hover:shadow-sm cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#EBEEED] flex items-center justify-center rounded group-hover:bg-[#006A6A]/10 transition-colors">
                      <Factory className="w-5 h-5 text-[#006A6A]" />
                    </div>
                    <div>
                      <h4 className="font-mono font-medium text-sm text-[#000A1F] tracking-tight">
                        Industrial Hub
                      </h4>
                      <p className="font-sans text-xs text-[#44474F] line-clamp-1">
                        Manage manufacturing emissions and waste.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="hidden sm:flex h-8 px-4 border border-[#006A6A] text-[#006A6A] font-mono text-xs font-medium rounded items-center justify-center group-hover:bg-[#006A6A] group-hover:text-white transition-colors cursor-pointer"
                  >
                    Continue
                  </button>
                  <ChevronRight className="sm:hidden w-5 h-5 text-[#006A6A]" />
                </div>

                {/* Org Card 2 */}
                <div
                  onClick={() => handleOrgClick('Circular Economy')}
                  className="group bg-white border border-[#C4C6D0] rounded-lg p-4 flex items-center justify-between hover:border-[#006A6A] hover:shadow-sm cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#EBEEED] flex items-center justify-center rounded group-hover:bg-[#006A6A]/10 transition-colors">
                      <RefreshCw className="w-5 h-5 text-[#006A6A]" />
                    </div>
                    <div>
                      <h4 className="font-mono font-medium text-sm text-[#000A1F] tracking-tight">
                        Circular Economy
                      </h4>
                      <p className="font-sans text-xs text-[#44474F] line-clamp-1">
                        Track material recovery and processing.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="hidden sm:flex h-8 px-4 border border-[#006A6A] text-[#006A6A] font-mono text-xs font-medium rounded items-center justify-center group-hover:bg-[#006A6A] group-hover:text-white transition-colors cursor-pointer"
                  >
                    Continue
                  </button>
                  <ChevronRight className="sm:hidden w-5 h-5 text-[#006A6A]" />
                </div>

                {/* Org Card 3 */}
                <div
                  onClick={() => handleOrgClick('Sustainable Supply')}
                  className="group bg-white border border-[#C4C6D0] rounded-lg p-4 flex items-center justify-between hover:border-[#006A6A] hover:shadow-sm cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#EBEEED] flex items-center justify-center rounded group-hover:bg-[#006A6A]/10 transition-colors">
                      <Truck className="w-5 h-5 text-[#006A6A]" />
                    </div>
                    <div>
                      <h4 className="font-mono font-medium text-sm text-[#000A1F] tracking-tight">
                        Sustainable Supply
                      </h4>
                      <p className="font-sans text-xs text-[#44474F] line-clamp-1">
                        Optimize carbon footprint in transport.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="hidden sm:flex h-8 px-4 border border-[#006A6A] text-[#006A6A] font-mono text-xs font-medium rounded items-center justify-center group-hover:bg-[#006A6A] group-hover:text-white transition-colors cursor-pointer"
                  >
                    Continue
                  </button>
                  <ChevronRight className="sm:hidden w-5 h-5 text-[#006A6A]" />
                </div>
              </div>
            </div>
          </div>

          {/* Simple Footer info for login page */}
          <div className="w-full text-center py-4 text-xs font-mono text-[#747780]">
            <p>
              © 2026 EcoLink Industrial.{' '}
              <button onClick={onBackToHome} className="hover:text-[#006A6A] hover:underline cursor-pointer">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
