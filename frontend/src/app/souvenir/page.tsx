'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  Mail, 
  Phone, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  X
} from 'lucide-react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import { SOUVENIR_ADVERTISEMENT_RATES, SOUVENIR_SPECS, CONFERENCE_INFO } from '@/data/conference';
import { api } from '@/lib/api';

export default function SouvenirPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<string>('Back Cover (₹1,00,000)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    category: 'Souvenir Back Cover (₹1,00,000)',
    message: ''
  });

  const handleOpenModal = (catName: string) => {
    setSelectedAd(catName);
    setForm(prev => ({ ...prev, category: catName }));
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.submitContact({
        name: form.contactPerson,
        email: form.email,
        phone: form.phone,
        organization: form.companyName,
        subject: `Souvenir Ad Space Booking: ${form.category}`,
        message: `Ad Space: ${form.category}\nArtwork notes: ${form.message || 'Artwork will be emailed in high resolution CDR/PDF.'}`
      });
      if (res.success) {
        setSubmitted(true);
      }
    } catch {
      alert('Error sending booking request. Please email iim.barodachapter@gmail.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />

      <PageHeader
        badge="Print Publication & Souvenir"
        title="Conference Souvenir"
        highlightedTitle="Advertising Tariff"
        description="Feature your enterprise in the official GUJCORR 2027 printed Souvenir Handbook, distributed directly to over 500+ delegates, keynote speakers, and corporate leaders."
        breadcrumbs={[{ label: 'Sponsorship', href: '/sponsorship' }, { label: 'Souvenir Ads' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Tariff Cards Grid */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-8 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                Tariff Card
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Advertising Rates (INR)
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-red-700 bg-red-100 border border-red-200 px-3.5 py-1.5 rounded-lg inline-block">
                *18% GST Extra on all rates
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SOUVENIR_ADVERTISEMENT_RATES.map((rate, idx) => (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 hover:border-red-300 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {rate.type}
                  </span>

                  <h3 className="font-extrabold text-slate-900 text-lg mt-3 mb-1">
                    {rate.category}
                  </h3>

                  <div className="my-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="text-2xl sm:text-3xl font-black text-red-600 font-mono">
                      {rate.rateFormatted}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-1">
                      + 18% GST Extra
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 mb-6">
                    <div className="font-bold text-slate-700">Artwork Dimensions:</div>
                    <div className="font-mono text-[11px] bg-slate-100 p-2 rounded-lg text-slate-800">
                      {rate.dimensions}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenModal(`${rate.category} (${rate.rateFormatted})`)}
                  className="w-full py-3 bg-slate-900 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Book Ad Space <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Artwork Guidelines Box */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl mb-16 border border-slate-800">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
            <FileText className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-extrabold text-white">
              Official Technical Artwork Guidelines
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-slate-300">
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <h4 className="font-bold text-white text-sm mb-1">1. Bleed Advertisement Size</h4>
                <p className="font-mono text-amber-300 text-xs">{SOUVENIR_SPECS.bleed.dimensions}</p>
                <p className="text-xs text-slate-400 mt-1">{SOUVENIR_SPECS.bleed.marginNote}</p>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <h4 className="font-bold text-white text-sm mb-1">2. Non-Bleed Advertisement Size</h4>
                <p className="font-mono text-amber-300 text-xs">{SOUVENIR_SPECS.nonBleed.dimensions}</p>
                <p className="text-xs text-slate-400 mt-1">Recommended for standard full-page text margins.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <h4 className="font-bold text-white text-sm mb-1">3. File Formats &amp; Resolution</h4>
                <p className="text-xs text-slate-300">
                  Please supply high-resolution files in <strong>CDR (CorelDraw), PDF (Print Ready), or EPS format</strong> with minimum <strong>300 DPI resolution</strong>. All fonts must be converted to curves/outlines.
                </p>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <h4 className="font-bold text-white text-sm mb-1">4. Submission Email</h4>
                <p className="text-xs text-slate-300">
                  Send final print artwork files directly to:{' '}
                  <a href={`mailto:${SOUVENIR_SPECS.emailArtworkTo}`} className="text-red-400 font-bold hover:underline">
                    {SOUVENIR_SPECS.emailArtworkTo}
                  </a>{' '}
                  accompanied with company name, transaction reference, and billing details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details Card */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
          <h4 className="text-base font-extrabold text-slate-900 uppercase tracking-wider mb-4">
            Payment &amp; Remittance Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Bank Name</span>
              <strong className="text-slate-900 text-sm">{CONFERENCE_INFO.bankDetails.bankName}</strong>
              <div className="text-slate-500 text-[11px] mt-0.5">{CONFERENCE_INFO.bankDetails.branch}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Account Name</span>
              <strong className="text-slate-900 text-sm">{CONFERENCE_INFO.bankDetails.accountName}</strong>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Account Number</span>
              <strong className="text-slate-900 font-mono text-sm">{CONFERENCE_INFO.bankDetails.accountNumber}</strong>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">IFSC / MICR Code</span>
              <strong className="text-slate-900 font-mono text-sm">{CONFERENCE_INFO.bankDetails.ifscCode}</strong>
              <div className="text-slate-500 font-mono text-[11px] mt-0.5">{CONFERENCE_INFO.bankDetails.micrCode}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              Souvenir Ad Space Booking
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Selected: <span className="font-bold text-red-600">{selectedAd}</span>
            </p>

            {submitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-extrabold text-slate-900">Request Sent!</h4>
                <p className="text-xs text-slate-600">
                  Our souvenir editorial desk will send proforma invoice and artwork receipt within 24 hours.
                </p>
                <button
                  onClick={() => { setModalOpen(false); setSubmitted(false); }}
                  className="bg-slate-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Full Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="ad@company.com"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="+91 9988881674"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Additional Information / Artwork Notes</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="CDR/PDF file reference, GST details, or billing notes..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Souvenir Ad Booking'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
