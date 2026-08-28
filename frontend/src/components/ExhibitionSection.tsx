'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Store, 
  CheckCircle2, 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { INITIAL_BOOTHS, CONFERENCE_INFO } from '../data/mockData';
import { ExhibitorBooth } from '../types';
import { api } from '../lib/api';

export default function ExhibitionSection() {
  const [booths, setBooths] = useState<ExhibitorBooth[]>(INITIAL_BOOTHS);
  const [selectedBooth, setSelectedBooth] = useState<ExhibitorBooth | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    designation: '',
    email: '',
    mobileNumber: '',
    industry: '',
    productsDescription: ''
  });

  const handleBoothClick = (booth: ExhibitorBooth) => {
    setSelectedBooth(booth);
  };

  const handleExhibitorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.submitExhibitorInquiry({
        ...form,
        preferredBooth: selectedBooth ? selectedBooth.boothNumber : 'Any Available'
      });

      if (res.success) {
        setInquirySuccess(true);
      }
    } catch {
      alert('Inquiry error. Please contact iim.barodachapter@gmail.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="exhibition" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-block bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Industrial Technology Expo
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Exhibit at <span className="text-red-600">GUJCORR 2027</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Showcase your cutting-edge corrosion testing instruments, protective coatings, cathodic protection anodes, NDT equipment, and engineering services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Interactive Floor Plan & Booth Grid */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-teal-700" />
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                    Interactive Exhibition Floor Plan
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">Click a booth to reserve</span>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-4 text-xs font-bold pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-400" />
                  <span className="text-slate-700">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-400" />
                  <span className="text-slate-700">Reserved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-400" />
                  <span className="text-slate-400">Booked</span>
                </div>
              </div>

              {/* Booth Layout Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-4">
                {booths.map((booth) => {
                  const isSelected = selectedBooth?.id === booth.id;
                  const isAvailable = booth.status === 'Available';
                  const isBooked = booth.status === 'Booked';

                  return (
                    <button
                      key={booth.id}
                      type="button"
                      onClick={() => handleBoothClick(booth)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-red-600 bg-red-50 border-red-500 shadow-sm'
                          : isAvailable
                          ? 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-500 hover:shadow-xs'
                          : isBooked
                          ? 'bg-slate-100 border-slate-200 opacity-70'
                          : 'bg-amber-50/80 border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm font-mono">
                          {booth.boothNumber}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isAvailable
                            ? 'bg-emerald-200 text-emerald-900'
                            : isBooked
                            ? 'bg-slate-200 text-slate-600'
                            : 'bg-amber-200 text-amber-900'
                        }`}>
                          {booth.status}
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold text-slate-700 truncate">
                        {booth.size}
                      </div>

                      {booth.companyName ? (
                        <div className="text-[10px] text-slate-500 font-medium truncate mt-1">
                          {booth.companyName}
                        </div>
                      ) : (
                        <div className="text-[10px] text-emerald-800 font-bold mt-1">
                          ₹{booth.priceINR.toLocaleString()}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Booth Details */}
              {selectedBooth && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mt-4 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-slate-900">Selected Booth: {selectedBooth.boothNumber}</span>
                    <span className="text-slate-500 block text-xs">
                      {selectedBooth.size} &bull; Dimensions: {selectedBooth.dimensions} &bull; Status: {selectedBooth.status}
                    </span>
                  </div>
                  <div className="text-right font-bold text-red-600">
                    {selectedBooth.status === 'Available' ? `₹${selectedBooth.priceINR.toLocaleString()} + GST` : 'Occupied'}
                  </div>
                </div>
              )}
            </div>

            {/* Why Exhibit Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                <div className="text-xl font-extrabold text-slate-900">500+</div>
                <div className="text-[11px] font-medium text-slate-500">Qualified Buyers</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                <div className="text-xl font-extrabold text-slate-900">100+</div>
                <div className="text-[11px] font-medium text-slate-500">Plant Owners / PSUs</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center col-span-2 sm:col-span-1">
                <div className="text-xl font-extrabold text-slate-900">3 Days</div>
                <div className="text-[11px] font-medium text-slate-500">B2B Networking</div>
              </div>
            </div>
          </div>

          {/* Right Column: Exhibitor Inquiry Form */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-1">
              Exhibitor Space Inquiry Form
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill in your organization details to reserve your preferred booth stall space.
            </p>

            {inquirySuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-base">Inquiry Submitted!</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thank you! Our exhibition coordinator (Mr. Hiren Panchal) will contact you with booth layout diagrams and reservation details.
                </p>
                <button
                  onClick={() => setInquirySuccess(false)}
                  className="text-xs font-bold text-emerald-800 underline cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleExhibitorSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TCR Advanced / GAIL / DEHN"
                    value={form.companyName}
                    onChange={e => setForm({ ...form, companyName: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person *</label>
                    <input
                      type="text"
                      required
                      placeholder="Name"
                      value={form.contactPerson}
                      onChange={e => setForm({ ...form, contactPerson: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Designation *</label>
                    <input
                      type="text"
                      required
                      placeholder="Title / Role"
                      value={form.designation}
                      onChange={e => setForm({ ...form, designation: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="email@company.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={form.mobileNumber}
                      onChange={e => setForm({ ...form, mobileNumber: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Industry Sector</label>
                  <input
                    type="text"
                    placeholder="e.g. Protective Coatings / Cathodic Protection / NDT"
                    value={form.industry}
                    onChange={e => setForm({ ...form, industry: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Products / Equipment to Exhibit</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe products, instruments or solutions you will showcase..."
                    value={form.productsDescription}
                    onChange={e => setForm({ ...form, productsDescription: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Submitting Inquiry...' : 'Submit Booth Reservation Inquiry →'}
                  </button>
                </div>
              </form>
            )}

            {/* Direct Contact Phone info */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold">Exhibition Coordinator:</span>
              <a href="tel:+919988881674" className="font-bold text-red-600 hover:text-red-700">
                +91 99888 81674
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
