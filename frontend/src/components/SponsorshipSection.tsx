'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Crown, 
  Sparkles, 
  Download, 
  FileText, 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  Store,
  Building2,
  Hotel,
  Shield,
  X
} from 'lucide-react';
import { 
  SPONSORSHIP_PACKAGES, 
  EXHIBITOR_PACKAGES, 
  SOUVENIR_ADVERTISEMENT_RATES, 
  SOUVENIR_SPECS,
  SPONSORSHIP_COMMON_BENEFITS,
  CONFERENCE_INFO 
} from '@/data/conference';
import { api } from '@/lib/api';

interface SponsorshipSectionProps {
  onContactClick: () => void;
}

export default function SponsorshipSection({ onContactClick }: SponsorshipSectionProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>('sponsor-diamond');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTierForInquiry, setSelectedTierForInquiry] = useState<string>('Diamond Sponsor (₹5,00,000)');
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const [inquiryForm, setInquiryForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    mobileNumber: '',
    package: 'Diamond Sponsor (₹5,00,000)',
    notes: ''
  });

  const handleOpenInquiry = (tierName: string) => {
    setSelectedTierForInquiry(tierName);
    setInquiryForm(prev => ({ ...prev, package: tierName }));
    setIsModalOpen(true);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitting(true);
    try {
      const res = await api.submitContact({
        name: inquiryForm.contactPerson,
        email: inquiryForm.email,
        phone: inquiryForm.mobileNumber,
        organization: inquiryForm.companyName,
        subject: `Sponsorship/Exhibitor Inquiry: ${inquiryForm.package}`,
        message: `Package Interested: ${inquiryForm.package}\nAdditional Notes: ${inquiryForm.notes || 'None'}`
      });

      if (res.success) {
        setInquirySuccess(true);
      }
    } catch {
      alert('Inquiry error. Please email iim.barodachapter@gmail.com directly.');
    } finally {
      setInquirySubmitting(false);
    }
  };

  return (
    <section id="sponsorship" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-block bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Corporate Partnerships &amp; Branding
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Details for <span className="text-red-600">Sponsorship &amp; Exhibitors</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Showcase your organization in front of global leaders, EPC contractors, asset owners, and decision-makers from oil &amp; gas, infrastructure, power, and defence.
          </p>
        </div>

        {/* Common Benefits Callout */}
        <div className="mb-12 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                Universal Privileges
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                Benefits Included in Diamond, Gold, Silver &amp; Bronze Packages
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold bg-slate-800 px-3 py-1 rounded-full">
              Full Brand Coverage
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
            {SPONSORSHIP_COMMON_BENEFITS.map((b, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5 Sponsorship Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SPONSORSHIP_PACKAGES.map((pkg) => {
            return (
              <div
                key={pkg.id}
                className={`rounded-3xl p-8 border transition-all duration-200 flex flex-col justify-between relative ${
                  pkg.tier === 'Diamond'
                    ? 'bg-gradient-to-b from-purple-50/70 to-white border-purple-300 shadow-md hover:shadow-xl'
                    : pkg.popular
                    ? 'bg-gradient-to-b from-amber-50/70 to-white border-amber-400 shadow-md hover:shadow-xl'
                    : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
                    ⭐ Most Popular
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Sponsorship Tier
                    </span>
                    <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-sm">
                      {pkg.tier === 'Diamond' ? '💎' : pkg.tier === 'Gold' ? '🥇' : pkg.tier === 'Silver' ? '🥈' : pkg.tier === 'Bronze' ? '🥉' : '☕'}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                    {pkg.tier} Sponsor
                  </h3>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 my-4">
                    <div className="text-3xl font-black text-slate-900">{pkg.priceFormatted}</div>
                    <div className="text-xs text-slate-500 mt-1 font-semibold">+ 18% GST Extra</div>
                  </div>

                  {/* Included Benefits List */}
                  <div className="space-y-2.5 mb-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
                      Included Package Features:
                    </div>
                    {pkg.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenInquiry(`${pkg.tier} Sponsor (${pkg.priceFormatted})`)}
                  className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-red-600 text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  Book {pkg.tier} Sponsorship <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Exhibitors Section (Official Brochure Page 4) */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
              Industrial Exhibition
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Exhibitors Packages
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Showcase your corrosion monitoring instrumentation, NDT systems, specialized alloys, and protective linings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {EXHIBITOR_PACKAGES.map((exh) => (
              <div
                key={exh.id}
                className="bg-white rounded-3xl p-8 border-2 border-teal-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                      Exhibition Booth
                    </span>
                    <Store className="w-6 h-6 text-teal-700" />
                  </div>

                  <h4 className="text-2xl font-extrabold text-slate-900 mb-1">{exh.name}</h4>
                  <p className="text-xs text-slate-500">Dimensions: {exh.dimensions}</p>

                  <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 my-5">
                    <div className="text-3xl font-black text-slate-900">{exh.priceFormatted}</div>
                    <div className="text-xs text-teal-800 mt-1 font-semibold">Accommodation is not included</div>
                  </div>

                  <div className="space-y-2.5 mb-6">
                    {exh.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenInquiry(`${exh.name} (${exh.priceFormatted})`)}
                  className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-teal-700 hover:bg-teal-800 text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  Reserve {exh.name} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Side-by-Side Comparison Table */}
        <div className="mb-20 bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="pb-6 mb-6 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Comparative Analysis
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Sponsorship &amp; Exhibitor Package Comparison Table
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-4">Deliverables</th>
                  <th className="py-3 px-3 text-center text-purple-700">Diamond (₹5L)</th>
                  <th className="py-3 px-3 text-center text-amber-700">Gold (₹4L)</th>
                  <th className="py-3 px-3 text-center text-slate-700">Silver (₹2.5L)</th>
                  <th className="py-3 px-3 text-center text-orange-700">Bronze (₹1.25L)</th>
                  <th className="py-3 px-3 text-center text-emerald-700">Tea/Coffee (₹50k)</th>
                  <th className="py-3 px-3 text-center text-teal-700">12 SqM (₹75k)</th>
                  <th className="py-3 px-3 text-center text-teal-700">9 SqM (₹50k)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr className="hover:bg-white">
                  <td className="py-3.5 px-4 font-bold">Complimentary Delegates</td>
                  <td className="py-3.5 px-3 text-center font-black">8</td>
                  <td className="py-3.5 px-3 text-center font-black">6</td>
                  <td className="py-3.5 px-3 text-center font-black">4</td>
                  <td className="py-3.5 px-3 text-center font-black">2</td>
                  <td className="py-3.5 px-3 text-center font-black">2</td>
                  <td className="py-3.5 px-3 text-center font-black">4</td>
                  <td className="py-3.5 px-3 text-center font-black">2</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="py-3.5 px-4 font-bold">Exhibition Booth Size</td>
                  <td className="py-3.5 px-3 text-center font-semibold">12 SqM (3x4m)</td>
                  <td className="py-3.5 px-3 text-center font-semibold">12 SqM (3x4m)</td>
                  <td className="py-3.5 px-3 text-center font-semibold">9 SqM (3x3m)</td>
                  <td className="py-3.5 px-3 text-center font-semibold">9 SqM (3x3m)</td>
                  <td className="py-3.5 px-3 text-center text-slate-400">—</td>
                  <td className="py-3.5 px-3 text-center font-semibold">12 SqM (3x4m)</td>
                  <td className="py-3.5 px-3 text-center font-semibold">9 SqM (3x3m)</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="py-3.5 px-4 font-bold">Hotel Rooms (2 Nights + Breakfast)</td>
                  <td className="py-3.5 px-3 text-center font-bold text-emerald-700">3 Rooms</td>
                  <td className="py-3.5 px-3 text-center font-bold text-emerald-700">2 Rooms</td>
                  <td className="py-3.5 px-3 text-center font-bold text-emerald-700">2 Rooms</td>
                  <td className="py-3.5 px-3 text-center font-bold text-emerald-700">1 Room</td>
                  <td className="py-3.5 px-3 text-center text-slate-400">—</td>
                  <td className="py-3.5 px-3 text-center text-slate-400">—</td>
                  <td className="py-3.5 px-3 text-center text-slate-400">—</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="py-3.5 px-4 font-bold">Logo on Main-Hall Backdrop</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                  <td className="py-3.5 px-3 text-center text-slate-400">—</td>
                  <td className="py-3.5 px-3 text-center text-slate-400">—</td>
                  <td className="py-3.5 px-3 text-center text-slate-400">—</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="py-3.5 px-4 font-bold">Logo on Website &amp; Venue</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="py-3.5 px-4 font-bold">Souvenir Advertisement</td>
                  <td className="py-3.5 px-3 text-center font-semibold">1-Page Ad + Profile</td>
                  <td className="py-3.5 px-3 text-center font-semibold">1-Page Ad + Profile</td>
                  <td className="py-3.5 px-3 text-center font-semibold">1-Page Ad + Profile</td>
                  <td className="py-3.5 px-3 text-center font-semibold">1-Page Ad + Profile</td>
                  <td className="py-3.5 px-3 text-center font-semibold">Half-Page Ad</td>
                  <td className="py-3.5 px-3 text-center font-semibold">1-Page Ad</td>
                  <td className="py-3.5 px-3 text-center font-semibold">1-Page Ad</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="py-3.5 px-4 font-bold">Memento Presented</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                  <td className="py-3.5 px-3 text-center text-slate-400">—</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">✔</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Advertisement in Souvenir Table */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-block bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                Print Publicity &amp; Souvenir
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Advertisement for Sponsor / Souvenir Tariff
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Published in the official GUJCORR 2027 conference souvenir book distributed to all delegates and dignitaries.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg block">
                {SOUVENIR_SPECS.taxNote}
              </span>
              <Link
                href="/souvenir"
                className="text-xs font-bold text-slate-900 hover:text-red-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg shadow-2xs"
              >
                Dedicated Souvenir Page →
              </Link>
            </div>
          </div>

          {/* Rates Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Dimensions</th>
                  <th className="py-3 px-4 text-right">Rate (INR)</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-800">
                {SOUVENIR_ADVERTISEMENT_RATES.map((ad, index) => (
                  <tr key={index} className="hover:bg-white transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-500">{ad.type}</td>
                    <td className="py-4 px-4 font-extrabold text-slate-900">{ad.category}</td>
                    <td className="py-4 px-4 text-xs font-mono text-slate-600">{ad.dimensions}</td>
                    <td className="py-4 px-4 text-right font-black text-base text-red-600">{ad.rateFormatted}</td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleOpenInquiry(`Souvenir Ad: ${ad.category} (${ad.rateFormatted})`)}
                        className="text-xs font-bold text-slate-900 hover:text-red-600 bg-white border border-slate-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Reserve Space
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Advertisement Specs Box */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-700" />
              Technical Artwork Guidelines for Souvenir Publication:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li><strong>Bleed Advertisement:</strong> {SOUVENIR_SPECS.bleed.dimensions}. {SOUVENIR_SPECS.bleed.marginNote}</li>
              <li><strong>Non-Bleed Advertisement:</strong> {SOUVENIR_SPECS.nonBleed.dimensions}. Resolution: {SOUVENIR_SPECS.resolution} (minimum).</li>
              <li><strong>Format:</strong> High-resolution {SOUVENIR_SPECS.formats} (with fonts converted to curves/outlines).</li>
              <li><strong>Email Submissions:</strong> Send artwork files directly to <strong className="text-red-600">{SOUVENIR_SPECS.emailArtworkTo}</strong> with your company reference.</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Inquiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              Sponsorship &amp; Exhibitor Inquiry
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Selected: <span className="font-bold text-red-600">{selectedTierForInquiry}</span>
            </p>

            {inquirySuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-extrabold text-slate-900">Inquiry Delivered!</h4>
                <p className="text-xs text-slate-600">
                  Our Secretariat coordinator will contact you with booking contracts, proforma invoice, and booth coordinates within 24 hours.
                </p>
                <button
                  onClick={() => { setIsModalOpen(false); setInquirySuccess(false); }}
                  className="bg-slate-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.companyName}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, companyName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g. Larsen & Toubro / TCR Advanced"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.contactPerson}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, contactPerson: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Your Full Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Official Email *</label>
                    <input
                      type="email"
                      required
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="corporate@company.com"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone / Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={inquiryForm.mobileNumber}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, mobileNumber: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Specific Requirements / Stall Preference</label>
                  <textarea
                    rows={3}
                    value={inquiryForm.notes}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Corner booth request, delegate names, or billing notes..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={inquirySubmitting}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {inquirySubmitting ? 'Sending Request...' : 'Submit Official Booking Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
