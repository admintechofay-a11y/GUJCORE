'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  FileText, 
  User, 
  Award, 
  Download, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';
import { api } from '../lib/api';
import { DelegateRegistration, PaperSubmission } from '../types';

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'delegate' | 'author' | 'verify';
}

export default function UserDashboardModal({ isOpen, onClose, initialTab = 'delegate' }: UserDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<'delegate' | 'author' | 'verify'>(initialTab);
  const [registrations, setRegistrations] = useState<DelegateRegistration[]>([]);
  const [papers, setPapers] = useState<PaperSubmission[]>([]);
  const [verifyCode, setVerifyCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; data?: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const data = api.getLocalData();
      setRegistrations(data.registrations);
      setPapers(data.papers);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;

    const trimmed = verifyCode.trim().toUpperCase();
    const foundReg = registrations.find(r => r.ticketId?.toUpperCase() === trimmed || r.id?.toUpperCase() === trimmed);
    const foundPaper = papers.find(p => p.id?.toUpperCase() === trimmed);

    if (foundReg) {
      setVerificationResult({
        verified: true,
        data: `Valid Pass: ${foundReg.fullName} (${foundReg.category}) – Pass #${foundReg.ticketId}. Status: Confirmed Delegate.`
      });
    } else if (foundPaper) {
      setVerificationResult({
        verified: true,
        data: `Valid Paper: "${foundPaper.paperTitle}" by ${foundPaper.fullName}. Symposium: ${foundPaper.symposiumTitle}. Status: ${foundPaper.status}.`
      });
    } else {
      setVerificationResult({
        verified: false,
        data: `No matching registration or paper record found for code: "${verifyCode}". Please check your Ticket ID or Paper ID.`
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              GUJCORR 2027 &bull; Attendee &amp; Author Portal
            </h3>
            <p className="text-xs text-slate-500">
              Access your digital QR passes, paper review statuses, and verify certificates
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
          <button
            onClick={() => setActiveTab('delegate')}
            className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'delegate'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            My Delegate Pass ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab('author')}
            className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'author'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Submitted Papers ({papers.length})
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'verify'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            QR Verification Desk
          </button>
        </div>

        {/* Tab 1: Delegate Passes */}
        {activeTab === 'delegate' && (
          <div className="space-y-4">
            {registrations.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <User className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">No Delegate Pass Found in This Session</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  If you haven&apos;t registered yet, please complete the delegate registration form.
                </p>
                <a
                  href="#register"
                  onClick={onClose}
                  className="inline-block text-xs font-bold text-red-600 hover:underline pt-1"
                >
                  Go to Delegate Registration →
                </a>
              </div>
            ) : (
              registrations.map((reg) => (
                <div key={reg.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded">
                        Confirmed Pass
                      </span>
                      <h4 className="text-lg font-extrabold text-slate-900 mt-1">{reg.fullName}</h4>
                      <p className="text-xs font-bold text-teal-800">{reg.designation} &bull; {reg.organization}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{reg.category}</p>
                    </div>

                    <div className="text-center shrink-0">
                      <img
                        src={reg.qrCodeUrl}
                        alt="Ticket QR"
                        className="w-24 h-24 bg-white p-1 rounded-xl border border-slate-200 mx-auto"
                      />
                      <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                        #{reg.ticketId}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                    <span>Paid: ₹{reg.totalAmount?.toLocaleString()} (incl. GST)</span>
                    <button
                      onClick={() => window.print()}
                      className="font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Print / Save Pass
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Author Papers */}
        {activeTab === 'author' && (
          <div className="space-y-4">
            {papers.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">No Papers Submitted in This Session</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Submit your abstract before 11 October 2026.
                </p>
                <a
                  href="#cfp"
                  onClick={onClose}
                  className="inline-block text-xs font-bold text-red-600 hover:underline pt-1"
                >
                  Submit an Abstract Now →
                </a>
              </div>
            ) : (
              papers.map((p) => (
                <div key={p.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded font-mono">
                          {p.id}
                        </span>
                        <span className="text-[11px] font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded uppercase">
                          {p.status}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 mt-2">{p.paperTitle}</h4>
                      <p className="text-xs text-slate-600 font-medium">{p.symposiumTitle} &bull; {p.presentationType} Presentation</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {p.abstract}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                    <span>Submitted: {p.submissionDate ? new Date(p.submissionDate).toLocaleDateString() : 'Recent'}</span>
                    <span className="text-teal-700 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Technical Committee Review in Progress
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: QR & Certificate Verification */}
        {activeTab === 'verify' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>Instant Certificate &amp; Credential Authenticator</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter any GUJCORR 2027 Ticket ID, Delegate Registration ID, or Paper ID to verify authenticity against the conference database.
              </p>

              <form onSubmit={handleVerify} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. GUJ27-AB12CD or REG-123456"
                  value={verifyCode}
                  onChange={e => setVerifyCode(e.target.value)}
                  className="flex-1 text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none font-mono uppercase"
                />
                <button
                  type="submit"
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Verify Now
                </button>
              </form>

              {verificationResult && (
                <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                  verificationResult.verified
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-red-50 border-red-300 text-red-900'
                }`}>
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {verificationResult.verified ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Verification Successful</span>
                      </>
                    ) : (
                      <span>Verification Failed</span>
                    )}
                  </div>
                  <div>{verificationResult.data}</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
}
