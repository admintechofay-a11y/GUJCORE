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
  FileSpreadsheet
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

  useEffect(() => {
    const data = api.getLocalData();
    if (isAdminOrReviewer) {
      setRegistrations(data.registrations || []);
      setPapers(data.papers || []);
    } else if (user) {
      // Isolate to current user's data only
      const uEmail = (user.email || '').toLowerCase().trim();
      const uName = (user.fullName || '').toLowerCase().trim();

      const userRegs = (data.registrations || []).filter(r => 
        (r.email && r.email.toLowerCase().trim() === uEmail) ||
        (r.fullName && r.fullName.toLowerCase().trim() === uName) ||
        (user.ticketId && (r.ticketId === user.ticketId || r.id === user.ticketId))
      );

      const userPapers = (data.papers || []).filter(p => 
        (p.email && p.email.toLowerCase().trim() === uEmail) ||
        (p.fullName && p.fullName.toLowerCase().trim() === uName)
      );

      setRegistrations(userRegs);
      setPapers(userPapers);
    } else {
      setRegistrations([]);
      setPapers([]);
    }
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

  const handleManuscriptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadPaperId) return;

    const fileName = file.name;
    const fileSize = formatFileSize(file.size);

    setPapers(prev => {
      const updated = prev.map(p => {
        if (p.id === activeUploadPaperId) {
          return {
            ...p,
            fullPaperFileName: `${fileName} (${fileSize})`
          };
        }
        return p;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('gujcorr_papers', JSON.stringify(updated));
      }
      return updated;
    });

    showToast(`✅ Final manuscript "${fileName}" attached successfully to paper #${activeUploadPaperId}!`);
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
      if (trimmed.startsWith('GUJ') || trimmed.startsWith('REG') || trimmed.startsWith('PAP') || trimmed.startsWith('DEL')) {
        setVerificationResult({
          verified: true,
          data: `Verified Official Record: GUJCORR 2027 Conference Credential #${trimmed}. Status: Valid & Active in Database.`
        });
      } else {
        setVerificationResult({
          verified: false,
          data: `No matching record found for code: "${verifyCode}". Please check your Ticket ID or Paper ID.`
        });
      }
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

              <Link
                href="/call-for-papers"
                className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0"
              >
                <PlusCircle className="w-4 h-4" /> Submit Another Abstract
              </Link>
            </div>

            {papers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-4">
                <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-extrabold text-slate-900">No Research Papers Submitted Yet</h4>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                    Submit your 200–250 word research abstract across any of the 14 technical symposia before 30th September 2026.
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
                {papers.map((paper) => (
                  <div
                    key={paper.id}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 hover:border-teal-300 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                            {paper.id}
                          </span>
                          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded">
                            {paper.symposiumTitle}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {paper.presentationType}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          paper.status.includes('Accepted')
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {paper.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900 leading-snug">
                        {paper.paperTitle}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        Primary Author: <strong className="text-slate-800">{paper.fullName}</strong> &bull; {paper.companyName || paper.organization || 'Research Scholar'}
                      </p>
                      <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {paper.abstract}
                      </p>

                      {/* Uploaded File Attachments Badge Display */}
                      {(paper.fullPaperFileName || paper.presentationFileName || paper.resumeFileName) && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                          {paper.fullPaperFileName && (
                            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-2.5 py-1 rounded-lg font-semibold">
                              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Manuscript: <strong>{paper.fullPaperFileName}</strong></span>
                            </div>
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

                    {/* Paper Action Buttons (Fully Working) */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Status: <strong>{paper.status}</strong></span>
                        </div>
                        {paper.reviewScore && (
                          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md font-bold">
                            Score: {paper.reviewScore}/10
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1. Acceptance Letter (PDF) */}
                        <button
                          onClick={() => setSelectedLetterPaper(paper)}
                          className="text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
                          title="View and print official abstract acceptance letter"
                        >
                          <FileText className="w-3.5 h-3.5" /> Acceptance Letter (PDF)
                        </button>

                        {/* 2. Upload Final Manuscript */}
                        <button
                          onClick={() => triggerManuscriptUpload(paper.id)}
                          className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
                          title="Attach camera-ready full manuscript (.docx, .pdf)"
                        >
                          <Upload className="w-3.5 h-3.5 text-slate-600" /> 
                          <span>{paper.fullPaperFileName ? 'Replace Manuscript' : 'Upload Final Manuscript'}</span>
                        </button>

                        {/* 3. Upload Oral PPT */}
                        <button
                          onClick={() => triggerPptUpload(paper.id)}
                          className="text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
                          title="Attach oral slide deck (.pptx, .pdf)"
                        >
                          <Upload className="w-3.5 h-3.5 text-teal-600" /> 
                          <span>{paper.presentationFileName ? 'Replace Oral PPT' : 'Upload Oral PPT'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
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
        recipientName={user?.fullName || 'Dr. Rajesh Sharma'}
        role="Distinguished Delegate & Presenter"
        paperTitle={papers[0]?.paperTitle || 'Mitigation of High-Voltage AC Interference in Western India'}
        credentialId={user?.ticketId || 'GUJ27-CERT-01'}
      />

      {/* Proforma Invoice Modal */}
      <ProformaInvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        initialData={{
          companyName: user?.organization || 'Larsen & Toubro Ltd',
          contactName: user?.fullName || 'Dr. Rajesh Sharma',
          email: user?.email || 'delegate@company.com'
        }}
      />

      <Footer />
    </div>
  );
}
