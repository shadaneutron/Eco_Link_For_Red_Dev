import React, { useState } from 'react';
import {
  Building2,
  Sliders,
  Bell,
  ShieldCheck,
  Users,
  FileCheck2,
  Key,
  Check,
  Save,
  Plus,
  Trash2,
  Lock,
  RefreshCw,
  AlertCircle,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export interface PortalSettingsPageProps {
  portalType: 'factory' | 'recycler' | 'logistics';
  userName?: string;
  orgName?: string;
  showNotification?: (msg: string) => void;
  onBackToDashboard?: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Pending';
  lastActive: string;
}

interface ComplianceDoc {
  id: string;
  title: string;
  regNumber: string;
  expiryDate: string;
  status: 'Valid' | 'Expiring Soon' | 'Under Review';
}

export const PortalSettingsPage: React.FC<PortalSettingsPageProps> = ({
  portalType,
  userName = 'Ahmed',
  orgName,
  showNotification = (msg) => alert(msg),
  onBackToDashboard
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'profile' | 'operational' | 'notifications' | 'security' | 'team' | 'compliance'
  >('profile');

  // Derived Title & Default Data based on portalType
  const defaultOrg = orgName || (
    portalType === 'factory' ? 'Ahmed Steel Factory' :
    portalType === 'recycler' ? 'Green Recycling Ltd.' :
    'Sustainable Supply Logistics'
  );

  const portalTitle =
    portalType === 'factory' ? 'Factory Portal Settings' :
    portalType === 'recycler' ? 'Recycler Portal Settings' :
    'Logistics & Fleet Settings';

  // State for Profile
  const [companyName, setCompanyName] = useState(defaultOrg);
  const [taxId, setTaxId] = useState('EG-893-019-442');
  const [wastePermit, setWastePermit] = useState('WM-EGYPT-2026-904');
  const [contactName, setContactName] = useState(userName);
  const [contactEmail, setContactEmail] = useState(
    portalType === 'factory' ? 'ahmed@factory.com' :
    portalType === 'recycler' ? 'info@greenrecycling.com' :
    'dispatch@logistics.com'
  );
  const [contactPhone, setContactPhone] = useState('+20 100 234 5678');
  const [address, setAddress] = useState('6th of October Industrial Zone 3, Plot 42, Giza, Egypt');
  const [gpsLocation, setGpsLocation] = useState('29.9792° N, 30.9525° E');

  // State for Operational Preferences
  const [weighbridgeUnit, setWeighbridgeUnit] = useState<'Metric Tons' | 'Kilograms'>('Metric Tons');
  const [workingHours, setWorkingHours] = useState('08:00 AM - 06:00 PM (Sun-Thu)');
  const [autoApproveVerified, setAutoApproveVerified] = useState(true);
  const [capacityThreshold, setCapacityThreshold] = useState('85');
  const [minQualityGrade, setMinQualityGrade] = useState('Grade A & B Metals');
  const [fleetCount, setFleetCount] = useState('18 Active Trucks');
  const [dispatchMode, setDispatchMode] = useState<'Automated Dynamic' | 'Manual Dispatch'>('Automated Dynamic');
  const [telemetryInterval, setTelemetryInterval] = useState('30 Seconds');

  // State for Notifications
  const [emailDispatched, setEmailDispatched] = useState(true);
  const [emailPoD, setEmailPoD] = useState(true);
  const [smsDriver, setSmsDriver] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [complianceWarnings, setComplianceWarnings] = useState(true);

  // State for Security
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [apiKey, setApiKey] = useState('ecolink_live_sk_9042a188f93bc021');
  const [webhookUrl, setWebhookUrl] = useState('https://api.factory.com/webhooks/ecolink');

  // State for Team
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: userName,
      email: contactEmail,
      role: 'Portal Administrator',
      status: 'Active',
      lastActive: 'Just now'
    },
    {
      id: '2',
      name: 'Mohamed Hassan',
      email: 'm.hassan@factory.com',
      role: 'Operations & Compliance Specialist',
      status: 'Active',
      lastActive: '2 hours ago'
    },
    {
      id: '3',
      name: 'Sara Ibrahim',
      email: 'sara.i@factory.com',
      role: 'Weighbridge & Dispatch Supervisor',
      status: 'Pending',
      lastActive: 'Invited yesterday'
    }
  ]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Operations Officer');

  // State for Compliance Documents
  const [documents, setDocuments] = useState<ComplianceDoc[]>([
    {
      id: 'doc-1',
      title: 'Environmental Agency Waste Storage Permit',
      regNumber: 'EAA-PERMIT-2025-09',
      expiryDate: 'Dec 31, 2026',
      status: 'Valid'
    },
    {
      id: 'doc-2',
      title: 'Industrial Hazardous / Scrap Transport License',
      regNumber: 'MOT-LIC-88201',
      expiryDate: 'Nov 15, 2026',
      status: 'Valid'
    },
    {
      id: 'doc-3',
      title: 'ISO 14001 Environmental Management Certificate',
      regNumber: 'ISO-14001-EG-014',
      expiryDate: 'Oct 01, 2026',
      status: 'Expiring Soon'
    }
  ]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('Company profile settings saved successfully!');
  };

  const handleSaveOperational = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('Operational preferences updated!');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('Notification preferences saved!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass) {
      showNotification('Please enter your current password.');
      return;
    }
    if (newPass.length < 8) {
      showNotification('New password must be at least 8 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      showNotification('New password and confirmation do not match.');
      return;
    }
    showNotification('Password changed successfully!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) {
      showNotification('Please enter member name and email.');
      return;
    }
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: 'Pending',
      lastActive: 'Invited just now'
    };
    setTeamMembers([...teamMembers, newMember]);
    showNotification(`Invitation sent to ${inviteEmail}!`);
    setInviteName('');
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleRemoveMember = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from your team?`)) {
      setTeamMembers(teamMembers.filter((m) => m.id !== id));
      showNotification(`${name} has been removed.`);
    }
  };

  const handleGenerateNewKey = () => {
    const newKey = 'ecolink_live_sk_' + Math.random().toString(36).substring(2, 18);
    setApiKey(newKey);
    showNotification('New API Secret Key generated successfully!');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#C4C6D0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#8CF3F3] text-[#007070] font-mono text-[10px] font-semibold uppercase rounded tracking-wider">
              {portalType.toUpperCase()} WORKSPACE
            </span>
            <span className="text-xs text-[#44474F] font-mono">ID: {taxId}</span>
          </div>
          <h1 className="font-headline font-semibold text-3xl text-[#181C1C] tracking-tight mt-1">
            {portalTitle}
          </h1>
          <p className="font-sans text-sm text-[#44474F] mt-0.5">
            Manage company details, operational configurations, security parameters, and team permissions.
          </p>
        </div>

        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer self-start sm:self-auto"
          >
            Back to Dashboard
          </button>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#C4C6D0] pb-2">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
            activeSubTab === 'profile'
              ? 'bg-[#000A1F] text-white shadow-xs'
              : 'bg-white border border-[#C4C6D0] text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Organization Profile</span>
        </button>

        <button
          onClick={() => setActiveSubTab('operational')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
            activeSubTab === 'operational'
              ? 'bg-[#000A1F] text-white shadow-xs'
              : 'bg-white border border-[#C4C6D0] text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Operational Rules</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
            activeSubTab === 'notifications'
              ? 'bg-[#000A1F] text-white shadow-xs'
              : 'bg-white border border-[#C4C6D0] text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts &amp; Notifications</span>
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
            activeSubTab === 'security'
              ? 'bg-[#000A1F] text-white shadow-xs'
              : 'bg-white border border-[#C4C6D0] text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security &amp; API</span>
        </button>

        <button
          onClick={() => setActiveSubTab('team')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
            activeSubTab === 'team'
              ? 'bg-[#000A1F] text-white shadow-xs'
              : 'bg-white border border-[#C4C6D0] text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Team Members ({teamMembers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('compliance')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
            activeSubTab === 'compliance'
              ? 'bg-[#000A1F] text-white shadow-xs'
              : 'bg-white border border-[#C4C6D0] text-[#44474F] hover:bg-[#E6E9E8] hover:text-[#181C1C]'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Compliance Permits</span>
        </button>
      </div>

      {/* SubTab 1: Profile */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-6 shadow-2xs">
            <h2 className="font-sans font-semibold text-lg text-[#181C1C] pb-3 border-b border-[#C4C6D0]">
              Company &amp; Facility Profile
            </h2>

            {/* Logo Banner */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded-lg">
              <div className="w-20 h-20 rounded-xl bg-[#8CF3F3] text-[#007070] font-headline font-bold text-2xl flex items-center justify-center border border-[#007070]/20 flex-shrink-0">
                {companyName.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1 text-center sm:text-left flex-1">
                <p className="font-sans font-semibold text-base text-[#181C1C]">
                  {companyName}
                </p>
                <p className="font-sans text-xs text-[#44474F]">
                  Upload high-resolution corporate logo for digital manifests, e-PoD receipts, and marketplace listings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => showNotification('Logo upload selector opened.')}
                className="px-4 py-2 bg-white border border-[#C4C6D0] rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-4 h-4 text-[#006A6A]" />
                <span>Upload Logo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                  Official Organization Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-sans text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                  Tax Registration Number
                </label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-mono text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                  Environmental Waste Operating Permit ID
                </label>
                <input
                  type="text"
                  value={wastePermit}
                  onChange={(e) => setWastePermit(e.target.value)}
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-mono text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                  Facility GPS Coordinates
                </label>
                <input
                  type="text"
                  value={gpsLocation}
                  onChange={(e) => setGpsLocation(e.target.value)}
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-mono text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                Physical Operations Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-sans text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
              />
            </div>

            <h3 className="font-sans font-semibold text-base text-[#181C1C] pt-4 border-t border-[#C4C6D0]">
              Primary Operational Contact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-sans text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                  Contact Email Address
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-sans text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                  Mobile / WhatsApp Phone
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-mono text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#C4C6D0] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Settings</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* SubTab 2: Operational Rules */}
      {activeSubTab === 'operational' && (
        <form onSubmit={handleSaveOperational} className="space-y-6">
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-6 shadow-2xs">
            <h2 className="font-sans font-semibold text-lg text-[#181C1C] pb-3 border-b border-[#C4C6D0]">
              Operational &amp; Workflow Rules ({portalType.toUpperCase()})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                  Weighbridge Measurement Units
                </label>
                <select
                  value={weighbridgeUnit}
                  onChange={(e) => setWeighbridgeUnit(e.target.value as any)}
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-mono text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                >
                  <option value="Metric Tons">Metric Tons (Tons)</option>
                  <option value="Kilograms">Kilograms (Kg)</option>
                </select>
                <p className="font-sans text-xs text-[#44474F] mt-1">
                  Applies to electronic manifests, weighbridge tickets, and auction bids.
                </p>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                  Standard Gate Receiving Hours
                </label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-sans text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                />
              </div>

              {portalType === 'factory' && (
                <>
                  <div>
                    <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                      Waste Bay Capacity Storage Threshold (%)
                    </label>
                    <input
                      type="number"
                      value={capacityThreshold}
                      onChange={(e) => setCapacityThreshold(e.target.value)}
                      className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-mono text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                    />
                    <p className="font-sans text-xs text-[#44474F] mt-1">
                      Triggers automated pickup warning when waste yard capacity exceeds this %.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded-lg">
                    <div>
                      <p className="font-sans font-semibold text-sm text-[#181C1C]">
                        Auto-Approve Verified Recyclers
                      </p>
                      <p className="font-sans text-xs text-[#44474F]">
                        Automatically allow eco-certified recyclers to place bids without manual pre-vetting.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoApproveVerified(!autoApproveVerified)}
                      className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                        autoApproveVerified ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          autoApproveVerified ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </>
              )}

              {portalType === 'recycler' && (
                <>
                  <div>
                    <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                      Minimum Target Quality Grade
                    </label>
                    <input
                      type="text"
                      value={minQualityGrade}
                      onChange={(e) => setMinQualityGrade(e.target.value)}
                      className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-sans text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded-lg">
                    <div>
                      <p className="font-sans font-semibold text-sm text-[#181C1C]">
                        Instant Auction Outbid Notifications
                      </p>
                      <p className="font-sans text-xs text-[#44474F]">
                        Receive instant alerts when a rival recycler outbids your active scrap listing.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoApproveVerified(!autoApproveVerified)}
                      className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                        autoApproveVerified ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          autoApproveVerified ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </>
              )}

              {portalType === 'logistics' && (
                <>
                  <div>
                    <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                      Active Registered Fleet Count
                    </label>
                    <input
                      type="text"
                      value={fleetCount}
                      onChange={(e) => setFleetCount(e.target.value)}
                      className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-mono text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                      Driver GPS Telemetry Ping Frequency
                    </label>
                    <select
                      value={telemetryInterval}
                      onChange={(e) => setTelemetryInterval(e.target.value)}
                      className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-mono text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                    >
                      <option value="15 Seconds">15 Seconds (Real-Time Precision)</option>
                      <option value="30 Seconds">30 Seconds (Recommended)</option>
                      <option value="1 Minute">1 Minute (Battery Saver)</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-[#C4C6D0] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Operational Rules</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* SubTab 3: Notifications */}
      {activeSubTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="space-y-6">
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-6 shadow-2xs">
            <h2 className="font-sans font-semibold text-lg text-[#181C1C] pb-3 border-b border-[#C4C6D0]">
              Alerts &amp; Real-Time Notification Preferences
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded-lg">
                <div>
                  <p className="font-sans font-semibold text-sm text-[#181C1C]">
                    Shipment Dispatched Email Alerts
                  </p>
                  <p className="font-sans text-xs text-[#44474F]">
                    Receive an email as soon as a transport vehicle is loaded and leaves factory weighbridge.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailDispatched(!emailDispatched)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    emailDispatched ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      emailDispatched ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded-lg">
                <div>
                  <p className="font-sans font-semibold text-sm text-[#181C1C]">
                    Proof of Delivery (e-PoD) Verified Notifications
                  </p>
                  <p className="font-sans text-xs text-[#44474F]">
                    Notify operations team when receiver signs digital manifest and scale receipt.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailPoD(!emailPoD)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    emailPoD ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      emailPoD ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded-lg">
                <div>
                  <p className="font-sans font-semibold text-sm text-[#181C1C]">
                    Driver Mobile SMS &amp; Dispatch Alerts
                  </p>
                  <p className="font-sans text-xs text-[#44474F]">
                    Send automated SMS dispatch notifications directly to driver phones.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSmsDriver(!smsDriver)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    smsDriver ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      smsDriver ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded-lg">
                <div>
                  <p className="font-sans font-semibold text-sm text-[#181C1C]">
                    WhatsApp Enterprise Status Updates
                  </p>
                  <p className="font-sans text-xs text-[#44474F]">
                    Send automated status pings to WhatsApp business group for logistics managers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWhatsappAlerts(!whatsappAlerts)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    whatsappAlerts ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      whatsappAlerts ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded-lg">
                <div>
                  <p className="font-sans font-semibold text-sm text-[#181C1C]">
                    Environmental Compliance &amp; Permit Expiry Warnings
                  </p>
                  <p className="font-sans text-xs text-[#44474F]">
                    Get 30-day advance alerts before waste permits or transport licenses expire.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setComplianceWarnings(!complianceWarnings)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    complianceWarnings ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      complianceWarnings ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C4C6D0] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Alert Preferences</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* SubTab 4: Security */}
      {activeSubTab === 'security' && (
        <div className="space-y-6">
          {/* Password Change Form */}
          <form onSubmit={handleChangePassword} className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-6 shadow-2xs">
            <h2 className="font-sans font-semibold text-lg text-[#181C1C] pb-3 border-b border-[#C4C6D0] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#006A6A]" />
              <span>Change Portal Password</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-mono text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-mono text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-mono text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </div>
          </form>

          {/* 2FA Card */}
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-4 shadow-2xs">
            <h2 className="font-sans font-semibold text-lg text-[#181C1C] pb-3 border-b border-[#C4C6D0] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#006A6A]" />
              <span>Two-Factor Authentication (2FA)</span>
            </h2>

            <div className="flex items-center justify-between p-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded-lg">
              <div>
                <p className="font-sans font-semibold text-sm text-[#181C1C]">
                  Require Authenticator App Code on Sign In
                </p>
                <p className="font-sans text-xs text-[#44474F]">
                  Protects weighbridge logs, manifest signatures, and financial payouts with time-based OTP.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  showNotification(twoFactorEnabled ? '2FA Disabled.' : '2FA Protection Activated!');
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  twoFactorEnabled ? 'bg-[#006A6A]' : 'bg-[#C4C6D0]'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* API Keys & Webhooks */}
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-6 shadow-2xs">
            <h2 className="font-sans font-semibold text-lg text-[#181C1C] pb-3 border-b border-[#C4C6D0] flex items-center gap-2">
              <Key className="w-5 h-5 text-[#006A6A]" />
              <span>Developer API &amp; Webhooks</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                  Live API Secret Key
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={apiKey}
                    className="flex-1 p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-mono text-[#181C1C]"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateNewKey}
                    className="px-4 py-2.5 border border-[#C4C6D0] bg-white rounded font-mono text-xs font-medium text-[#181C1C] hover:bg-[#E6E9E8] transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4 text-[#006A6A]" />
                    <span>Regenerate Key</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1.5">
                  e-PoD &amp; Manifest Event Webhook URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1 p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-mono text-[#181C1C] focus:border-[#006A6A] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => showNotification('Webhook endpoint saved!')}
                    className="px-5 py-2.5 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer"
                  >
                    Save Endpoint
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 5: Team Members */}
      {activeSubTab === 'team' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-3 border-b border-[#C4C6D0]">
              <div>
                <h2 className="font-sans font-semibold text-lg text-[#181C1C]">
                  Team Members &amp; Access Roles
                </h2>
                <p className="font-sans text-xs text-[#44474F]">
                  Grant team access to weighbridge recording, dispatch management, and accounting reports.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Invite Team Member</span>
              </button>
            </div>

            {/* Member Table */}
            <div className="overflow-x-auto border border-[#C4C6D0] rounded-lg">
              <table className="w-full text-left font-sans text-sm">
                <thead className="bg-[#F1F4F3] text-[#44474F] font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-semibold">MEMBER NAME</th>
                    <th className="px-4 py-3 font-semibold">EMAIL ADDRESS</th>
                    <th className="px-4 py-3 font-semibold">ROLE</th>
                    <th className="px-4 py-3 font-semibold">STATUS</th>
                    <th className="px-4 py-3 font-semibold">LAST ACTIVE</th>
                    <th className="px-4 py-3 font-semibold text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C4C6D0]">
                  {teamMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-[#F7FAF9]">
                      <td className="px-4 py-3 text-[#181C1C] font-medium">{m.name}</td>
                      <td className="px-4 py-3 text-[#44474F] font-mono text-xs">{m.email}</td>
                      <td className="px-4 py-3 text-[#181C1C]">{m.role}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] rounded font-semibold uppercase ${
                            m.status === 'Active'
                              ? 'bg-[#8CF3F3] text-[#007070]'
                              : 'bg-[#E6E9E8] text-[#44474F]'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#44474F] text-xs font-mono">{m.lastActive}</td>
                      <td className="px-4 py-3 text-right">
                        {m.id !== '1' && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(m.id, m.name)}
                            className="p-1 text-[#44474F] hover:text-[#BA1A1A] transition-colors cursor-pointer"
                            title="Remove Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 6: Compliance Permits */}
      {activeSubTab === 'compliance' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#C4C6D0] rounded-lg p-6 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-3 border-b border-[#C4C6D0]">
              <div>
                <h2 className="font-sans font-semibold text-lg text-[#181C1C]">
                  Environmental Compliance &amp; Operating Permits
                </h2>
                <p className="font-sans text-xs text-[#44474F]">
                  Upload legal licenses required for industrial waste generation, transport permits, and recycling.
                </p>
              </div>

              <button
                type="button"
                onClick={() => showNotification('Permit upload dialog opened.')}
                className="px-4 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A] transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New Permit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 bg-[#F1F4F3] border border-[#C4C6D0] rounded-lg space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-mono text-[10px] text-[#44474F] uppercase tracking-wider">PERMIT CERTIFICATE</p>
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded font-semibold uppercase ${
                          doc.status === 'Valid'
                            ? 'bg-[#8CF3F3] text-[#007070]'
                            : 'bg-[#FFDAD6] text-[#BA1A1A]'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    <h3 className="font-sans font-semibold text-base text-[#181C1C]">
                      {doc.title}
                    </h3>

                    <p className="font-mono text-xs text-[#44474F]">
                      Registration: <span className="font-bold text-[#181C1C]">{doc.regNumber}</span>
                    </p>

                    <p className="font-sans text-xs text-[#44474F]">
                      Expires: <span className="font-medium text-[#181C1C]">{doc.expiryDate}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#C4C6D0] flex items-center gap-3 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => showNotification(`Viewing ${doc.title}...`)}
                      className="text-[#006A6A] font-medium hover:underline cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => showNotification(`Renewing ${doc.title}...`)}
                      className="text-[#006A6A] font-medium hover:underline cursor-pointer ml-auto"
                    >
                      Renew
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#C4C6D0] rounded-xl max-w-md w-full p-6 space-y-6 shadow-xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#C4C6D0]">
              <h3 className="font-sans font-semibold text-lg text-[#181C1C]">
                Invite Team Member
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-[#44474F] hover:text-[#181C1C] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteMember} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Hassan Mahmoud"
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-sans text-[#181C1C]"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
                  Corporate Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="hassan@company.com"
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-sans text-[#181C1C]"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#44474F] uppercase tracking-wider mb-1">
                  Access Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full p-2.5 bg-[#F1F4F3] border border-[#C4C6D0] rounded text-sm font-sans text-[#181C1C]"
                >
                  <option value="Operations & Compliance Specialist">Operations &amp; Compliance Specialist</option>
                  <option value="Weighbridge Supervisor">Weighbridge Supervisor</option>
                  <option value="Dispatch & Logistics Officer">Dispatch &amp; Logistics Officer</option>
                  <option value="Billing & Financial Auditor">Billing &amp; Financial Auditor</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#C4C6D0] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-[#C4C6D0] rounded font-mono text-xs text-[#181C1C] hover:bg-[#E6E9E8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#000A1F] text-white rounded font-mono text-xs font-semibold hover:bg-[#00204A]"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
