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
  DollarSign
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import AnnouncementBar from '@/components/AnnouncementBar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { api } from '@/lib/api';
import { DelegateRegistration, PaperSubmission } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'delegates' | 'papers' | 'booths' | 'inquiries'>('overview');
  
  // Data state
  const [registrations, setRegistrations] = useState<DelegateRegistration[]>([]);
  const [papers, setPapers] = useState<PaperSubmission[]>([]);
  const [booths, setBooths] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Review modal state
  const [selectedPaper, setSelectedPaper] = useState<PaperSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(8.5);
  const [commentsInput, setCommentsInput] = useState<string>('');
  const [paperStatusInput, setPaperStatusInput] = useState<string>('Accepted for Oral Presentation');

  // Admin access gate state
  const [adminPin, setAdminPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    // Check session storage for persistent unlock
    if (typeof window !== 'undefined') {
      const savedUnlock = sessionStorage.getItem('gujcorr_admin_unlocked');
      if (savedUnlock === 'true') {
        setIsUnlocked(true);
      }
    }
    loadData();
  }, []);

  const [isLoadingData, setIsLoadingData] = useState(false);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [regRes, papRes, boothRes, inqRes] = await Promise.allSettled([
        api.getRegistrations(),
        api.getPapers(),
        api.getBooths(),
        api.getInquiries()
      ]);

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
    } catch (err) {
      console.warn('Error loading admin data from WordPress/local:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isAuthorized = isUnlocked || (user?.role === 'Admin' || user?.role === 'Reviewer');

  const handleUnlockWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = adminPin.trim().toLowerCase();
    if (pin === 'admin@2027' || pin === 'gujcorr2027' || pin === 'secretariat2027' || pin === '18022027') {
      setIsUnlocked(true);
      setPinError('');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('gujcorr_admin_unlocked', 'true');
      }
      showToast('Admin Console unlocked successfully!');
    } else {
      setPinError('Invalid Secretariat Key. Hint: Use admin@2027');
    }
  };

  // Metrics computation
  const totalDelegates = registrations.length;
  const paidDelegates = registrations.filter(r => r.status?.includes('Confirmed') || r.status?.includes('Paid')).length;
  const totalRevenue = registrations.reduce((sum, r) => sum + (r.totalAmount || 4720), 0);
  const totalPapers = papers.length;
  const acceptedPapers = papers.filter(p => p.status?.includes('Accepted')).length;
  const totalBooths = booths.length;

  // Filtered Delegates
  const filteredDelegates = registrations.filter(r => {
    const matchQuery = (r.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (r.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (r.ticketId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (r.organization || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'all') return matchQuery;
    if (statusFilter === 'paid') return matchQuery && (r.status?.includes('Confirmed') || r.status?.includes('Paid'));
    if (statusFilter === 'pending') return matchQuery && !r.status?.includes('Paid') && !r.status?.includes('Confirmed');
    return matchQuery;
  });

  // Filtered Papers
  const filteredPapers = papers.filter(p => {
    const matchQuery = (p.paperTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (p.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (p.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (p.symposiumTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'all') return matchQuery;
    if (statusFilter === 'accepted') return matchQuery && p.status?.includes('Accepted');
    if (statusFilter === 'submitted') return matchQuery && p.status === 'Submitted';
    return matchQuery;
  });

  // Filtered Booths
  const filteredBooths = booths.filter(b => {
    const name = b.company_name || b.companyName || '';
    const contact = b.contact_person || b.contactPerson || '';
    const number = b.booth_number || b.stallNumber || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
           number.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleUpdatePaymentStatus = async (ticketId: string, newStatus: string) => {
    const updated = registrations.map(r => {
      if (r.ticketId === ticketId || r.id === ticketId) {
        return { ...r, status: newStatus as any };
      }
      return r;
    });
    setRegistrations(updated);
    await api.updateRegistrationStatus(ticketId, newStatus);
    showToast(`Updated pass #${ticketId} to "${newStatus}"!`);
  };

  const handleSavePaperReview = async () => {
    if (!selectedPaper) return;
    const paperCode = selectedPaper.id || '';
    const updated = papers.map(p => {
      if (p.id === paperCode) {
        return {
          ...p,
          reviewScore: scoreInput,
          reviewComments: commentsInput || 'Evaluated by Secretariat Review Committee.',
          status: paperStatusInput as any
        };
      }
      return p;
    });
    setPapers(updated);
    await api.updatePaperReview(paperCode, scoreInput, commentsInput, paperStatusInput);
    setSelectedPaper(null);
    showToast(`Paper #${paperCode} review saved! Status: "${paperStatusInput}"`);
  };

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
      p.id,
      `"${p.fullName}"`,
      p.email,
      p.mobileNumber,
      `"${p.companyName}"`,
      p.symposiumId,
      `"${p.symposiumTitle}"`,
      `"${p.paperTitle.replace(/"/g, '""')}"`,
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between" suppressHydrationWarning>
      <AnnouncementBar />
      <Navbar />

      <PageHeader
        badge="Executive Control Center"
        title="Conference Secretariat"
        highlightedTitle="Admin Console"
        description="Comprehensive management portal for GUJCORR 2027 delegates, peer-review paper scoring, exhibition stall allocations, and live financial revenue."
        breadcrumbs={[{ label: 'Admin Console' }]}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Authentication Gate if not authorized */}
        {!isAuthorized ? (
          <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded">
                Restricted Access
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Secretariat Key Required
              </h2>
              <p className="text-xs text-slate-500">
                Enter your Secretariat administrative passkey to access financial reports, delegate databases, and review controls.
              </p>
            </div>

            <form onSubmit={handleUnlockWithPin} className="space-y-4 text-left">
              {pinError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Secretariat Admin Passkey
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="e.g. admin@2027"
                    value={adminPin}
                    onChange={e => setAdminPin(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Default Secret Key: <code>admin@2027</code></span>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Unlock Secretariat Dashboard &rarr;</span>
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
              Or sign in with an administrator account:{' '}
              <Link href="/login" className="text-red-600 font-extrabold hover:underline">
                Go to Member Sign In &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Toast Alert */}
            {toastMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{toastMessage}</span>
                </div>
              </div>
            )}

            {/* Executive KPI Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                  <span>{paidDelegates} Confirmed &amp; Paid</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Collected Revenue</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-700">
                  ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-slate-500 font-semibold">Includes 18% GST (SAC 998397)</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Research Papers</span>
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">{totalPapers}</div>
                <div className="text-xs text-teal-700 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{acceptedPapers} Accepted for Proceedings</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Exhibition Arena</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">{totalBooths} Stalls</div>
                <div className="text-xs text-slate-500 font-semibold">Sarabhai Pavilion &bull; 14 Symposia</div>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-2 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => { setActiveTab('overview'); setSearchTerm(''); }}
                  className={`text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'overview' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  📊 Executive Overview
                </button>

                <button
                  onClick={() => { setActiveTab('delegates'); setSearchTerm(''); }}
                  className={`text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'delegates' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Delegates ({registrations.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('papers'); setSearchTerm(''); }}
                  className={`text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'papers' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Papers ({papers.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('booths'); setSearchTerm(''); }}
                  className={`text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'booths' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Exhibition Stalls ({booths.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('inquiries'); setSearchTerm(''); }}
                  className={`text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'inquiries' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Inquiries ({inquiries.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {activeTab === 'delegates' && (
                  <button
                    onClick={exportDelegatesCsv}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
                  </button>
                )}
                {activeTab === 'papers' && (
                  <button
                    onClick={exportPapersCsv}
                    className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
                  </button>
                )}
                <button
                  onClick={loadData}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  title="Refresh Data from WordPress & Local Storage"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* TAB 1: EXECUTIVE OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded">
                        Secretariat Command Center
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                        Conference Administrative Profile &amp; Remittance Coordinates
                      </h3>
                    </div>
                    <Link
                      href="/masterhome"
                      className="text-xs font-bold text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
                    >
                      Open Master Home &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">Conference Metadata</div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <div><strong>Event:</strong> GUJCORR 2027 (AMPP Gujarat &amp; IIM Baroda)</div>
                        <div><strong>Dates:</strong> 18th &ndash; 20th February 2027</div>
                        <div><strong>Venue:</strong> The Maharaja Sayajirao University of Baroda, Vadodara, Gujarat</div>
                        <div><strong>Secretariat Contact:</strong> iim.barodachapter@gmail.com &bull; +91 99888 81674</div>
                        <div><strong>SAC Code (GST):</strong> 998397 (Scientific &amp; Technical Services)</div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 font-mono">
                      <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wide font-sans">Official Bank Account for Remittances</div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <div><strong>Bank:</strong> Union Bank of India</div>
                        <div><strong>Branch:</strong> Dandia Bazar, Vadodara</div>
                        <div><strong>Account Name:</strong> INDIAN INSTITUTE OF METALS BARODA CHAPTER</div>
                        <div><strong>Account No:</strong> 520101234030441</div>
                        <div><strong>IFSC Code:</strong> UBIN0901555</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Navigation Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('delegates')}
                    className="p-5 bg-white hover:bg-blue-50/50 rounded-3xl border border-slate-200 hover:border-blue-300 text-left transition-all group cursor-pointer shadow-2xs"
                  >
                    <Users className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-extrabold text-sm text-slate-900">Manage {registrations.length} Delegates</div>
                    <div className="text-xs text-slate-500">Review ticket IDs, payment status, GST, and passes.</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('papers')}
                    className="p-5 bg-white hover:bg-teal-50/50 rounded-3xl border border-slate-200 hover:border-teal-300 text-left transition-all group cursor-pointer shadow-2xs"
                  >
                    <FileText className="w-6 h-6 text-teal-700 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-extrabold text-sm text-slate-900">Review {papers.length} Research Papers</div>
                    <div className="text-xs text-slate-500">Score abstracts, assign oral/poster tracks, issue letters.</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('booths')}
                    className="p-5 bg-white hover:bg-amber-50/50 rounded-3xl border border-slate-200 hover:border-amber-300 text-left transition-all group cursor-pointer shadow-2xs"
                  >
                    <Store className="w-6 h-6 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-extrabold text-sm text-slate-900">Exhibition Arena ({booths.length} Stalls)</div>
                    <div className="text-xs text-slate-500">Inspect booth reservations and exhibitor fascias.</div>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: DELEGATES & PASSES */}
            {activeTab === 'delegates' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">Registered Delegates ({filteredDelegates.length})</h3>
                    <p className="text-xs text-slate-500">Manage delegate passes, GST billing details, and entry status.</p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search name, email, ticket..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="paid">Paid &amp; Confirmed</option>
                      <option value="pending">Pending Payment</option>
                    </select>
                  </div>
                </div>

                {filteredDelegates.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No delegate records found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-3">Ticket ID</th>
                          <th className="p-3">Delegate Name</th>
                          <th className="p-3">Organization &amp; Role</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Amount (INR)</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredDelegates.map((d) => (
                          <tr key={d.id || d.ticketId} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-mono font-bold text-red-600">{d.ticketId || d.id}</td>
                            <td className="p-3">
                              <div className="font-extrabold text-slate-900">{d.fullName}</div>
                              <div className="text-[11px] text-slate-500">{d.email} &bull; {d.mobileNumber}</div>
                            </td>
                            <td className="p-3">
                              <div className="font-semibold text-slate-800">{d.organization}</div>
                              <div className="text-[11px] text-slate-500">{d.designation}</div>
                            </td>
                            <td className="p-3">
                              <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">
                                {d.category}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-bold text-slate-900">
                              ₹{(d.totalAmount || 4720).toLocaleString('en-IN')}
                            </td>
                            <td className="p-3">
                              <span className={`inline-block font-extrabold px-2.5 py-0.5 rounded text-[10px] ${
                                d.status?.includes('Confirmed') || d.status?.includes('Paid')
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {d.status || 'Confirmed'}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1.5">
                              <button
                                onClick={() => handleUpdatePaymentStatus(d.ticketId || d.id, 'Confirmed & Paid')}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer"
                                title="Mark as Confirmed & Paid"
                              >
                                Mark Paid
                              </button>
                              <button
                                onClick={() => handleUpdatePaymentStatus(d.ticketId || d.id, 'Provisional (Unpaid)')}
                                className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-amber-200 cursor-pointer"
                                title="Mark as Provisional"
                              >
                                Mark Unpaid
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: PAPERS & PEER REVIEW */}
            {activeTab === 'papers' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">Submitted Research Papers ({filteredPapers.length})</h3>
                    <p className="text-xs text-slate-500">Peer-review scoring, oral/poster allocations, and reviewer remarks.</p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search title, author, code..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="accepted">Accepted Papers</option>
                      <option value="submitted">Pending Review</option>
                    </select>
                  </div>
                </div>

                {filteredPapers.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No research paper submissions match your search.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-3">Paper Code</th>
                          <th className="p-3">Paper Title</th>
                          <th className="p-3">Lead Author</th>
                          <th className="p-3">Symposium</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Review Score</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredPapers.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-mono font-bold text-teal-700">{p.id}</td>
                            <td className="p-3 max-w-xs">
                              <div className="font-extrabold text-slate-900 leading-snug line-clamp-2">{p.paperTitle}</div>
                              <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{p.abstract}</div>
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-slate-900">{p.fullName}</div>
                              <div className="text-[11px] text-slate-500">{p.companyName}</div>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold text-slate-700">{p.symposiumTitle}</span>
                            </td>
                            <td className="p-3">
                              <span className={`font-extrabold text-[10px] px-2 py-0.5 rounded ${
                                p.presentationType === 'Oral' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                              }`}>
                                {p.presentationType || 'Oral'}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-bold">
                              {p.reviewScore ? (
                                <span className="text-emerald-700 font-bold">{p.reviewScore}/10</span>
                              ) : (
                                <span className="text-slate-400">&mdash;</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className={`inline-block font-extrabold px-2.5 py-0.5 rounded text-[10px] ${
                                p.status?.includes('Accepted')
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedPaper(p);
                                  setScoreInput(p.reviewScore || 8.5);
                                  setCommentsInput(p.reviewComments || '');
                                  setPaperStatusInput(p.status || 'Accepted for Oral Presentation');
                                }}
                                className="bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-[10px] px-2.5 py-1.5 rounded-lg border border-teal-200 cursor-pointer inline-flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" /> Score &amp; Review
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

            {/* TAB 4: EXHIBITION STALLS */}
            {activeTab === 'booths' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">Exhibition Stalls &amp; Exhibitors ({filteredBooths.length})</h3>
                    <p className="text-xs text-slate-500">Commercial trade pavilion bookings, fascia lettering, and stall tariffs.</p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search company, stall, contact..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>
                    <Link
                      href="/exhibition"
                      className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2 rounded-xl transition-colors shrink-0"
                    >
                      View 2D Floor Plan &rarr;
                    </Link>
                  </div>
                </div>

                {filteredBooths.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No exhibition stall reservations logged yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-3">Stall #</th>
                          <th className="p-3">Company &amp; Fascia Board</th>
                          <th className="p-3">Contact Person</th>
                          <th className="p-3">Email &amp; Mobile</th>
                          <th className="p-3">Size / Dimensions</th>
                          <th className="p-3">Tariff (INR)</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredBooths.map((b, idx) => (
                          <tr key={b.id || idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-mono font-black text-red-600">
                              {b.booth_number || b.stallNumber || 'S-01'}
                            </td>
                            <td className="p-3">
                              <div className="font-extrabold text-slate-900">{b.company_name || b.companyName}</div>
                              {(b.fascia_name || b.fasciaName) && (
                                <div className="text-[10px] font-mono text-slate-500">
                                  FASCIA: {b.fascia_name || b.fasciaName}
                                </div>
                              )}
                            </td>
                            <td className="p-3 font-medium text-slate-800">
                              {b.contact_person || b.contactPerson}
                            </td>
                            <td className="p-3 text-slate-500">
                              <div>{b.email}</div>
                              <div>{b.mobile_number || b.mobile}</div>
                            </td>
                            <td className="p-3 text-slate-700">
                              {b.booth_size || b.stallType || '9 sqm'}
                            </td>
                            <td className="p-3 font-mono font-bold text-slate-900">
                              ₹{(b.total_price || b.totalPrice || 112100).toLocaleString('en-IN')}
                            </td>
                            <td className="p-3">
                              <span className={`inline-block font-extrabold px-2.5 py-0.5 rounded text-[10px] ${
                                (b.status === 'Booked' || b.status === 'Paid' || b.paymentStatus === 'Paid')
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {b.status || b.paymentStatus || 'Reserved'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

            {/* TAB 5: INQUIRIES & CONTACT DESK */}
            {activeTab === 'inquiries' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">General Contact Inquiries ({inquiries.length})</h3>
                    <p className="text-xs text-slate-500">Messages and inquiries submitted by attendees and sponsors.</p>
                  </div>
                </div>

                {inquiries.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No incoming messages recorded yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-3">Sender Name</th>
                          <th className="p-3">Email &amp; Phone</th>
                          <th className="p-3">Subject</th>
                          <th className="p-3">Message Content</th>
                          <th className="p-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {inquiries.map((m, idx) => (
                          <tr key={m.id || idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-bold text-slate-900">{m.name}</td>
                            <td className="p-3 text-slate-500">
                              <div>{m.email}</div>
                              {m.phone && <div>{m.phone}</div>}
                            </td>
                            <td className="p-3 font-semibold text-slate-800">{m.subject}</td>
                            <td className="p-3 max-w-sm text-slate-600">{m.message}</td>
                            <td className="p-3 text-[11px] text-slate-400">{m.submittedAt?.split('T')[0] || 'Recent'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

          </>
        )}

      </main>

      {/* Review Modal Dialog */}
      {selectedPaper && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  Paper #{selectedPaper.id}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Peer Review &amp; Evaluation Desk
                </h3>
              </div>
              <button onClick={() => setSelectedPaper(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-extrabold text-slate-800">{selectedPaper.paperTitle}</div>
              <div className="text-xs text-slate-500">Author: {selectedPaper.fullName} ({selectedPaper.companyName})</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Technical Score (1.0 to 10.0): <strong className="text-teal-700 text-sm">{scoreInput} / 10</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={scoreInput}
                  onChange={e => setScoreInput(parseFloat(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Acceptance Status</label>
                <select
                  value={paperStatusInput}
                  onChange={e => setPaperStatusInput(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer"
                >
                  <option value="Accepted for Oral Presentation">Accepted for Oral Presentation (15-min podium talk)</option>
                  <option value="Accepted for Poster Presentation">Accepted for Poster Presentation (A0 Poster Display)</option>
                  <option value="Submitted">Under Technical Committee Review</option>
                  <option value="Revision Required">Revision Required</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reviewer Feedback &amp; Comments</label>
                <textarea
                  rows={3}
                  value={commentsInput}
                  onChange={e => setCommentsInput(e.target.value)}
                  placeholder="Provide technical evaluation comments..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedPaper(null)}
                className="text-xs font-bold text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePaperReview}
                className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save &amp; Issue Endorsement
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
