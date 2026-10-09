'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Sparkles, 
  User, 
  BookOpen, 
  MapPin, 
  FileCheck,
  X,
  FileSpreadsheet,
  FileCode,
  Download,
  ArrowRight,
  Check,
  Loader2,
  Zap,
  CreditCard,
  LayoutDashboard
} from 'lucide-react';
import { SYMPOSIA } from '../data/mockData';
import { api } from '../lib/api';
import { useAuth } from '@/context/AuthContext';

interface CallForPapersProps {
  preselectedSymposiumId?: number;
  onSuccess?: () => void;
}

export default function CallForPapers({ preselectedSymposiumId }: CallForPapersProps) {
  const { user } = useAuth();
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const paperInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    nationality: 'Indian',
    gender: 'Male',
    designation: user?.designation || '',
    companyName: user?.organization || '',
    education: '',
    specialization: '',
    achievements: '',
    professionalMemberships: user?.membershipNumber || '',
    address: '',
    city: user?.city || 'Vadodara',
    state: 'Gujarat',
    country: user?.country || 'India',
    zipCode: '',
    phoneNumber: '',
    mobileNumber: user?.mobileNumber || '',
    email: user?.email || '',
    presentationType: 'Oral' as 'Oral' | 'Poster',
    symposiumId: preselectedSymposiumId || 1,
    paperTitle: '',
    abstract: '',
    keywords: '',
    coAuthors: '',
    declarationAgreed: false,
    isPresentingAuthor: true
  });

  // Pre-fill when auth user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        designation: prev.designation || user.designation || '',
        companyName: prev.companyName || user.organization || '',
        email: prev.email || user.email || '',
        mobileNumber: prev.mobileNumber || user.mobileNumber || '',
        city: prev.city || user.city || 'Vadodara',
        country: prev.country || user.country || 'India'
      }));
    }
  }, [user]);

  // File upload states
  const [resumeFile, setResumeFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [paperFile, setPaperFile] = useState<{ name: string; size: string; type: string } | null>(null);

  const [abstractWordCount, setAbstractWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPaper, setSubmittedPaper] = useState<{ id: string; title: string; symposium: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (preselectedSymposiumId) {
      setFormData(prev => ({ ...prev, symposiumId: preselectedSymposiumId }));
    }
  }, [preselectedSymposiumId]);

  const handleAbstractChange = (text: string) => {
    setFormData(prev => ({ ...prev, abstract: text }));
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setAbstractWordCount(words);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleResumeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit. Please choose a smaller file.');
        return;
      }
      setResumeFile({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type || 'Document'
      });
    }
  };

  const handlePaperSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        alert('File size exceeds 25MB limit. Please choose a smaller file.');
        return;
      }
      setPaperFile({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type || 'Document'
      });
    }
  };

  const handleRemoveResume = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResumeFile(null);
    if (resumeInputRef.current) resumeInputRef.current.value = '';
  };

  const handleRemovePaper = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPaperFile(null);
    if (paperInputRef.current) paperInputRef.current.value = '';
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Field Validations
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter Author Full Name.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Please enter Author Email Address.');
      return;
    }
    if (!formData.mobileNumber.trim()) {
      setErrorMessage('Please enter Mobile Number.');
      return;
    }
    if (!formData.paperTitle.trim()) {
      setErrorMessage('Please enter Technical Paper Title.');
      return;
    }
    if (!formData.abstract.trim()) {
      setErrorMessage('Please provide your abstract text.');
      return;
    }
    if (!formData.isPresentingAuthor) {
      setErrorMessage('Please confirm the Presenting Author checkbox. The presenting author must register as a delegate.');
      const declEl = document.getElementById('declarationSection');
      if (declEl) declEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!formData.declarationAgreed) {
      setErrorMessage('Please check the Submission & Publication Declaration checkbox.');
      const declEl = document.getElementById('declarationSection');
      if (declEl) declEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    const selectedSymp = SYMPOSIA.find(s => s.id === Number(formData.symposiumId));

    try {
      const res = await api.submitPaper({
        ...formData,
        symposiumId: Number(formData.symposiumId),
        symposiumTitle: selectedSymp ? selectedSymp.title : 'Corrosion Science',
        resumeFileName: resumeFile ? resumeFile.name : undefined,
        fullPaperFileName: paperFile ? paperFile.name : undefined,
        isPresentingAuthor: formData.isPresentingAuthor
      });

      if (res.success) {
        setSubmittedPaper({ 
          id: res.data.id, 
          title: res.data.paperTitle,
          symposium: selectedSymp ? selectedSymp.title : 'Corrosion Science'
        });
        
        // Send email notification to author
        api.sendNotificationEmail({
          type: 'paper_submitted',
          to: formData.email,
          data: {
            paperCode: res.data.id,
            fullName: formData.fullName,
            email: formData.email,
            paperTitle: formData.paperTitle,
            symposiumTitle: selectedSymp ? selectedSymp.title : 'Corrosion Science',
            presentationType: formData.presentationType
          }
        }).catch(err => console.warn('Email dispatch notice:', err));

        // Scroll to top of section for viewing confirmation
        const section = document.getElementById('call-for-papers');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }
    } catch {
      setErrorMessage('Submission error. Please try again or email iim.barodachapter@gmail.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="call-for-papers" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200" suppressHydrationWarning>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full inline-block">
            Peer-Reviewed Technical Proceedings
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Call for <span className="text-red-600">Papers &amp; Abstracts</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Submit your research across 14 specialized symposia. Accepted papers will be published in official ISBN proceedings and presented at GUJCORR 2027 (18–20 Feb 2027, Vadodara).
          </p>
        </div>

        {/* Submission Success Confirmation Display */}
        {submittedPaper ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                Paper Reference: {submittedPaper.id}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Abstract Submitted Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Your research abstract has been logged into the technical peer-review system for <strong>{submittedPaper.symposium}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left max-w-lg mx-auto space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Paper Tracking Code:</span>
                <span className="font-mono font-bold text-slate-900">{submittedPaper.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Symposium Track:</span>
                <span className="font-bold text-slate-900">{submittedPaper.symposium}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Paper Title:</span>
                <span className="font-bold text-slate-900 text-right truncate max-w-[250px]">{submittedPaper.title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Attached Resume:</span>
                <span className="font-semibold text-emerald-700">{resumeFile ? resumeFile.name : 'Author Profile Included'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Peer Review Status:</span>
                <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">Under Technical Review</span>
              </div>
            </div>

            {/* Next Steps: Step 4 (Payment/Pass) & Step 5 (Master Home) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto pt-2 text-left">
              <Link
                href={`/registration?from=paper&paperId=${submittedPaper.id}&author=${encodeURIComponent(formData.fullName)}`}
                className="p-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl shadow-md transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-red-200">Recommended Next Step</div>
                  <div className="text-xs font-black">Step 4: Book Delegate Pass &amp; Pay &rarr;</div>
                  <div className="text-[10px] text-red-100">Confirm presentation slot &amp; pass</div>
                </div>
                <CreditCard className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform shrink-0 ml-2" />
              </Link>

              <Link
                href="/masterhome"
                className="p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-md transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Portal Dashboard</div>
                  <div className="text-xs font-black">Step 5: Master Home &rarr;</div>
                  <div className="text-[10px] text-slate-300">Acceptance letter &amp; slides</div>
                </div>
                <LayoutDashboard className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform shrink-0 ml-2" />
              </Link>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubmittedPaper(null);
                  setResumeFile(null);
                  setPaperFile(null);
                  setFormData({
                    fullName: user?.fullName || '',
                    nationality: 'Indian',
                    gender: 'Male',
                    designation: user?.designation || '',
                    companyName: user?.organization || '',
                    education: '',
                    specialization: '',
                    achievements: '',
                    professionalMemberships: user?.membershipNumber || '',
                    address: '',
                    city: user?.city || 'Vadodara',
                    state: 'Gujarat',
                    country: user?.country || 'India',
                    zipCode: '',
                    phoneNumber: '',
                    mobileNumber: user?.mobileNumber || '',
                    email: user?.email || '',
                    presentationType: 'Oral',
                    symposiumId: 1,
                    paperTitle: '',
                    abstract: '',
                    keywords: '',
                    coAuthors: '',
                    isPresentingAuthor: true,
                    declarationAgreed: false
                  });
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
              >
                Submit another paper / poster
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8" suppressHydrationWarning>
            
            {/* Top Error Alert */}
            {errorMessage && (
              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center gap-2 text-xs font-bold text-red-800 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8" suppressHydrationWarning>
              
              {/* Group 1: Primary Author Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <User className="w-5 h-5 text-red-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    1. Primary Author &amp; Presenter Profile
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. / Prof. / Mr. Full Name"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nationality *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Indian"
                      value={formData.nationality}
                      onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other / Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Job Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Corrosion Engineer, Professor, PhD Scholar"
                      value={formData.designation}
                      onChange={e => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Organization / University *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. The M.S. University of Baroda / IOCL / L&T"
                      value={formData.companyName}
                      onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Education / Highest Degree</label>
                    <input
                      type="text"
                      placeholder="e.g. Ph.D. in Metallurgical Engineering / M.Tech Materials"
                      value={formData.education}
                      onChange={e => setFormData({ ...formData, education: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Area of Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g. Cathodic Protection / High-Temp Oxidation / Coatings"
                      value={formData.specialization}
                      onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Contact Details */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <MapPin className="w-5 h-5 text-teal-700" />
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    2. Author Contact &amp; Email
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Official Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="author@institution.edu / name@company.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.mobileNumber}
                      onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Paper & Abstract Details */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    3. Technical Paper &amp; Abstract Details
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Paper Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full technical research paper title..."
                    value={formData.paperTitle}
                    onChange={e => setFormData({ ...formData, paperTitle: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none font-bold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Symposium *</label>
                    <select
                      value={formData.symposiumId}
                      onChange={e => setFormData({ ...formData, symposiumId: Number(e.target.value) })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none font-semibold"
                    >
                      {SYMPOSIA.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.code} – {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Presentation Type *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, presentationType: 'Oral' })}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                          formData.presentationType === 'Oral'
                            ? 'bg-red-50 border-red-500 text-red-700 shadow-2xs font-extrabold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Oral Presentation
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, presentationType: 'Poster' })}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                          formData.presentationType === 'Poster'
                            ? 'bg-red-50 border-red-500 text-red-700 shadow-2xs font-extrabold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Poster Presentation
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Abstract (200 – 250 words) *</label>
                    <span className={`text-xs font-mono font-bold ${abstractWordCount >= 50 ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {abstractWordCount} words
                    </span>
                  </div>
                  <textarea
                    required
                    rows={6}
                    placeholder="Provide a structured abstract describing objective, experimental methodology, key corrosion findings, and conclusions..."
                    value={formData.abstract}
                    onChange={e => handleAbstractChange(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Keywords (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Cathodic Protection, EIS, Graphene, MIC"
                      value={formData.keywords}
                      onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Co-Authors (Names &amp; Affiliations)</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. A. Sharma (MSU), Prof. J. Patel (IIT)"
                      value={formData.coAuthors}
                      onChange={e => setFormData({ ...formData, coAuthors: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group 4: File Uploads & Declaration */}
              <div id="declarationSection" className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <FileCheck className="w-5 h-5 text-purple-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    4. File Uploads &amp; Declaration
                  </h3>
                </div>

                {/* 2 Interactive Upload Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* File 1: Resume / Bio */}
                  <div 
                    onClick={() => resumeInputRef.current?.click()}
                    className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center relative ${
                      resumeFile
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-300 bg-slate-50/50 hover:border-red-400 hover:bg-red-50/20'
                    }`}
                  >
                    <input
                      ref={resumeInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeSelect}
                      className="hidden"
                    />

                    {resumeFile ? (
                      <div className="space-y-2">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="font-extrabold text-xs text-slate-900 truncate max-w-xs mx-auto">
                          {resumeFile.name}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-bold">
                          {resumeFile.size} &bull; Ready to submit
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveResume}
                          className="mt-2 text-[11px] font-bold text-red-600 hover:text-red-800 bg-white border border-red-200 px-3 py-1 rounded-lg cursor-pointer transition-colors shadow-2xs"
                        >
                          Remove / Change File
                        </button>
                      </div>
                    ) : (
                      <div>
                        <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <div className="text-xs font-bold text-slate-800">Upload Author Resume / Bio</div>
                        <div className="text-[11px] text-slate-400 mt-1">PDF or DOCX (Max 10MB)</div>
                        <span className="mt-3 inline-block bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-colors">
                          Choose File
                        </span>
                      </div>
                    )}
                  </div>

                  {/* File 2: Full Paper / Extended Manuscript */}
                  <div
                    onClick={() => paperInputRef.current?.click()}
                    className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center relative ${
                      paperFile
                        ? 'border-teal-500 bg-teal-50/50 shadow-xs'
                        : 'border-slate-300 bg-slate-50/50 hover:border-teal-400 hover:bg-teal-50/20'
                    }`}
                  >
                    <input
                      ref={paperInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handlePaperSelect}
                      className="hidden"
                    />

                    {paperFile ? (
                      <div className="space-y-2">
                        <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="font-extrabold text-xs text-slate-900 truncate max-w-xs mx-auto">
                          {paperFile.name}
                        </div>
                        <div className="text-[11px] text-teal-700 font-bold">
                          {paperFile.size} &bull; Manuscript Attached
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePaper}
                          className="mt-2 text-[11px] font-bold text-red-600 hover:text-red-800 bg-white border border-red-200 px-3 py-1 rounded-lg cursor-pointer transition-colors shadow-2xs"
                        >
                          Remove / Change File
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <div className="text-xs font-bold text-slate-800">Full Paper / Extended Manuscript</div>
                        <div className="text-[11px] text-slate-400 mt-1">Due by 30 October 2026</div>
                        <span className="mt-3 inline-block bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-colors">
                          Optional at Abstract stage
                        </span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Presenting Author Confirmation Checkbox */}
                <div 
                  onClick={() => setFormData({ ...formData, isPresentingAuthor: !formData.isPresentingAuthor })}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    formData.isPresentingAuthor 
                      ? 'bg-red-50/60 border-red-400' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isPresentingAuthor}
                      onChange={e => setFormData({ ...formData, isPresentingAuthor: e.target.checked })}
                      className="mt-1 w-4 h-4 text-red-600 rounded focus:ring-red-500 border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs text-slate-800 leading-relaxed font-medium">
                      <strong className="text-red-700">Presenting Author Registration Requirement:</strong> I confirm that I am the presenting author. (Note: The presenting author must register as a delegate for the paper to be included in the technical program.)
                    </span>
                  </label>
                </div>

                {/* Declaration Checkbox with Interactive Clickable Container */}
                <div 
                  onClick={() => setFormData({ ...formData, declarationAgreed: !formData.declarationAgreed })}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    formData.declarationAgreed 
                      ? 'bg-emerald-50/50 border-emerald-400' 
                      : 'bg-red-50/40 border-red-200 hover:border-red-300'
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.declarationAgreed}
                      onChange={e => setFormData({ ...formData, declarationAgreed: e.target.checked })}
                      className="mt-1 w-4 h-4 text-red-600 rounded focus:ring-red-500 border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 leading-relaxed font-medium">
                      <strong className="text-slate-900">Submission &amp; Publication Declaration:</strong> I hereby declare that this paper/abstract represents original work and has not been previously published or concurrently submitted to another conference or journal. If accepted, at least one author will register and present the paper at GUJCORR 2027 in Vadodara.
                    </span>
                  </label>
                </div>
              </div>

              {/* Bottom Error Alert (Visible right above the button) */}
              {errorMessage && (
                <div className="p-3.5 bg-red-50 border-2 border-red-400 rounded-xl flex items-center gap-2 text-xs font-bold text-red-800 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm px-10 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Abstract...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Abstract for Peer Review</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </section>
  );
}
