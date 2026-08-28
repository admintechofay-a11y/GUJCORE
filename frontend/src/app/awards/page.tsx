'use client';

import React, { useState } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import { 
  Award, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Upload, 
  ArrowRight, 
  GraduationCap, 
  ShieldCheck, 
  Calendar,
  User,
  Building
} from 'lucide-react';

interface AwardItem {
  id: string;
  title: string;
  category: 'Academic & Science' | 'Lifetime Honors' | 'Student Competition' | 'Industrial Innovation';
  prize: string;
  description: string;
  eligibility: string[];
}

const AWARDS_LIST: AwardItem[] = [
  {
    id: 'aw-1',
    title: 'Excellence in Corrosion Science & Technology Award',
    category: 'Academic & Science',
    prize: 'Gold Plaque + Official Citation + ₹25,000 Cash Honorarium',
    description: 'Recognizes groundbreaking research contributions in fundamental electrochemical mechanisms, novel corrosion inhibitors, or advanced protective materials.',
    eligibility: [
      'Open to faculty, scientists, and researchers with at least 5 peer-reviewed publications.',
      'Research conducted primarily in India within the last 5 years.',
      'Nomination supported by at least two Fellows of AMPP, IIM, or INAE.'
    ]
  },
  {
    id: 'aw-2',
    title: 'Distinguished Scientist & Lifetime Achievement Award',
    category: 'Lifetime Honors',
    prize: 'Silver Trophy + Lifetime Honorary Fellowship + Citation',
    description: 'Honors veteran stalwarts who have dedicated 25+ years to advancing corrosion engineering education, industrial safety standards, and national asset preservation.',
    eligibility: [
      'Minimum 25 years of distinguished career in academia, PSUs, or engineering consultancy.',
      'Demonstrated leadership in major national infrastructure or hydrocarbon integrity projects.'
    ]
  },
  {
    id: 'aw-3',
    title: 'Best Student Oral & Poster Presentation Awards',
    category: 'Student Competition',
    prize: '1st Prize ₹15,000 & 2nd Prize ₹10,000 + Certificate of Merit',
    description: 'Encourages undergraduate, post-graduate, and PhD scholars presenting innovative experimental research at the GUJCORR 2027 Student Symposia.',
    eligibility: [
      'Author must be a full-time enrolled student or registered PhD scholar on presentation date.',
      'Oral presentation or A0 vertical poster presented during the conference sessions.'
    ]
  },
  {
    id: 'aw-4',
    title: 'Industrial Corrosion Mitigation Innovation Award',
    category: 'Industrial Innovation',
    prize: 'Industrial Excellence Shield + Case Study Publication in Journal',
    description: 'Celebrates manufacturing plants, refineries, and contractors who implemented novel cathodic protection, online IoT monitoring, or coating technologies resulting in significant cost savings.',
    eligibility: [
      'Open to engineering companies, PSUs, contractors, and coating applicators.',
      'Documented operational data demonstrating failure prevention or life extension.'
    ]
  }
];

export default function AwardsPage() {
  const [selectedCategory, setSelectedCategory] = useState(AWARDS_LIST[0].title);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState({
    nomineeName: '',
    designation: '',
    organization: '',
    email: '',
    mobile: '',
    nominatorName: '',
    nominatorEmail: '',
    citationSummary: '',
    supportingDocumentName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />

      <PageHeader
        badge="Recognition & Excellence"
        title="Corrosion Awareness"
        highlightedTitle="Awards & Student Contest"
        description="Honoring visionary researchers, industry pioneers, and promising student scholars who advance corrosion science and industrial asset protection in India (18–20 Feb 2027, Vadodara)."
        breadcrumbs={[{ label: 'Awards' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Awards Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AWARDS_LIST.map((award) => (
            <div
              key={award.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full">
                    {award.category}
                  </span>
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                  {award.title}
                </h3>
                <div className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100 mb-3">
                  ★ Prize: {award.prize}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {award.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Eligibility Criteria:
                  </span>
                  {award.eligibility.map((el, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{el}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory(award.title);
                  const el = document.getElementById('nomination-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                Nominate for This Award <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Online Award Nomination Form */}
        <section id="nomination-form" className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl max-w-4xl mx-auto space-y-6">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
              Nomination Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Submit Award <span className="text-red-600">Nomination</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Nominations close on <strong>15th November 2026</strong>. Self-nominations and institutional endorsements are accepted.
            </p>
          </div>

          {isSubmitted ? (
            <div className="text-center py-12 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Nomination Successfully Submitted!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Thank you. The nomination for <strong>{form.nomineeName}</strong> for the <em>{selectedCategory}</em> has been securely submitted to the Award Committee Jury.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
              >
                Submit Another Nomination
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Award Category *</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500"
                >
                  {AWARDS_LIST.map((aw) => (
                    <option key={aw.id} value={aw.title}>
                      {aw.title} ({aw.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nominee Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Patel"
                    value={form.nomineeName}
                    onChange={(e) => setForm({ ...form, nomineeName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Designation &amp; Department *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Metallurgist / Professor"
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Institution / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IIT Bombay, IOCL, L&T"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="nominee@domain.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Citation / Justification Summary (Max 300 words) *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail key research breakthroughs, patent references, industrial cost savings, or academic impact that justify this nomination..."
                  value={form.citationSummary}
                  onChange={(e) => setForm({ ...form, citationSummary: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Attach CV &amp; Supporting Publications / Citations (PDF)
                </label>
                <input
                  type="file"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-extrabold text-sm py-4 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Trophy className="w-5 h-5" /> Submit Official Award Nomination
              </button>

            </form>
          )}

        </section>

      </div>

      <Footer />
    </div>
  );
}
