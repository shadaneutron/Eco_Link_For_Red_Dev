import React, { useState } from 'react';
import { Factory, RefreshCw, Truck, ChevronRight, ArrowLeft, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { LoginFactoryGraphic } from './LoginFactoryGraphic';
import { useAuth } from '../../context/AuthContext';
import { RoleType } from '../../types';
import logoImg from '../../assets/logo.png';

interface LoginPageProps {
  onBackToHome: () => void;
  onSelectOrg: (orgName: string) => void;
  onAuthSuccess?: (role: RoleType) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToHome, onSelectOrg, onAuthSuccess }) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  
  // Sign In state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  
  // Registration state
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<RoleType>('factory');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');

  // Status & Error state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signedInNotice, setSignedInNotice] = useState<string | null>(null);

  const redirectByRole = (userRole: RoleType) => {
    if (onAuthSuccess) {
      onAuthSuccess(userRole);
    } else {
      if (userRole === 'recycler') {
        onSelectOrg('Circular Economy');
      } else if (userRole === 'logistics') {
        onSelectOrg('Sustainable Supply');
      } else {
        onSelectOrg('Industrial Hub');
      }
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const user = await login({ email, password });
      setSignedInNotice(`Successfully authenticated as ${user.full_name}! Redirecting...`);
      setTimeout(() => {
        redirectByRole(user.role);
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (regPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await register({
        full_name: fullName,
        email: regEmail,
        password: regPassword,
        confirm_password: confirmPassword,
        role: role,
        company_name: role === 'admin' ? '' : companyName,
        phone: role === 'admin' ? '' : phone,
      });

      setSignedInNotice(`Account created successfully for ${user.company_name || user.full_name}! Redirecting...`);
      setTimeout(() => {
        redirectByRole(user.role);
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
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
              <img src={logoImg} alt="Eco Link Logo" className="h-12 w-auto object-contain" />
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
          <div className="w-full max-w-md space-y-6 my-auto pt-10 pb-12">
            {/* Mobile Logo (Visible only on small screens) */}
            <div className="lg:hidden flex justify-center mb-6">
              <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToHome}>
                <img src={logoImg} alt="Eco Link Logo" className="h-10 w-auto object-contain" />
              </div>
            </div>

            {/* Notification alert */}
            {signedInNotice && (
              <div className="p-4 rounded-xl bg-[#D5F2E1] border border-[#52B788] text-[#004D4D] text-sm font-medium flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-[#006A6A] flex-shrink-0" />
                <span>{signedInNotice}</span>
              </div>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-[#FCE8E6] border border-[#F2B8B5] text-[#8C1D18] text-sm font-medium flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-[#B3261E] flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Toggle Tabs (Sign In / Register) */}
            <div className="flex bg-[#EBEEED] p-1 rounded-xl border border-[#C4C6D0]/50">
              <button
                type="button"
                onClick={() => { setActiveTab('signin'); setErrorMessage(null); }}
                className={`flex-1 py-2 font-mono text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'signin'
                    ? 'bg-white text-[#000A1F] shadow-xs'
                    : 'text-[#44474F] hover:text-[#000A1F]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setErrorMessage(null); }}
                className={`flex-1 py-2 font-mono text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'register'
                    ? 'bg-white text-[#000A1F] shadow-xs'
                    : 'text-[#44474F] hover:text-[#000A1F]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Sign In Card */}
            {activeTab === 'signin' && (
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
                    disabled={isSubmitting}
                    className="w-full h-10 bg-[#000A1F] hover:bg-[#00204A] disabled:opacity-50 text-white font-mono text-sm font-medium rounded flex items-center justify-center transition-colors mt-6 cursor-pointer tracking-wide"
                  >
                    {isSubmitting ? 'Authenticating...' : 'Sign In'}
                  </button>
                </form>
              </div>
            )}

            {/* Registration Card */}
            {activeTab === 'register' && (
              <div className="bg-white p-8 rounded-xl border border-[#C4C6D0] shadow-sm">
                <h2 className="font-headline font-semibold text-2xl md:text-3xl text-[#000A1F] mb-6">
                  Create Account
                </h2>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider mb-1.5" htmlFor="fullName">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      className="w-full h-10 px-4 bg-white border border-[#C4C6D0] rounded focus:outline-none focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] text-sm text-[#181C1C] transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider mb-1.5" htmlFor="regEmail">
                      Email Address *
                    </label>
                    <input
                      id="regEmail"
                      name="regEmail"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="user@enterprise.com"
                      required
                      className="w-full h-10 px-4 bg-white border border-[#C4C6D0] rounded focus:outline-none focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] text-sm text-[#181C1C] transition-colors font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider mb-1.5" htmlFor="regPassword">
                        Password *
                      </label>
                      <input
                        id="regPassword"
                        name="regPassword"
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full h-10 px-4 bg-white border border-[#C4C6D0] rounded focus:outline-none focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] text-sm text-[#181C1C] transition-colors font-sans"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider mb-1.5" htmlFor="confirmPassword">
                        Confirm Password *
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full h-10 px-4 bg-white border border-[#C4C6D0] rounded focus:outline-none focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] text-sm text-[#181C1C] transition-colors font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider mb-1.5" htmlFor="role">
                      Organization Role *
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as RoleType)}
                      required
                      className="w-full h-10 px-4 bg-white border border-[#C4C6D0] rounded focus:outline-none focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] text-sm text-[#181C1C] transition-colors font-sans"
                    >
                      <option value="factory">Factory (Waste Generator)</option>
                      <option value="recycler">Recycler &amp; Processor</option>
                      <option value="logistics">Logistics Fleet Carrier</option>
                      <option value="admin">Platform Administrator</option>
                    </select>
                  </div>

                  {role !== 'admin' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider mb-1.5" htmlFor="companyName">
                          Company Name
                        </label>
                        <input
                          id="companyName"
                          name="companyName"
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Acme Industrial"
                          className="w-full h-10 px-4 bg-white border border-[#C4C6D0] rounded focus:outline-none focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] text-sm text-[#181C1C] transition-colors font-sans"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs font-medium text-[#44474F] uppercase tracking-wider mb-1.5" htmlFor="phone">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 019-2834"
                          className="w-full h-10 px-4 bg-white border border-[#C4C6D0] rounded focus:outline-none focus:border-[#006A6A] focus:ring-1 focus:ring-[#006A6A] text-sm text-[#181C1C] transition-colors font-sans"
                        />
                      </div>
                    </div>
                  )}


                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-10 bg-[#000A1F] hover:bg-[#00204A] disabled:opacity-50 text-white font-mono text-sm font-medium rounded flex items-center justify-center transition-colors mt-6 cursor-pointer tracking-wide"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Register Account'}
                  </button>
                </form>
              </div>
            )}

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

