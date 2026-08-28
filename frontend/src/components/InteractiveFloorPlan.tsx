'use client';

import React, { useState } from 'react';
import { 
  Store, 
  Check, 
  X, 
  Layers, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  Building2, 
  Phone, 
  Mail, 
  Sparkles,
  Zap
} from 'lucide-react';

interface BoothData {
  id: string;
  number: string;
  type: 'Island Pavilion (36 sqm)' | 'Corner Shell (18 sqm)' | 'Standard Shell (9 sqm)' | 'Table Top (6 sqm)';
  dimensions: string;
  areaSqm: number;
  basePrice: number;
  gstAmount: number;
  totalPrice: number;
  status: 'Available' | 'Reserved' | 'Booked';
  bookedCompany?: string;
  inclusions: string[];
}

const BOOTH_DATABASE: BoothData[] = [
  // 4 Island Pavilions (Center Premium)
  {
    id: 'b-is-1',
    number: 'IS-01',
    type: 'Island Pavilion (36 sqm)',
    dimensions: '6m × 6m (4 Sides Open)',
    areaSqm: 36,
    basePrice: 350000,
    gstAmount: 63000,
    totalPrice: 413000,
    status: 'Booked',
    bookedCompany: 'TCR Advanced Engineering Pvt Ltd',
    inclusions: ['4-side open island stall', 'Custom fascia structure', '4 Tables & 8 Executive Chairs', '8 Spotlights & 3 Power Points', '4 Complimentary Delegate Passes', 'Full page color souvenir advertisement']
  },
  {
    id: 'b-is-2',
    number: 'IS-02',
    type: 'Island Pavilion (36 sqm)',
    dimensions: '6m × 6m (4 Sides Open)',
    areaSqm: 36,
    basePrice: 350000,
    gstAmount: 63000,
    totalPrice: 413000,
    status: 'Booked',
    bookedCompany: 'Larsen & Toubro (L&T Heavy Engg)',
    inclusions: ['4-side open island stall', 'Custom fascia structure', '4 Tables & 8 Executive Chairs', '8 Spotlights & 3 Power Points', '4 Complimentary Delegate Passes', 'Full page color souvenir advertisement']
  },
  {
    id: 'b-is-3',
    number: 'IS-03',
    type: 'Island Pavilion (36 sqm)',
    dimensions: '6m × 6m (4 Sides Open)',
    areaSqm: 36,
    basePrice: 350000,
    gstAmount: 63000,
    totalPrice: 413000,
    status: 'Available',
    inclusions: ['4-side open island stall', 'Custom fascia structure', '4 Tables & 8 Executive Chairs', '8 Spotlights & 3 Power Points', '4 Complimentary Delegate Passes', 'Full page color souvenir advertisement']
  },
  {
    id: 'b-is-4',
    number: 'IS-04',
    type: 'Island Pavilion (36 sqm)',
    dimensions: '6m × 6m (4 Sides Open)',
    areaSqm: 36,
    basePrice: 350000,
    gstAmount: 63000,
    totalPrice: 413000,
    status: 'Reserved',
    bookedCompany: 'Corrpro Asia / Aegion Corp',
    inclusions: ['4-side open island stall', 'Custom fascia structure', '4 Tables & 8 Executive Chairs', '8 Spotlights & 3 Power Points', '4 Complimentary Delegate Passes', 'Full page color souvenir advertisement']
  },

  // 6 Corner Stalls
  {
    id: 'b-cr-1',
    number: 'CR-01',
    type: 'Corner Shell (18 sqm)',
    dimensions: '6m × 3m (2 Sides Open)',
    areaSqm: 18,
    basePrice: 190000,
    gstAmount: 34200,
    totalPrice: 224200,
    status: 'Booked',
    bookedCompany: 'Berger Paints India Ltd (Protective)',
    inclusions: ['2-side open corner booth', 'Octanorm shell scheme', 'Fascia board with company name', '2 Tables & 4 Chairs', '4 Spotlights & 2 Power points', '3 Complimentary Delegate Passes']
  },
  {
    id: 'b-cr-2',
    number: 'CR-02',
    type: 'Corner Shell (18 sqm)',
    dimensions: '6m × 3m (2 Sides Open)',
    areaSqm: 18,
    basePrice: 190000,
    gstAmount: 34200,
    totalPrice: 224200,
    status: 'Available',
    inclusions: ['2-side open corner booth', 'Octanorm shell scheme', 'Fascia board with company name', '2 Tables & 4 Chairs', '4 Spotlights & 2 Power points', '3 Complimentary Delegate Passes']
  },
  {
    id: 'b-cr-3',
    number: 'CR-03',
    type: 'Corner Shell (18 sqm)',
    dimensions: '6m × 3m (2 Sides Open)',
    areaSqm: 18,
    basePrice: 190000,
    gstAmount: 34200,
    totalPrice: 224200,
    status: 'Available',
    inclusions: ['2-side open corner booth', 'Octanorm shell scheme', 'Fascia board with company name', '2 Tables & 4 Chairs', '4 Spotlights & 2 Power points', '3 Complimentary Delegate Passes']
  },
  {
    id: 'b-cr-4',
    number: 'CR-04',
    type: 'Corner Shell (18 sqm)',
    dimensions: '6m × 3m (2 Sides Open)',
    areaSqm: 18,
    basePrice: 190000,
    gstAmount: 34200,
    totalPrice: 224200,
    status: 'Reserved',
    bookedCompany: 'Kansai Nerolac Paints',
    inclusions: ['2-side open corner booth', 'Octanorm shell scheme', 'Fascia board with company name', '2 Tables & 4 Chairs', '4 Spotlights & 2 Power points', '3 Complimentary Delegate Passes']
  },

  // 16 Standard 9 sqm Stalls
  ...Array.from({ length: 16 }, (_, i) => {
    const num = i + 1;
    const numStr = num < 10 ? `ST-0${num}` : `ST-${num}`;
    const isBooked = [2, 5, 8, 11, 14].includes(num);
    const isReserved = [3, 9, 13].includes(num);
    const bookedNames = ['Ujas Energy Solutions', 'Consultech Systems', 'Advance Electronic Tech', 'Arya Metallurgical', 'Technocrat Instruments'];

    return {
      id: `b-st-${num}`,
      number: numStr,
      type: 'Standard Shell (9 sqm)' as const,
      dimensions: '3m × 3m (1 Side Open)',
      areaSqm: 9,
      basePrice: 95000,
      gstAmount: 17100,
      totalPrice: 112100,
      status: isBooked ? ('Booked' as const) : isReserved ? ('Reserved' as const) : ('Available' as const),
      bookedCompany: isBooked ? bookedNames[i % bookedNames.length] : isReserved ? 'Corporate Hold' : undefined,
      inclusions: ['Octanorm modular shell scheme', 'Fascia name display board', '1 Table & 2 Chairs', '3 Spotlights & 1 5A Socket', '2 Complimentary Delegate Passes', 'Entry in Official Exhibition Directory']
    };
  })
];

