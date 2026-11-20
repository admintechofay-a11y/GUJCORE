'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import AcceptanceLetterModal from '@/components/AcceptanceLetterModal';
import CertificateModal from '@/components/CertificateModal';
import ProformaInvoiceModal from '@/components/ProformaInvoiceModal';
import { 
  QrCode, 
  FileText, 
  User, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  PlusCircle,
  Upload,
  Calendar,
  Building2,
  Store,
  Award,
  Sparkles,
  LogOut,
  ExternalLink,
  ChevronRight,
  Printer,
  FileCheck,
  CreditCard,
  Mail,
  X,
  FileSpreadsheet,
  MessageSquare,
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import { api } from '@/lib/api';
import { DelegateRegistration, PaperSubmission } from '@/types';
import { useAuth, cleanFullName } from '@/context/AuthContext';
import { SYMPOSIA } from '@/data/mockData';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'author' | 'delegate' | 'templates' | 'exhibitor' | 'reviewer' | 'verify'>('author');
  const [registrations, setRegistrations] = useState<DelegateRegistration[]>([]);
  const [papers, setPapers] = useState<PaperSubmission[]>([]);
  const [verifyCode, setVerifyCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; data?: string } | null>(null);

  // Live refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Hidden File input references
  const manuscriptFileInputRef = useRef<HTMLInputElement>(null);
  const pptFileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadPaperId, setActiveUploadPaperId] = useState<string | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [selectedLetterPaper, setSelectedLetterPaper] = useState<PaperSubmission | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Reviewer scoring modal / state
  const [scoringPaperId, setScoringPaperId] = useState<string | null>(null);
  const [reviewScore, setReviewScore] = useState<number>(9);
  const [reviewComments, setReviewComments] = useState<string>('Strong technical methodology and excellent industrial relevance.');

  const isAdminOrReviewer = user?.role === 'Admin' || user?.role === 'Reviewer';

  // Helper to filter papers and registrations for currently logged in author/user
  const filterForUser = (allPapers: PaperSubmission[], allRegs: DelegateRegistration[]) => {
    if (isAdminOrReviewer) {
      setPapers(allPapers);
      setRegistrations(allRegs);
      return;
    }

    if (!user) {
      setPapers([]);
      setRegistrations([]);
      return;
    }

    const uEmail = (user.email || '').toLowerCase().trim();
    const uName = (user.fullName || '').toLowerCase().trim();

    const filteredPapers = (allPapers || []).filter(p => {
      const pEmail = (p.email || '').toLowerCase().trim();
      const pName = (p.fullName || '').toLowerCase().trim();
      if (uEmail && pEmail === uEmail) return true;
      if (uName && pName === uName) return true;
      if (uEmail && pEmail && (pEmail.includes(uEmail) || uEmail.includes(pEmail))) return true;
      if (uName && pName && (pName.includes(uName) || uName.includes(pName))) return true;
      if (user.id && (p.id === user.id || p.paperCode === user.id)) return true;
      return false;
    });

    const filteredRegs = (allRegs || []).filter(r => {
      const rEmail = (r.email || '').toLowerCase().trim();
      const rName = (r.fullName || '').toLowerCase().trim();
      if (uEmail && rEmail === uEmail) return true;
      if (uName && rName === uName) return true;
      if (user.ticketId && (r.ticketId === user.ticketId || r.id === user.ticketId)) return true;
      return false;
    });

    setPapers(filteredPapers);
    setRegistrations(filteredRegs);
  };

  // Live fetch from server database
  const fetchLiveDashboardData = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const [papRes, regRes] = await Promise.all([
        api.getPapers(),
        api.getRegistrations()
      ]);
      filterForUser(papRes.data || [], regRes.data || []);
      if (!silent) showToast('Live status and committee review updates refreshed.');
    } catch (err) {
      console.warn('[DASHBOARD] Live fetch error:', err);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // 1. Initial fast display from local cache
    const data = api.getLocalData();
    filterForUser(data.papers || [], data.registrations || []);

    // 2. Fetch live canonical data from database
    fetchLiveDashboardData(true);
  }, [user, isAdminOrReviewer]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const triggerManuscriptUpload = (paperId: string) => {
    setActiveUploadPaperId(paperId);
    if (manuscriptFileInputRef.current) {
      manuscriptFileInputRef.current.value = '';
      manuscriptFileInputRef.current.click();
    }
  };

  const triggerPptUpload = (paperId: string) => {
    setActiveUploadPaperId(paperId);
    if (pptFileInputRef.current) {
      pptFileInputRef.current.value = '';
      pptFileInputRef.current.click();
    }
  };

  const handleManuscriptFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadPaperId) return;

    if (file.size > 25 * 1024 * 1024) {
      alert('File size exceeds 25MB limit. Please upload a smaller PDF or DOCX file.');
      return;
    }

    const fileName = file.name;
    const fileSize = formatFileSize(file.size);

    showToast(`Uploading manuscript "${fileName}" to server...`);

    const reader = new FileReader();
    reader.onload = async () => {
      const fileData = reader.result as string;
      try {
        const res = await api.attachManuscript(activeUploadPaperId, fileData, fileName, fileSize, user?.email);
        if (res.success) {
          showToast(`✅ Manuscript "${fileName}" uploaded to live server successfully!`);
          fetchLiveDashboardData(true);
        } else {
          setPapers(prev => prev.map(p => (p.paperCode === activeUploadPaperId || p.id === activeUploadPaperId) ? { ...p, fullPaperFileName: `${fileName} (${fileSize})`, fileName } : p));
          showToast(`Manuscript attached locally: ${fileName}`);
        }
      } catch {
        setPapers(prev => prev.map(p => (p.paperCode === activeUploadPaperId || p.id === activeUploadPaperId) ? { ...p, fullPaperFileName: `${fileName} (${fileSize})`, fileName } : p));
        showToast(`Manuscript attached locally: ${fileName}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadPaperId) return;

    const fileName = file.name;
    const fileSize = formatFileSize(file.size);

    setPapers(prev => {
      const updated = prev.map(p => {
        if (p.id === activeUploadPaperId) {
          return {
            ...p,
            presentationFileName: `${fileName} (${fileSize})`
          };
        }
        return p;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('gujcorr_papers', JSON.stringify(updated));
      }
      return updated;
    });

    showToast(`✅ Oral presentation slides "${fileName}" attached successfully to paper #${activeUploadPaperId}!`);
  };

  const handleScoreSubmit = (paperId: string) => {
    setPapers(prev => {
      const updated = prev.map(p => {
        if (p.id === paperId) {
          return {
            ...p,
            status: 'Accepted for Oral Presentation' as const,
            reviewScore: reviewScore,
            reviewComments: reviewComments
          };
        }
        return p;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('gujcorr_papers', JSON.stringify(updated));
      }
      return updated;
    });
    setScoringPaperId(null);
    showToast('Peer-review score & acceptance recommendation saved successfully!');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;

    const trimmed = verifyCode.trim().toUpperCase();
    const foundReg = registrations.find(r => r.ticketId?.toUpperCase() === trimmed || r.id?.toUpperCase() === trimmed);
    const foundPaper = papers.find(p => p.id?.toUpperCase() === trimmed);

    if (foundReg) {
      setVerificationResult({
        verified: true,
        data: `Valid Pass: ${foundReg.fullName} (${foundReg.category}) – Pass #${foundReg.ticketId}. Status: Active Delegate. Issued for Vadodara 18–20 Feb 2027.`
      });
    } else if (foundPaper) {
      setVerificationResult({
        verified: true,
        data: `Valid Paper: "${foundPaper.paperTitle}" by ${foundPaper.fullName}. Symposium: ${foundPaper.symposiumTitle}. Status: ${foundPaper.status}.`
      });
    } else {
      setVerificationResult({
        verified: false,
        data: `No matching record found for code: "${verifyCode}". Please check your Ticket ID or Paper ID.`
      });
    }
  };

  // Trigger Mock Template Download
  const downloadTemplate = (title: string, filename: string) => {
    const sampleContent = `GUJCORR 2027 OFFICIAL TEMPLATE\nDocument: ${title}\nInternational Conference on Corrosion Science & Engineering (18-20 Feb 2027, Vadodara)\nOrganized by AMPP Gujarat & IIM Baroda Chapter\n\nPlease format your manuscript according to the two-column guidelines provided in this template.`;
    const blob = new Blob([sampleContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading template: ${filename}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" suppressHydrationWarning>
      <AnnouncementBar />
      <Navbar />

      {/* Hidden File Inputs for Final Manuscript & Oral Slides */}
      <input
        ref={manuscriptFileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleManuscriptFileChange}
      />
      <input
        ref={pptFileInputRef}
        type="file"
        accept=".pptx,.ppt,.pdf"
        className="hidden"
        onChange={handlePptFileChange}
      />

      {/* Master Home Header Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded">
                  CORCON Master Home Portal
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ID: {user?.ticketId || 'GUJCORR-2027-PORTAL'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome, {cleanFullName(user?.fullName) || 'Conference Attendee'}
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Role: <strong className="text-amber-400">{user?.role || 'Delegate'}</strong></span>
                <span>&bull;</span>
                <span>Affiliation: <strong className="text-slate-200">{user?.organization || 'Registered Participant'}</strong></span>
              </p>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsInvoiceOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" /> Proforma Invoice
              </button>
              <button
                onClick={() => setIsCertificateOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" /> My Certificate
              </button>
              <Link
                href="/call-for-papers"
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> Submit Abstract
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => logout()}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-3 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Main Master Home Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Master Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          
          <button
            onClick={() => setActiveTab('author')}
            className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'author'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-teal-400" />
            <span>My Submitted Papers ({papers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('delegate')}
            className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'delegate'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4 text-red-400" />
            <span>My Pass &amp; QR Badge ({registrations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'templates'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Author Templates &amp; Downloads</span>
          </button>

          <button
            onClick={() => setActiveTab('exhibitor')}
            className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'exhibitor'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Store className="w-4 h-4 text-sky-400" />
            <span>Exhibitor / Sponsor Desk</span>
          </button>

          {isAdminOrReviewer && (
            <button
              onClick={() => setActiveTab('reviewer')}
              className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'reviewer'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Reviewer Console</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('verify')}
            className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'verify'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Credential Authenticator</span>
          </button>

        </div>

        {/* TAB 1: AUTHOR & PAPER SUBMISSIONS */}
        {activeTab === 'author' && (
          <div className="space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded">
                  Call for Papers Module
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Research Papers &amp; Abstract Tracking
                </h3>
                <p className="text-xs text-slate-500">
                  Track the peer-review status of your abstracts across 14 symposia, download acceptance letters, and upload camera-ready manuscripts.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => fetchLiveDashboardData(false)}
                  disabled={isRefreshing}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-3.5 rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Check live for latest review comments & status updates from admin"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-teal-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh Status'}</span>
                </button>
                <Link
                  href="/call-for-papers"
                  className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0"
                >
                  <PlusCircle className="w-4 h-4" /> Submit Another Abstract
                </Link>
              </div>
            </div>

            {papers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-4">
                <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-extrabold text-slate-900">No Research Papers Submitted Yet</h4>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                    Submit your abstract across any of the 14 technical sessions before 28 October 2026.
                  </p>
                </div>
                <Link
                  href="/call-for-papers"
                  className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" /> Submit Abstract Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {papers.map((paper) => {
                  const s = (paper.status || '').toLowerCase();
                  const isAcc = s.includes('accept');
                  const isUnder = s.includes('under review');
                  const isRev = s.includes('revision');
                  const isRej = s.includes('reject');

                  return (
                    <div
                      key={paper.paperCode || paper.id}
                      className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 hover:border-teal-300 transition-all"
                    >
                      {/* Top Bar: Paper Code, Symposium, Presentation Type & Live Status Pill */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                            {paper.paperCode || paper.id}
                          </span>
                          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded">
                            Track {paper.symposiumId}: {paper.symposiumTitle}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {paper.presentationType || 'Oral'}
                          </span>
                        </div>

                        {/* Live Status Badge */}
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                            isAcc
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isUnder
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : isRev
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              : isRej
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}>
                            {isAcc && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                            {isUnder && <Clock className="w-3.5 h-3.5 text-blue-600" />}
                            {isRev && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                            {isRej && <X className="w-3.5 h-3.5 text-rose-600" />}
                            {!isAcc && !isUnder && !isRev && !isRej && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                            <span>{paper.status || 'Submitted'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Paper Details */}
                      <div>
                        <h4 className="text-lg font-extrabold text-slate-900 leading-snug">
                          {paper.paperTitle}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          Primary Author: <strong className="text-slate-800">{paper.fullName}</strong> &bull; {paper.companyName || paper.organization || 'Research Scholar'}
                        </p>
                        
                        {/* Live Status Context Banner */}
                        <div className={`mt-3 p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                          isAcc
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                            : isUnder
                            ? 'bg-blue-50/80 border-blue-200 text-blue-900'
                            : isRev
                            ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-semibold'
                            : isRej
                            ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}>
                          {isAcc && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {isUnder && <Clock className="w-4 h-4 text-blue-600 shrink-0" />}
                          {isRev && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
                          {isRej && <X className="w-4 h-4 text-rose-600 shrink-0" />}
                          {!isAcc && !isUnder && !isRev && !isRej && <Clock className="w-4 h-4 text-amber-600 shrink-0" />}
                          <span>
                            {isAcc && 'Congratulations! Your abstract has been accepted for presentation at GUJCORR 2027. Your official Acceptance Letter is ready below.'}
                            {isUnder && 'Your submission is currently under active peer-review by the Technical Review Committee. Check back here for updates.'}
                            {isRev && 'The Technical Committee has requested revisions to your paper. Please read the review comments below and upload your updated manuscript.'}
                            {isRej && 'We regret to inform you that this paper was not accepted for the technical conference program.'}
                            {!isAcc && !isUnder && !isRev && !isRej && 'Your abstract has been successfully submitted and queued for Technical Review Committee review.'}
                          </span>
                        </div>

                        {/* Abstract text snippet */}
                        {paper.abstract && (
                          <div className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="font-bold text-slate-700">Abstract: </span>
                            {paper.abstract}
                          </div>
                        )}

                        {/* REVIEWER FEEDBACK & COMMITTEE COMMENTS BOX (Shown to author when admin gives comments/changes) */}
                        {paper.reviewComments && (
                          <div className={`mt-3.5 p-4 rounded-2xl border transition-all ${
                            isRev
                              ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs'
                              : isRej
                              ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-xs'
                              : isAcc
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
                              : 'bg-purple-50 border-purple-200 text-purple-950 shadow-xs'
                          }`}>
                            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-current/15">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-current shrink-0" />
                                <span className="text-xs font-black uppercase tracking-wider">
                                  Technical Review Committee Comments &amp; Changes Requested
                                </span>
                              </div>
                              {paper.reviewScore && (
                                <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-white shadow-2xs border border-current/20">
                                  Score: {paper.reviewScore} / 10
                                </span>
                              )}
                            </div>
                            
                            <p className="text-xs leading-relaxed font-semibold whitespace-pre-wrap pl-6">
                              {paper.reviewComments}
                            </p>

                            {isRev && (
                              <div className="mt-3 pt-2.5 border-t border-amber-300/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <span className="text-[11px] font-bold text-amber-900">
                                  ⚠️ Please revise your document according to the comments above and upload your updated manuscript.
                                </span>
                                <button
                                  type="button"
                                  onClick={() => triggerManuscriptUpload(paper.paperCode || paper.id)}
                                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Upload Revised Manuscript</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Uploaded File Attachments Badge Display */}
                        {(paper.fullPaperFileName || paper.presentationFileName || paper.fileName || paper.fileData) && (
                          <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                            {(paper.fileName || paper.fullPaperFileName) && (
                              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-2.5 py-1 rounded-lg font-semibold">
                                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Manuscript: <strong>{paper.fileName || paper.fullPaperFileName}</strong></span>
                              </div>
                            )}
                            {paper.fileData && (
                              <button
                                type="button"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = paper.fileData!;
                                  link.download = paper.fileName || `${paper.paperCode || paper.id}_Manuscript.pdf`;
                                  link.click();
                                }}
                                className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs px-2.5 py-1 rounded-lg font-semibold cursor-pointer transition-colors"
                              >
                                <Download className="w-3 h-3 text-blue-600" />
                                <span>Download Submitted PDF</span>
                              </button>
                            )}
                            {paper.presentationFileName && (
                              <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs px-2.5 py-1 rounded-lg font-semibold">
                                <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                                <span>Oral Slides: <strong>{paper.presentationFileName}</strong></span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Paper Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            <span>Status: <strong>{paper.status || 'Submitted'}</strong></span>
                          </div>
                          {paper.reviewScore && (
                            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md font-bold">
                              Score: {paper.reviewScore}/10
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* 1. Acceptance Letter (PDF) - Gated to Accepted only */}
                          {isAcc ? (
                            <button
                              onClick={() => setSelectedLetterPaper(paper)}
                              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                              title="View and print official abstract acceptance letter"
                            >
                              <FileText className="w-3.5 h-3.5" /> Acceptance Letter (PDF)
                            </button>
                          ) : (
                            <span
                              className="text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-default"
                              title="Acceptance Letter will become available once approved by the Technical Committee"
                            >
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>Acceptance Letter ({isUnder ? 'Under Review' : isRev ? 'Pending Revisions' : isRej ? 'Not Accepted' : 'Pending Review'})</span>
                            </span>
                          )}

                          {/* 2. Upload Final / Revised Manuscript */}
                          <button
                            onClick={() => triggerManuscriptUpload(paper.paperCode || paper.id)}
                            className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98 border ${
                              isRev
                                ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                            }`}
                            title="Attach camera-ready full manuscript (.docx, .pdf) - Due 15 Dec 2026"
                          >
                            <Upload className="w-3.5 h-3.5" /> 
                            <span>{paper.fullPaperFileName || paper.fileName ? 'Replace Manuscript' : 'Upload Final Manuscript'}</span>
                          </button>

                          {/* 3. Upload Oral PPT */}
                          <button
                            onClick={() => triggerPptUpload(paper.paperCode || paper.id)}
                            className="text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
                            title="Attach oral slide deck (.pptx, .pdf) - Due 25 Dec 2026"
                          >
                            <Upload className="w-3.5 h-3.5 text-teal-600" /> 
                            <span>{paper.presentationFileName ? 'Replace Oral PPT' : 'Upload Oral PPT'}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: DELEGATE PASSES & QR BADGES */}
        {activeTab === 'delegate' && (
          <div className="space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded">
                  Delegate Credentials &amp; Badges
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  My Conference Entry Pass
                </h3>
                <p className="text-xs text-slate-500">
                  Download or print your official QR pass badge for admission to all 14 technical symposia, lunches, and expo.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsInvoiceOpen(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-3.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" /> Proforma Invoice
                </button>
                <Link
                  href="/registration"
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0"
                >
                  <PlusCircle className="w-4 h-4" /> Book Additional Pass
                </Link>
              </div>
            </div>

            {registrations.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-4">
                <div className="w-16 h-16 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center mx-auto">
                  <User className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-extrabold text-slate-900">No Delegate Pass Registered</h4>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                    Select your pass category (Member ₹4,720, Non-Member ₹7,670, Student ₹1,770). Pay online or pay later via bank remittance.
                  </p>
                </div>
                <Link
                  href="/registration"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-colors"
                >
                  <CreditCard className="w-4 h-4" /> Select Pass Tier
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {registrations.map((reg) => (
                  <div key={reg.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 relative">
                    
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded">
                          Official Badge
                        </span>
                        <h4 className="text-xl font-extrabold text-slate-900 mt-2">{reg.fullName}</h4>
                        <div className="text-xs font-bold text-teal-800">{reg.designation}</div>
                        <div className="text-xs text-slate-600 font-medium">{reg.organization}</div>
                        <div className="text-xs text-slate-400 mt-2">
                          Category: <strong className="text-slate-700">{reg.category}</strong>
                        </div>
                      </div>

                      <div className="text-center shrink-0">
                        <img
                          src={reg.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GUJCORR2027:${reg.ticketId}`}
                          alt="Ticket QR"
                          className="w-24 h-24 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs"
                        />
                        <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                          #{reg.ticketId}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Payment Status:</span>
                        <strong className="text-slate-900">
                          {reg.paymentMethod.includes('Pay Later') ? 'Provisional / Unpaid' : 'Confirmed (₹' + reg.totalAmount?.toLocaleString() + ')'}
                        </strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.print()}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" /> Print Badge
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: AUTHOR TEMPLATES & DOWNLOADS */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded">
                Official Author Downloads
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Conference Document Templates &amp; Guidelines
              </h3>
              <p className="text-xs text-slate-500">
                Download mandatory author templates for abstract submission, full-text manuscripts, oral slide decks, and posters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded uppercase">
                    DOCX Template
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-base">Abstract Submission Template</h4>
                  <p className="text-xs text-slate-500">
                    200–250 words structured format covering background, objective, methodology, and results.
                  </p>
                </div>
                <button
                  onClick={() => downloadTemplate('Abstract Submission Template', 'GUJCORR_2027_Abstract_Template.docx')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download (.docx)
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded uppercase">
                    DOCX Template
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-base">Full-Text Paper Manuscript</h4>
                  <p className="text-xs text-slate-500">
                    Complete paper formatting guide with two-column layout, figures, tables, and reference IEEE styling.
                  </p>
                </div>
                <button
                  onClick={() => downloadTemplate('Full Paper Manuscript Template', 'GUJCORR_2027_FullPaper_Template.docx')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download (.docx)
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded uppercase">
                    PPTX Presentation
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-base">Oral Presentation Slide Deck</h4>
                  <p className="text-xs text-slate-500">
                    16:9 widescreen branded PowerPoint template with GUJCORR, AMPP, and IIM logos for 15-minute talks.
                  </p>
                </div>
                <button
                  onClick={() => downloadTemplate('Oral Slide Presentation Template', 'GUJCORR_2027_Oral_Slide_Deck.pptx')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download (.pptx)
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: EXHIBITOR & SPONSOR DESK */}
        {activeTab === 'exhibitor' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded">
                  Exhibition Management
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Exhibition Stall &amp; Fascia Desk
                </h3>
                <p className="text-xs text-slate-500">
                  Submit company fascia naming, electrical load requirements, and delegate exhibitor badges.
                </p>
              </div>

              <Link
                href="/exhibition"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors shrink-0"
              >
                View 2D Floor Plan Grid →
              </Link>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h4 className="text-base font-extrabold text-slate-900">Submit Stall Fascia &amp; Badge Badging Info</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Exhibitor Name *</label>
                  <input
                    type="text"
                    defaultValue="TCR Advanced Engineering Pvt Ltd"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fascia Name (Max 30 Chars) *</label>
                  <input
                    type="text"
                    defaultValue="TCR ADVANCED ENGINEERING"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono font-bold focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('✅ Fascia details and exhibitor badges submitted to Exhibition Committee!')}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Save Fascia &amp; Badge Records
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWER CONSOLE */}
        {activeTab === 'reviewer' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded">
                Technical Review Committee Console
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Peer-Review Scoring Desk (1–10 Scale)
              </h3>
              <p className="text-xs text-slate-500">
                Evaluate technical abstracts, allocate oral/poster session tracks, and issue acceptance endorsements.
              </p>
            </div>

            <div className="space-y-4">
              {papers.map((p) => (
                <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-0.5 rounded">#{p.id}</span>
                      <span className="text-xs font-bold text-purple-700">{p.symposiumTitle}</span>
                    </div>
                    <span className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-0.5 rounded-full">
                      {p.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base">&ldquo;{p.paperTitle}&rdquo;</h4>
                  <p className="text-xs text-slate-500">Author: <strong>{p.fullName}</strong> ({p.companyName || p.organization})</p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-600">
                      Current Score: <span className="text-purple-700 font-extrabold">{p.reviewScore ? `${p.reviewScore}/10` : 'Pending Review'}</span>
                    </div>

                    <button
                      onClick={() => setScoringPaperId(p.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Score Abstract &rarr;
                    </button>
                  </div>

                  {/* Inline Scoring Box */}
                  {scoringPaperId === p.id && (
                    <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-purple-950">Assign Score (1 to 10):</label>
                        <span className="text-sm font-black text-purple-900">{reviewScore} / 10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={reviewScore}
                        onChange={(e) => setReviewScore(parseFloat(e.target.value))}
                        className="w-full accent-purple-600 cursor-pointer"
                      />
                      <textarea
                        rows={2}
                        value={reviewComments}
                        onChange={(e) => setReviewComments(e.target.value)}
                        placeholder="Enter reviewer feedback..."
                        className="w-full text-xs p-2.5 bg-white border border-purple-200 rounded-xl focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setScoringPaperId(null)}
                          className="text-xs font-bold px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleScoreSubmit(p.id)}
                          className="text-xs font-bold px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg cursor-pointer"
                        >
                          Save &amp; Accept Paper
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CREDENTIAL AUTHENTICATOR */}
        {activeTab === 'verify' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                Official Credential Verification
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                QR &amp; Certificate Authenticator
              </h3>
              <p className="text-xs text-slate-500">
                Verify the authenticity of any GUJCORR 2027 delegate pass, paper submission ID, or participation certificate.
              </p>
            </div>

            <form onSubmit={handleVerify} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter Ticket ID / Paper Code / QR Token *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. GUJ27-DEL-104928 or PAP-1406"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    className="flex-1 text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    Authenticate
                  </button>
                </div>
              </div>

              {verificationResult && (
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed animate-in fade-in ${
                  verificationResult.verified 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium' 
                    : 'bg-red-50 border-red-300 text-red-950'
                }`}>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {verificationResult.verified ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-800 uppercase tracking-wider">Verified Authentic Credential</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-red-800 uppercase tracking-wider">Unverified Code</span>
                      </>
                    )}
                  </div>
                  <div>{verificationResult.data}</div>
                </div>
              )}
            </form>
          </div>
        )}

      </div>

      {/* Acceptance Letter Modal */}
      {selectedLetterPaper && (
        <AcceptanceLetterModal
          isOpen={!!selectedLetterPaper}
          onClose={() => setSelectedLetterPaper(null)}
          paperData={{
            id: selectedLetterPaper.id,
            paperTitle: selectedLetterPaper.paperTitle,
            authorName: selectedLetterPaper.fullName,
            organization: selectedLetterPaper.companyName || selectedLetterPaper.organization,
            symposiumTitle: selectedLetterPaper.symposiumTitle,
            presentationType: selectedLetterPaper.presentationType
          }}
        />
      )}

      {/* Verified Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        recipientName={user?.fullName || 'Conference Delegate'}
        role="Distinguished Delegate & Presenter"
        paperTitle={papers[0]?.paperTitle || 'Corrosion Mitigation & Asset Integrity'}
        credentialId={user?.ticketId || 'GUJ27-CERT-01'}
      />

      {/* Proforma Invoice Modal */}
      <ProformaInvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        initialData={{
          companyName: user?.organization || '',
          contactName: user?.fullName || '',
          email: user?.email || ''
        }}
      />

      <Footer />
    </div>
  );
}
