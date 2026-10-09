'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  CreditCard, 
  Store, 
  Mail, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  Edit3, 
  RefreshCw,
  TrendingUp,
  FileSpreadsheet,
  Building2,
  Phone,
  Lock,
  ArrowRight,
  Sparkles,
  DollarSign,
  UserCheck,
  Shield,
  Eye,
  LogOut,
  Sliders,
  History,
  FileCheck,
  Award,
  Layers,
  Check,
  X,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import AnnouncementBar from '@/components/AnnouncementBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { api } from '@/lib/api';
import { DelegateRegistration, PaperSubmission } from '@/types';
import { useAuth, UserRole } from '@/context/AuthContext';

export default function AdminPage() {
  const { user, login, logout, checkSession } = useAuth();
  
  // Active Tab state
  const [activeTab, setActiveTab] = useState<
    'overview' | 'delegates' | 'papers' | 'booths' | 'sponsorship' | 'finance' | 'inquiries' | 'cms' | 'staff' | 'audit'
  >('overview');

  // Login gate state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data states
  const [overviewData, setOverviewData] = useState<any>(null);
  const [registrations, setRegistrations] = useState<DelegateRegistration[]>([]);
  const [papers, setPapers] = useState<PaperSubmission[]>([]);
  const [booths, setBooths] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [staffUsers, setStaffUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals state
  const [selectedPaper, setSelectedPaper] = useState<PaperSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(8.5);
  const [commentsInput, setCommentsInput] = useState<string>('');
  const [paperStatusInput, setPaperStatusInput] = useState<string>('Accepted for Oral Presentation');

  const [selectedBooth, setSelectedBooth] = useState<any | null>(null);
  const [boothCompanyInput, setBoothCompanyInput] = useState('');
  const [boothContactInput, setBoothContactInput] = useState('');
  const [boothEmailInput, setBoothEmailInput] = useState('');
  const [boothMobileInput, setBoothMobileInput] = useState('');
  const [boothStatusInput, setBoothStatusInput] = useState('Confirmed');

  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [inquiryNotesInput, setInquiryNotesInput] = useState('');
  const [inquiryStatusInput, setInquiryStatusInput] = useState('In Progress');
  const [inquiryAssignInput, setInquiryAssignInput] = useState('Secretariat Staff');

  // Staff creation modal state
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Secretariat Staff');
  const [showStaffModal, setShowStaffModal] = useState(false);

  // CMS Form state
  const [cmsForm, setCmsForm] = useState({
    conferenceName: 'GUJCORR 2027',
    tagline: 'Stronger Together: Uniting the Global Fight Against Corrosion',
    dates: '18th – 20th February 2027',
    venue: 'Vadodara, Gujarat, India',
    abstractDeadline: '11th October 2026',
    earlyBirdDeadline: '30th October 2026',
    organizerEmail: 'iim.barodachapter@gmail.com',
    organizerPhone: '+91 9988881674'
  });

  const isStaffAuthorized = !!(
    user && [
      'Super Administrator',
      'Administrator',
      'Secretariat Staff',
      'Finance Staff',
      'Paper Coordinator',
      'Reviewer',
      'Content Editor',
      'Admin'
    ].includes(user.role)
  );

  const isSuperAdmin = user?.role === 'Super Administrator' || user?.role === 'Admin';

  useEffect(() => {
    if (isStaffAuthorized) {
      loadAllAdminData();
    }
  }, [isStaffAuthorized]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const loadAllAdminData = async () => {
    setIsLoadingData(true);
    try {
      const [overRes, regRes, papRes, boothRes, inqRes, cmsRes, userRes, audRes] = await Promise.allSettled([
        api.getAdminOverview(),
        fetch('/api/admin/registrations', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/admin/papers', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/admin/booths', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/admin/inquiries', { credentials: 'include' }).then(r => r.json()),
        api.getCmsContent(),
        api.getAdminUsers(),
        api.getAuditLogs('all', 50)
      ]);

      if (overRes.status === 'fulfilled' && overRes.value.data) {
        setOverviewData(overRes.value.data);
      }
      if (regRes.status === 'fulfilled' && regRes.value.data) {
        setRegistrations(regRes.value.data);
      }
      if (papRes.status === 'fulfilled' && papRes.value.data) {
        setPapers(papRes.value.data);
      }
      if (boothRes.status === 'fulfilled' && boothRes.value.data) {
        setBooths(boothRes.value.data);
      }
      if (inqRes.status === 'fulfilled' && inqRes.value.data) {
        setInquiries(inqRes.value.data);
      }
      if (cmsRes.status === 'fulfilled' && cmsRes.value.data) {
        setCmsContent(cmsRes.value.data);
        if (cmsRes.value.data.general) {
          setCmsForm(prev => ({
            ...prev,
            conferenceName: cmsRes.value.data.general.conferenceName || prev.conferenceName,
            tagline: cmsRes.value.data.general.tagline || prev.tagline,
            dates: cmsRes.value.data.general.dates || prev.dates,
            venue: cmsRes.value.data.general.venue || prev.venue,
            organizerEmail: cmsRes.value.data.general.email || prev.organizerEmail,
            organizerPhone: cmsRes.value.data.general.phone || prev.organizerPhone,
            abstractDeadline: cmsRes.value.data.deadlines?.abstractSubmission || prev.abstractDeadline,
            earlyBirdDeadline: cmsRes.value.data.deadlines?.earlyBirdRegistration || prev.earlyBirdDeadline
          }));
        }
      }
      if (userRes.status === 'fulfilled' && userRes.value.data) {
        setStaffUsers(userRes.value.data);
      }
      if (audRes.status === 'fulfilled' && audRes.value.data) {
        setAuditLogs(audRes.value.data);
      }
    } catch (err) {
      console.warn('Error loading admin records:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await login(loginEmail, loginPassword, 'Admin');
      if (res.success) {
        showToast('Authenticated successfully with server-verified credentials.');
      } else {
        setLoginError(res.message || 'Invalid administrative email or password.');
      }
    } catch {
      setLoginError('Authentication error occurred. Please check network connectivity.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    showToast('Signed out of administrative console.');
  };

  // Delegate actions
  const handleUpdateDelegateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const res = await api.updateRegistration(ticketId, newStatus);
      if (res.success) {
        showToast(`Registration #${ticketId} status updated to "${newStatus}".`);
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed updating status.');
      }
    } catch (err) {
      alert('Error updating delegate status.');
    }
  };

  // Paper review save
  const handleSavePaperReview = async () => {
    if (!selectedPaper) return;
    const paperCode = selectedPaper.paperCode || selectedPaper.id;
    try {
      const res = await api.updatePaperDecision(paperCode, scoreInput, commentsInput, paperStatusInput, user?.email);
      if (res.success) {
        showToast(`Paper #${paperCode} reviewed: Score ${scoreInput}/10, Status: "${paperStatusInput}".`);
        setSelectedPaper(null);
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed saving review.');
      }
    } catch {
      alert('Error saving review decision.');
    }
  };

  // Booth allocation save
  const handleSaveBoothAllocation = async () => {
    if (!selectedBooth) return;
    try {
      const res = await api.updateBoothAllocation(selectedBooth.boothNumber, boothStatusInput, {
        companyName: boothCompanyInput,
        contactPerson: boothContactInput,
        email: boothEmailInput,
        mobileNumber: boothMobileInput
      });
      if (res.success) {
        showToast(`Booth #${selectedBooth.boothNumber} updated to "${boothStatusInput}".`);
        setSelectedBooth(null);
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed updating booth.');
      }
    } catch {
      alert('Error updating booth reservation.');
    }
  };

  // Inquiry update save
  const handleSaveInquiry = async () => {
    if (!selectedInquiry) return;
    try {
      const res = await api.updateInquiry(selectedInquiry.id, inquiryStatusInput, inquiryNotesInput, inquiryAssignInput);
      if (res.success) {
        showToast(`Inquiry #${selectedInquiry.id} updated.`);
        setSelectedInquiry(null);
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed updating inquiry.');
      }
    } catch {
      alert('Error updating inquiry status.');
    }
  };

  // CMS update save
  const handleSaveCmsContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        general: {
          conferenceName: cmsForm.conferenceName,
          tagline: cmsForm.tagline,
          dates: cmsForm.dates,
          venue: cmsForm.venue,
          email: cmsForm.organizerEmail,
          phone: cmsForm.organizerPhone
        },
        deadlines: {
          abstractSubmission: cmsForm.abstractDeadline,
          earlyBirdRegistration: cmsForm.earlyBirdDeadline
        }
      };

      const res = await api.updateCmsContent('general', payload.general);
      await api.updateCmsContent('deadlines', payload.deadlines);

      if (res.success) {
        showToast('Live conference CMS content updated and published successfully.');
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed publishing CMS content.');
      }
    } catch {
      alert('Error publishing CMS updates.');
    }
  };

  // Staff creation
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createAdminUser({
        email: newStaffEmail,
        fullName: newStaffName,
        password: newStaffPassword,
        role: newStaffRole
      });
      if (res.success) {
        showToast(`Staff account provisioned for ${newStaffEmail}.`);
        setShowStaffModal(false);
        setNewStaffEmail('');
        setNewStaffName('');
        setNewStaffPassword('');
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed creating staff user.');
      }
    } catch {
      alert('Error provisioning staff account.');
    }
  };

  // Toggle Staff status
  const handleToggleStaffStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Disabled' : 'Active';
    if (!confirm(`Are you sure you want to change this staff account to ${nextStatus}?`)) return;

    try {
      const res = await api.updateAdminUserStatus(userId, nextStatus as any);
      if (res.success) {
        showToast(`Account status updated to ${nextStatus}.`);
        loadAllAdminData();
      } else {
        alert(res.message || 'Failed toggling status.');
      }
    } catch {
      alert('Error toggling staff status.');
    }
  };

  // CSV Exports
  const exportDelegatesCsv = () => {
    const headers = ['Ticket ID', 'Full Name', 'Email', 'Mobile', 'Organization', 'Designation', 'Category', 'Total Amount', 'Status', 'Date'];
    const rows = registrations.map(r => [
      r.ticketId || r.id,
      `"${r.fullName}"`,
      r.email,
      r.mobileNumber,
      `"${r.organization}"`,
      `"${r.designation}"`,
      r.category,
      r.totalAmount || 4720,
      r.status,
      r.registrationDate?.split('T')[0] || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GUJCORR_2027_Delegates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPapersCsv = () => {
    const headers = ['Paper Code', 'Author Name', 'Email', 'Mobile', 'Organization', 'Symposium ID', 'Symposium Title', 'Paper Title', 'Type', 'Status', 'Review Score'];
    const rows = papers.map(p => [
      p.paperCode || p.id,
      `"${p.fullName}"`,
      p.email,
      p.mobileNumber,
      `"${p.companyName}"`,
      p.symposiumId,
      `"${p.symposiumTitle}"`,
      `"${(p.paperTitle || '').replace(/"/g, '""')}"`,
      p.presentationType,
      p.status,
      p.reviewScore || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GUJCORR_2027_Papers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics computation from overviewData or local
  const totalDelegates = overviewData?.registrations?.total ?? registrations.length;
  const confirmedDelegates = overviewData?.registrations?.confirmed ?? registrations.filter(r => (r.status || '').toLowerCase().includes('confirmed')).length;
  const verifiedRevenue = overviewData?.registrations?.verifiedRevenue ?? registrations.filter(r => (r.status || '').toLowerCase().includes('confirmed')).reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);
  const outstandingRevenue = overviewData?.registrations?.outstandingRevenue ?? registrations.filter(r => (r.status || '').toLowerCase().includes('pending')).reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);
  const totalPapers = overviewData?.papers?.total ?? papers.length;
  const acceptedPapers = overviewData?.papers?.accepted ?? papers.filter(p => (p.status || '').toLowerCase().includes('accepted')).length;
  const totalBoothsBooked = overviewData?.exhibition?.booked ?? booths.filter(b => b.status === 'Confirmed' || b.status === 'Reserved').length;
  const unreadInquiries = overviewData?.inquiries?.unread ?? inquiries.filter(i => (i.status || '').toLowerCase() === 'unread').length;

  // Filtered Delegate records
  const filteredDelegates = registrations.filter(r => {
    const q = searchTerm.toLowerCase();
    const matchQuery = (r.fullName || '').toLowerCase().includes(q) ||
                       (r.email || '').toLowerCase().includes(q) ||
                       (r.ticketId || '').toLowerCase().includes(q) ||
                       (r.organization || '').toLowerCase().includes(q);
    if (statusFilter !== 'all' && (r.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (categoryFilter !== 'all' && (r.category || '').toLowerCase() !== categoryFilter.toLowerCase()) return false;
    return matchQuery;
  });

  // Filtered Paper records
  const filteredPapers = papers.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchQuery = (p.paperTitle || '').toLowerCase().includes(q) ||
                       (p.fullName || '').toLowerCase().includes(q) ||
                       (p.paperCode || p.id || '').toLowerCase().includes(q) ||
                       (p.symposiumTitle || '').toLowerCase().includes(q);
    if (statusFilter !== 'all' && !(p.status || '').toLowerCase().includes(statusFilter.toLowerCase())) return false;
    return matchQuery;
  });

  // Filtered Booth records
  const filteredBooths = booths.filter(b => {
    const q = searchTerm.toLowerCase();
    const matchQuery = (b.companyName || b.company_name || '').toLowerCase().includes(q) ||
                       (b.contactPerson || b.contact_person || '').toLowerCase().includes(q) ||
                       (b.boothNumber || b.stallNumber || '').toLowerCase().includes(q);
    if (statusFilter !== 'all' && (b.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
    return matchQuery;
  });

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter(i => {
    const q = searchTerm.toLowerCase();
    const matchQuery = (i.name || '').toLowerCase().includes(q) ||
                       (i.email || '').toLowerCase().includes(q) ||
                       (i.subject || '').toLowerCase().includes(q) ||
                       (i.organization || '').toLowerCase().includes(q);
    if (statusFilter !== 'all' && (i.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
    return matchQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between" suppressHydrationWarning>
      <AnnouncementBar />
      <Navbar />

      <PageHeader
        badge="Enterprise Control Center"
        title="Conference Secretariat"
        highlightedTitle="Master Admin Panel"
        description="Centralized administration for GUJCORR 2027 delegates, peer-review editorial scoring, exhibition floor allocation, and revenue reconciliation."
        breadcrumbs={[{ label: 'Admin Portal' }]}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* 1. AUTHENTICATION GATE (Server-Validated, No Insecure PINs) */}
        {!isStaffAuthorized ? (
          <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded">
                Restricted Administrative Area
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Staff Authentication Required
              </h2>
              <p className="text-xs text-slate-500">
                Sign in with authorized conference credentials to access registration manifests, paper scoring, booth allocation, and financial auditing.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Administrative Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. admin@gujcorr.org"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Enter administrative password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isLoggingIn ? 'Verifying Credentials...' : 'Sign In to Secretariat Panel →'}</span>
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              Need staff credentials? Contact the AMPP Gujarat Chapter &amp; IIM Baroda Secretariat (<code>iim.barodachapter@gmail.com</code>).
            </div>
          </div>
        ) : (
          <>
            {/* 2. AUTHENTICATED STAFF STATUS HEADER */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                  {user?.fullName?.charAt(0) || 'A'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm sm:text-base">{user?.fullName}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {user?.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadAllAdminData}
                  disabled={isLoadingData}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Refresh all datasets"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Toast feedback */}
            {toastMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{toastMessage}</span>
                </div>
              </div>
            )}

            {/* 3. NAVIGATION TABS (10 ENTERPRISE MODULES) */}
            <div className="flex overflow-x-auto gap-1 p-1.5 bg-slate-200/70 rounded-2xl mb-8 scrollbar-none text-xs font-bold">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'delegates', label: `Delegates (${registrations.length})`, icon: Users },
                { id: 'papers', label: `Papers (${papers.length})`, icon: FileText },
                { id: 'booths', label: `Booths (${booths.length})`, icon: Store },
                { id: 'sponsorship', label: 'Sponsors & Souvenir', icon: Award },
                { id: 'finance', label: 'Finance & Billing', icon: DollarSign },
                { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Mail },
                { id: 'cms', label: 'Website CMS', icon: Edit3 },
                ...(isSuperAdmin ? [{ id: 'staff', label: `Staff (${staffUsers.length})`, icon: ShieldCheck }] : []),
                { id: 'audit', label: 'Audit Trail', icon: History }
              ].map(t => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setActiveTab(t.id as any); setSearchTerm(''); }}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ============================================================== */}
            {/* MODULE 1: EXECUTIVE OVERVIEW (3.1) */}
            {/* ============================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in">
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Total Delegates</span>
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">{totalDelegates}</div>
                    <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{confirmedDelegates} Confirmed &amp; Paid</span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Verified Revenue</span>
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <DollarSign className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-emerald-700">₹{verifiedRevenue.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-amber-600 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>₹{outstandingRevenue.toLocaleString('en-IN')} Pending Verification</span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Papers / CFP</span>
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">{totalPapers}</div>
                    <div className="text-xs text-purple-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{acceptedPapers} Accepted for Presentation</span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Exhibition Space</span>
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Store className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900">{totalBoothsBooked} / 42</div>
                    <div className="text-xs text-slate-500 font-bold flex items-center gap-1">
                      <span>{42 - totalBoothsBooked} Stalls Available</span>
                    </div>
                  </div>
                </div>

                {/* Categories & Symposia breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-red-600" />
                      <span>Registration Categories Breakdown</span>
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: 'IIM / AMPP Member', count: registrations.filter(r => (r.category || '').includes('Member')).length, price: '₹4,720' },
                        { name: 'Non-Member Delegate', count: registrations.filter(r => (r.category || '').includes('Non-Member')).length, price: '₹7,670' },
                        { name: 'Student Delegate', count: registrations.filter(r => (r.category || '').includes('Student')).length, price: '₹1,770' }
                      ].map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{c.name}</span>
                            <span className="text-slate-400 block text-[11px]">Tariff with 18% GST: {c.price}</span>
                          </div>
                          <span className="font-extrabold text-slate-900 px-3 py-1 bg-white border border-slate-200 rounded-xl">
                            {c.count} Registered
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <History className="w-4 h-4 text-blue-600" />
                      <span>Recent Administrative Actions</span>
                    </h3>
                    <div className="space-y-2">
                      {auditLogs.slice(0, 5).map((log, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900">{log.action}</span>
                            <span className="text-[10px] text-slate-400">{log.createdAt?.split('T')[0]}</span>
                          </div>
                          <div className="text-slate-600 text-[11px] truncate">{log.details}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 2: DELEGATES & REGISTRATIONS (3.3) */}
            {/* ============================================================== */}
            {activeTab === 'delegates' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search delegate, email, pass ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportDelegatesCsv}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Ticket ID</th>
                        <th className="py-3 px-4">Delegate Name</th>
                        <th className="py-3 px-4">Organization</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDelegates.map((reg, idx) => {
                        const isPaid = (reg.status || '').toLowerCase().includes('confirmed');
                        return (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">{reg.ticketId || reg.id}</td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{reg.fullName}</div>
                              <div className="text-[11px] text-slate-400">{reg.email}</div>
                            </td>
                            <td className="py-3 px-4 font-medium">{reg.organization}</td>
                            <td className="py-3 px-4 font-medium">{reg.category}</td>
                            <td className="py-3 px-4 font-bold text-slate-900">₹{(reg.totalAmount || 4720).toLocaleString('en-IN')}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {reg.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1">
                              {!isPaid ? (
                                <button
                                  onClick={() => handleUpdateDelegateStatus(reg.ticketId || reg.id, 'Confirmed')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Confirm Pass
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateDelegateStatus(reg.ticketId || reg.id, 'Pending')}
                                  className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Hold Pass
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 3: TECHNICAL PAPERS & CFP (3.4) */}
            {/* ============================================================== */}
            {activeTab === 'papers' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search paper title, author, code..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={exportPapersCsv}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Papers CSV</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Paper Code</th>
                        <th className="py-3 px-4">Author &amp; Org</th>
                        <th className="py-3 px-4">Symposium &amp; Title</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPapers.map((p, idx) => {
                        const isAcc = (p.status || '').toLowerCase().includes('accepted');
                        return (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.paperCode || p.id}</td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{p.fullName}</div>
                              <div className="text-[11px] text-slate-400">{p.companyName}</div>
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <div className="font-bold text-slate-900 truncate">{p.paperTitle}</div>
                              <div className="text-[11px] text-slate-500 truncate">{p.symposiumTitle}</div>
                            </td>
                            <td className="py-3 px-4 font-bold text-purple-700">
                              {p.reviewScore ? `${p.reviewScore}/10` : 'Pending'}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                isAcc ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedPaper(p);
                                  setScoreInput(p.reviewScore || 8.5);
                                  setCommentsInput(p.reviewComments || '');
                                  setPaperStatusInput(p.status || 'Accepted for Oral Presentation');
                                }}
                                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Score / Decision
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Score Modal */}
                {selectedPaper && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h4 className="font-extrabold text-slate-900 text-sm">Review Evaluation: {selectedPaper.paperCode || selectedPaper.id}</h4>
                        <button onClick={() => setSelectedPaper(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                        <div className="font-bold text-slate-900">{selectedPaper.paperTitle}</div>
                        <div className="text-[11px] text-slate-500">{selectedPaper.fullName} ({selectedPaper.companyName})</div>
                        <p className="text-[11px] text-slate-600 mt-2 line-clamp-3">{selectedPaper.abstract}</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Peer Review Score (0.0 to 10.0)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={scoreInput}
                            onChange={e => setScoreInput(parseFloat(e.target.value) || 0)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Editorial Decision</label>
                          <select
                            value={paperStatusInput}
                            onChange={e => setPaperStatusInput(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl font-bold"
                          >
                            <option value="Accepted for Oral Presentation">Accepted for Oral Presentation</option>
                            <option value="Accepted for Poster Presentation">Accepted for Poster Presentation</option>
                            <option value="Revision Required">Revision Required</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Committee Comments &amp; Rationale</label>
                          <textarea
                            rows={3}
                            value={commentsInput}
                            onChange={e => setCommentsInput(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                            placeholder="Enter review committee feedback..."
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t">
                        <button onClick={() => setSelectedPaper(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
                        <button onClick={handleSavePaperReview} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">Save &amp; Audit Log</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 4: EXHIBITION BOOTHS (3.5) */}
            {/* ============================================================== */}
            {activeTab === 'booths' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Exhibition Floor Plan (42 Stalls)</h3>
                    <p className="text-xs text-slate-500">Official GUJCORR Expo layout in Vadodara: 12 sqm &amp; 9 sqm stalls.</p>
                  </div>
                  <div className="text-xs font-bold text-emerald-600">
                    {totalBoothsBooked} Occupied / {42 - totalBoothsBooked} Open
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
                  {filteredBooths.map((b, idx) => {
                    const isOcc = b.status === 'Confirmed' || b.status === 'Reserved';
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedBooth(b);
                          setBoothCompanyInput(b.companyName || '');
                          setBoothContactInput(b.contactPerson || '');
                          setBoothEmailInput(b.email || '');
                          setBoothMobileInput(b.mobileNumber || '');
                          setBoothStatusInput(b.status || 'Confirmed');
                        }}
                        className={`p-3 rounded-2xl border text-center cursor-pointer transition-all hover:scale-102 ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : b.status === 'Reserved'
                            ? 'bg-amber-50 border-amber-300 text-amber-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <div className="font-black text-sm">{b.boothNumber}</div>
                        <div className="text-[10px] font-bold text-slate-500">{b.boothSize}</div>
                        <div className="text-[10px] font-extrabold mt-1 truncate">
                          {b.companyName ? b.companyName : 'Available'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Booth Modal */}
                {selectedBooth && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h4 className="font-extrabold text-slate-900 text-sm">Booth #{selectedBooth.boothNumber} Allocation</h4>
                        <button onClick={() => setSelectedBooth(null)}><X className="w-5 h-5 text-slate-400" /></button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Company / Exhibitor Name</label>
                          <input
                            type="text"
                            value={boothCompanyInput}
                            onChange={e => setBoothCompanyInput(e.target.value)}
                            placeholder="e.g. CorroServe Technologies"
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person</label>
                          <input
                            type="text"
                            value={boothContactInput}
                            onChange={e => setBoothContactInput(e.target.value)}
                            placeholder="e.g. Deepak Merchant"
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                            <input
                              type="email"
                              value={boothEmailInput}
                              onChange={e => setBoothEmailInput(e.target.value)}
                              className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Mobile</label>
                            <input
                              type="text"
                              value={boothMobileInput}
                              onChange={e => setBoothMobileInput(e.target.value)}
                              className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                          <select
                            value={boothStatusInput}
                            onChange={e => setBoothStatusInput(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl font-bold"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Available">Available (Release)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t">
                        <button onClick={() => setSelectedBooth(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
                        <button onClick={handleSaveBoothAllocation} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">Commit Allocation</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 5: SPONSORSHIP & SOUVENIR (3.6) */}
            {/* ============================================================== */}
            {activeTab === 'sponsorship' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { tier: 'Diamond Sponsor', rate: '₹5,00,000 + GST', delegates: '5 Delegates', stall: '12 sqm Stall', color: 'border-blue-300 bg-blue-50/50' },
                    { tier: 'Gold Sponsor', rate: '₹3,00,000 + GST', delegates: '3 Delegates', stall: '9 sqm Stall', color: 'border-amber-300 bg-amber-50/50' },
                    { tier: 'Silver Sponsor', rate: '₹2,00,000 + GST', delegates: '2 Delegates', stall: '6 sqm Stall', color: 'border-slate-300 bg-slate-50' }
                  ].map((p, i) => (
                    <div key={i} className={`p-6 rounded-3xl border ${p.color} space-y-3`}>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white border">{p.tier}</span>
                      <div className="text-2xl font-black text-slate-900">{p.rate}</div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <div>&bull; {p.delegates} included</div>
                        <div>&bull; {p.stall} included</div>
                        <div>&bull; Full-page souvenir advertisement</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
                  <h3 className="font-extrabold text-slate-900 text-sm">Conference Souvenir Advertising Tariff</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <div className="font-bold text-slate-500">Back Cover</div>
                      <div className="text-lg font-black text-slate-900">₹45,000</div>
                      <div className="text-[11px] text-slate-400">+18% GST</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <div className="font-bold text-slate-500">Inside Covers</div>
                      <div className="text-lg font-black text-slate-900">₹30,000</div>
                      <div className="text-[11px] text-slate-400">+18% GST</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <div className="font-bold text-slate-500">Full Page Special</div>
                      <div className="text-lg font-black text-slate-900">₹20,000</div>
                      <div className="text-[11px] text-slate-400">+18% GST</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <div className="font-bold text-slate-500">Half Page Regular</div>
                      <div className="text-lg font-black text-slate-900">₹10,000</div>
                      <div className="text-[11px] text-slate-400">+18% GST</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 6: FINANCE & BILLING (3.7) */}
            {/* ============================================================== */}
            {activeTab === 'finance' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Financial Reconciliation &amp; Tax Invoices</h3>
                    <p className="text-xs text-slate-500">SAC Code: 998397 &bull; Applicable GST Rate: 18% (9% CGST + 9% SGST)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Gross Verified Collections</span>
                    <div className="text-2xl font-black text-emerald-700">₹{verifiedRevenue.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-slate-500 mt-1">Confirmed NEFT/UPI passes</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">18% GST Component</span>
                    <div className="text-2xl font-black text-blue-700">₹{Math.round(verifiedRevenue * 18 / 118).toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-slate-500 mt-1">CGST 9% + SGST 9%</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Outstanding Invoices</span>
                    <div className="text-2xl font-black text-amber-700">₹{outstandingRevenue.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-slate-500 mt-1">Pending receipt verification</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2 border">
                  <div className="font-bold text-slate-900">Official Conference Bank Account:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                    <div>Bank: <strong>Union Bank of India</strong> (Dandia Bazar Branch, Vadodara)</div>
                    <div>Account Name: <strong>The Indian Institute of Metals Baroda Chapter</strong></div>
                    <div>Account Number: <strong>520101234030441</strong></div>
                    <div>IFSC Code: <strong>UBIN0901555</strong></div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 7: INQUIRIES & COMMUNICATIONS (3.8) */}
            {/* ============================================================== */}
            {activeTab === 'inquiries' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base">Delegate &amp; Sponsor Inquiries Inbox</h3>
                  <div className="text-xs text-slate-500">{unreadInquiries} Unread inquiries</div>
                </div>

                <div className="space-y-3">
                  {filteredInquiries.map((inq, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-white transition-all space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{inq.name}</span>
                          <span className="text-slate-400">({inq.organization || inq.email})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          inq.status === 'Unread' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800">{inq.subject}</div>
                      <p className="text-slate-600">{inq.message}</p>
                      
                      {inq.internalNotes && (
                        <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                          <strong>Internal Staff Note:</strong> {inq.internalNotes}
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setInquiryStatusInput(inq.status);
                            setInquiryNotesInput(inq.internalNotes || '');
                            setInquiryAssignInput(inq.assignedTo || 'Secretariat Staff');
                          }}
                          className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Update / Note
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inquiry Modal */}
                {selectedInquiry && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h4 className="font-extrabold text-slate-900 text-sm">Inquiry Resolution</h4>
                        <button onClick={() => setSelectedInquiry(null)}><X className="w-5 h-5 text-slate-400" /></button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                          <select
                            value={inquiryStatusInput}
                            onChange={e => setInquiryStatusInput(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl font-bold"
                          >
                            <option value="Unread">Unread</option>
                            <option value="Read">Read</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Assign Staff</label>
                          <select
                            value={inquiryAssignInput}
                            onChange={e => setInquiryAssignInput(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                          >
                            <option value="Secretariat Staff">Secretariat Staff</option>
                            <option value="Paper Coordinator">Paper Coordinator</option>
                            <option value="Finance Staff">Finance Staff</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Private Internal Notes</label>
                          <textarea
                            rows={3}
                            value={inquiryNotesInput}
                            onChange={e => setInquiryNotesInput(e.target.value)}
                            placeholder="Add internal action notes..."
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t">
                        <button onClick={() => setSelectedInquiry(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
                        <button onClick={handleSaveInquiry} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">Save Updates</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 8: CONFERENCE WEBSITE CMS (3.2) */}
            {/* ============================================================== */}
            {activeTab === 'cms' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 animate-in fade-in">
                <div className="border-b pb-4">
                  <h3 className="font-extrabold text-slate-900 text-base">Live Conference Website Content CMS</h3>
                  <p className="text-xs text-slate-500">Edit and publish core conference details across public routes without source code changes.</p>
                </div>

                <form onSubmit={handleSaveCmsContent} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Conference Title</label>
                      <input
                        type="text"
                        value={cmsForm.conferenceName}
                        onChange={e => setCmsForm({ ...cmsForm, conferenceName: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Dates</label>
                      <input
                        type="text"
                        value={cmsForm.dates}
                        onChange={e => setCmsForm({ ...cmsForm, dates: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Theme Tagline</label>
                    <input
                      type="text"
                      value={cmsForm.tagline}
                      onChange={e => setCmsForm({ ...cmsForm, tagline: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Venue Location</label>
                      <input
                        type="text"
                        value={cmsForm.venue}
                        onChange={e => setCmsForm({ ...cmsForm, venue: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Abstract Submission Deadline</label>
                      <input
                        type="text"
                        value={cmsForm.abstractDeadline}
                        onChange={e => setCmsForm({ ...cmsForm, abstractDeadline: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer"
                    >
                      Publish Updates to Website &rarr;
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 9: STAFF & PERMISSIONS (PHASE 4 - SUPER ADMIN) */}
            {/* ============================================================== */}
            {activeTab === 'staff' && isSuperAdmin && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Administrative Staff Accounts</h3>
                    <p className="text-xs text-slate-500">Least privilege role matrix: Super Admin, Secretariat, Finance, Editorial, Reviewer.</p>
                  </div>
                  <button
                    onClick={() => setShowStaffModal(true)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Provision Account</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider border-b">
                      <tr>
                        <th className="py-3 px-4">Staff Member</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Last Login</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {staffUsers.map((u, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{u.fullName}</div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500">{u.lastLogin ? u.lastLogin.split('T')[0] : 'Never'}</td>
                          <td className="py-3 px-4 text-right">
                            {u.id !== user?.id && (
                              <button
                                onClick={() => handleToggleStaffStatus(u.id, u.status)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                                  u.status === 'Active' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                                }`}
                              >
                                {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Provision Staff Modal */}
                {showStaffModal && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <h4 className="font-extrabold text-slate-900 text-sm">Provision Staff Account</h4>
                        <button onClick={() => setShowStaffModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                      </div>

                      <form onSubmit={handleCreateStaff} className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            value={newStaffName}
                            onChange={e => setNewStaffName(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            value={newStaffEmail}
                            onChange={e => setNewStaffEmail(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Temporary Password</label>
                          <input
                            type="password"
                            required
                            value={newStaffPassword}
                            onChange={e => setNewStaffPassword(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Role Assignment</label>
                          <select
                            value={newStaffRole}
                            onChange={e => setNewStaffRole(e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl font-bold"
                          >
                            <option value="Secretariat Staff">Secretariat Staff</option>
                            <option value="Finance Staff">Finance Staff</option>
                            <option value="Paper Coordinator">Paper Coordinator</option>
                            <option value="Reviewer">Reviewer</option>
                            <option value="Content Editor">Content Editor</option>
                            <option value="Administrator">Administrator</option>
                            <option value="Super Administrator">Super Administrator</option>
                          </select>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t">
                          <button type="button" onClick={() => setShowStaffModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">Provision</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 10: AUDIT TRAIL (PHASE 7) */}
            {/* ============================================================== */}
            {activeTab === 'audit' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Append-Only Administrative Audit Log</h3>
                    <p className="text-xs text-slate-500">Immutable security event records: authentication, mutations, score submissions, booth bookings.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider border-b">
                      <tr>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Actor</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Resource</th>
                        <th className="py-3 px-4">Details</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {auditLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4 text-slate-500">{log.createdAt?.replace('T', ' ').substring(0, 19)}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{log.userEmail}</td>
                          <td className="py-3 px-4 text-blue-700 font-bold">{log.action}</td>
                          <td className="py-3 px-4 text-slate-600">{log.resourceType}: {log.resourceId}</td>
                          <td className="py-3 px-4 font-sans text-slate-700 max-w-xs truncate">{log.details}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              log.status === 'Success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