export default function InteractiveFloorPlan() {
  const [selectedBooth, setSelectedBooth] = useState<BoothData | null>(null);
  const [bookingStep, setBookingStep] = useState<'details' | 'form' | 'success'>('details');
  const [filterType, setFilterType] = useState<string>('All');
  
  const [bookingForm, setBookingForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    mobile: '',
    fasciaName: '',
    gstin: '',
    notes: ''
  });

  const handleStallClick = (booth: BoothData) => {
    setSelectedBooth(booth);
    setBookingStep('details');
    setBookingForm({
      ...bookingForm,
      fasciaName: bookingForm.companyName.toUpperCase()
    });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooth) return;

    // Mark as reserved locally
    selectedBooth.status = 'Reserved';
    selectedBooth.bookedCompany = bookingForm.companyName;
    setBookingStep('success');
  };

  const filteredBooths = BOOTH_DATABASE.filter(b => {
    if (filterType === 'All') return true;
    if (filterType === 'Available') return b.status === 'Available';
    if (filterType === 'Island') return b.type.includes('Island');
    if (filterType === 'Standard') return b.type.includes('Standard');
    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* Interactive Legend & Stats */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-emerald-500 shadow-xs"></span>
            <span className="text-slate-700">Available ({BOOTH_DATABASE.filter(b => b.status === 'Available').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-amber-400 shadow-xs"></span>
            <span className="text-slate-700">Reserved ({BOOTH_DATABASE.filter(b => b.status === 'Reserved').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-slate-400 shadow-xs"></span>
            <span className="text-slate-700">Booked ({BOOTH_DATABASE.filter(b => b.status === 'Booked').length})</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Available', 'Island', 'Standard'].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                filterType === f
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 2D Visual Floor Plan Grid */}
      <div className="bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl text-white space-y-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800">
              Interactive 2D Floor Plan Layout
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1">
              Technology Exhibition Arena (Sarabhai Pavilion)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Click any stall to view dimensions, amenities &amp; reserve online
          </span>
        </div>

        {/* 1. Main Entrance & Island Pavilions Center Stage */}
        <div className="space-y-3">
          <div className="text-center">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-slate-800 text-slate-400 px-4 py-1 rounded-full border border-slate-700">
              ▼ MAIN ENTRANCE &amp; DELEGATE REGISTRATION FOYER ▼
            </span>
          </div>

          <div className="text-xs font-extrabold text-amber-400 uppercase tracking-wider pt-2">
            ★ Premium Island Pavilions (6m × 6m / 36 sqm)
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BOOTH_DATABASE.filter(b => b.type.includes('Island')).map(booth => {
              const isAvailable = booth.status === 'Available';
              const isReserved = booth.status === 'Reserved';

              return (
                <div
                  key={booth.id}
                  onClick={() => handleStallClick(booth)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between h-36 relative overflow-hidden group ${
                    isAvailable
                      ? 'bg-emerald-950/40 border-emerald-500 hover:bg-emerald-900/60 hover:shadow-lg hover:shadow-emerald-500/20'
                      : isReserved
                      ? 'bg-amber-950/40 border-amber-500 hover:bg-amber-900/60'
                      : 'bg-slate-800/80 border-slate-700 opacity-90'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono font-black text-lg text-white group-hover:scale-105 transition-transform">
                      {booth.number}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      isAvailable ? 'bg-emerald-500 text-white' : isReserved ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {booth.status}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-200">{booth.dimensions}</div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {booth.bookedCompany || `₹${booth.totalPrice.toLocaleString('en-IN')} (incl. GST)`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Corner Stalls & Standard Stalls Matrix */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-xs font-extrabold text-teal-400 uppercase tracking-wider">
            ★ Standard Shell &amp; Corner Booths (3m × 3m &amp; 6m × 3m)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {BOOTH_DATABASE.filter(b => !b.type.includes('Island')).map(booth => {
              const isAvailable = booth.status === 'Available';
              const isReserved = booth.status === 'Reserved';

              return (
                <div
                  key={booth.id}
                  onClick={() => handleStallClick(booth)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-24 relative group ${
                    isAvailable
                      ? 'bg-emerald-950/30 border-emerald-500/80 hover:bg-emerald-900/50 hover:border-emerald-400'
                      : isReserved
                      ? 'bg-amber-950/30 border-amber-500/80 hover:bg-amber-900/50'
                      : 'bg-slate-800/60 border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-white">{booth.number}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      isAvailable ? 'bg-emerald-400 shadow-xs' : isReserved ? 'bg-amber-400' : 'bg-slate-600'
                    }`}></span>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-300 font-bold">{booth.areaSqm} sqm</div>
                    <div className="text-[9.5px] text-slate-400 truncate">
                      {booth.bookedCompany || `₹${(booth.totalPrice / 1000).toFixed(0)}k`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center pt-2">
          <span className="text-[10px] font-bold tracking-widest uppercase bg-slate-800 text-slate-400 px-4 py-1 rounded-full border border-slate-700">
            ▲ TECHNICAL AUDITORIUM &amp; DINING HALL ACCESS ▲
          </span>
        </div>

      </div>

      {/* Stall Modal (Details / Reservation Form / Success) */}
      {selectedBooth && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedBooth(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingStep === 'details' && (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white px-2.5 py-0.5 rounded">
                      Stall Specification
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                      Booth #{selectedBooth.number} ({selectedBooth.type})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Dimensions: <strong className="text-slate-800">{selectedBooth.dimensions}</strong> &bull; Total Area: <strong className="text-slate-800">{selectedBooth.areaSqm} sqm</strong>
                    </p>
                  </div>

                  <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                    selectedBooth.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : selectedBooth.status === 'Reserved' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedBooth.status}
                  </span>
                </div>

                {selectedBooth.bookedCompany && (
                  <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-700">
                    Allocated to: <strong>{selectedBooth.bookedCompany}</strong>
                  </div>
                )}

                {/* Pricing Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block">Official Stall Tariff (18% GST Inclusive)</span>
                    <div className="text-2xl font-black text-slate-900">
                      ₹{selectedBooth.totalPrice.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      ₹{selectedBooth.basePrice.toLocaleString('en-IN')} + 18% GST (₹{selectedBooth.gstAmount.toLocaleString('en-IN')})
                    </span>
                  </div>

                  <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl">
                    Standard Inclusions
                  </span>
                </div>

                {/* Inclusions List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Included Amenities &amp; Deliverables:
                  </h4>
                  <div className="space-y-1.5">
                    {selectedBooth.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer Action */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedBooth(null)}
                    className="text-xs font-bold text-slate-600 px-4 py-2.5"
                  >
                    Close
                  </button>
                  {selectedBooth.status === 'Available' && (
                    <button
                      type="button"
                      onClick={() => setBookingStep('form')}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      Reserve This Booth Now <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {bookingStep === 'form' && (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded">
                    Online Stall Reservation
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    Book Stall #{selectedBooth.number} ({selectedBooth.areaSqm} sqm)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Total: <strong className="text-red-600 font-extrabold">₹{selectedBooth.totalPrice.toLocaleString('en-IN')}</strong> (18% GST inclusive)
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Company / Exhibitor Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Corrpro Asia Pvt Ltd"
                      value={bookingForm.companyName}
                      onChange={(e) => setBookingForm({ ...bookingForm, companyName: e.target.value, fasciaName: e.target.value.toUpperCase() })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Person *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={bookingForm.contactPerson}
                        onChange={(e) => setBookingForm({ ...bookingForm, contactPerson: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="contact@company.com"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={bookingForm.mobile}
                        onChange={(e) => setBookingForm({ ...bookingForm, mobile: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Fascia Board Name (Max 30 chars)</label>
                      <input
                        type="text"
                        placeholder="CORRPRO ASIA"
                        value={bookingForm.fasciaName}
                        onChange={(e) => setBookingForm({ ...bookingForm, fasciaName: e.target.value.toUpperCase() })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep('details')}
                    className="text-xs font-bold text-slate-600 px-4 py-2.5"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Confirm Stall Reservation
                  </button>
                </div>
              </form>
            )}

            {bookingStep === 'success' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Stall #{selectedBooth.number} Reserved!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                    Your reservation for <strong>{bookingForm.companyName}</strong> has been logged. The Secretariat will issue your Proforma Invoice shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBooth(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
