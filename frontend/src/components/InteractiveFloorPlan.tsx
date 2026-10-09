'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  CreditCard,
  FileText,
  Clock,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import RazorpayModal, { RazorpayPaymentResult } from './RazorpayModal';

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

const INITIAL_BOOTHS: BoothData[] = [
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
    status: 'Available',
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
    status: 'Available',
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
    status: 'Available',
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
    status: 'Available',
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
    status: 'Available',
    inclusions: ['2-side open corner booth', 'Octanorm shell scheme', 'Fascia board with company name', '2 Tables & 4 Chairs', '4 Spotlights & 2 Power points', '3 Complimentary Delegate Passes']
  },
  {
    id: 'b-cr-5',
    number: 'CR-05',
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
    id: 'b-cr-6',
    number: 'CR-06',
    type: 'Corner Shell (18 sqm)',
    dimensions: '6m × 3m (2 Sides Open)',
    areaSqm: 18,
    basePrice: 190000,
    gstAmount: 34200,
    totalPrice: 224200,
    status: 'Available',
    inclusions: ['2-side open corner booth', 'Octanorm shell scheme', 'Fascia board with company name', '2 Tables & 4 Chairs', '4 Spotlights & 2 Power points', '3 Complimentary Delegate Passes']
  },

  // Standard Stalls S-01 to S-24 (9 sqm)
  ...Array.from({ length: 24 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');

    return {
      id: `b-std-${num}`,
      number: `S-${num}`,
      type: 'Standard Shell (9 sqm)' as const,
      dimensions: '3m × 3m (1 Side Open)',
      areaSqm: 9,
      basePrice: 95000,
      gstAmount: 17100,
      totalPrice: 112100,
      status: 'Available' as const,
      inclusions: ['Octanorm modular shell scheme', 'Fascia name display board', '1 Table & 2 Chairs', '3 Spotlights & 1 5A Socket', '2 Complimentary Delegate Passes', 'Entry in Official Exhibition Directory']
    };
  })
];

export default function InteractiveFloorPlan() {
  const { user } = useAuth();
  const [booths, setBooths] = useState<BoothData[]>(INITIAL_BOOTHS);
  const [selectedBooth, setSelectedBooth] = useState<BoothData | null>(null);
  const [bookingStep, setBookingStep] = useState<'details' | 'form' | 'success'>('details');
  const [paymentChoice, setPaymentChoice] = useState<'online' | 'wire'>('online');
  const [filterType, setFilterType] = useState<string>('All');
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    mobile: '',
    fasciaName: '',
    gstin: '',
    notes: ''
  });

  // Sync user profile on mount
  useEffect(() => {
    if (user) {
      setBookingForm(prev => ({
        ...prev,
        companyName: user.organization || prev.companyName,
        contactPerson: user.fullName || prev.contactPerson,
        email: user.email || prev.email,
        mobile: user.mobileNumber || prev.mobile,
        fasciaName: (user.organization || prev.companyName || '').toUpperCase()
      }));
    }

    // Fetch from WordPress and sync with localStorage
    api.getBooths().then(res => {
      if (res.success && res.data && res.data.length > 0) {
        setBooths(prev => prev.map(b => {
          const matched = res.data.find((s: any) => 
            (s.booth_number && s.booth_number === b.number) ||
            (s.stallNumber && s.stallNumber === b.number) ||
            (s.stallId && s.stallId === b.id)
          );
          if (matched) {
            const status = (matched.status === 'Booked' || matched.status === 'Paid' || matched.paymentStatus === 'Paid') ? 'Booked' : 'Reserved';
            return {
              ...b,
              status,
              bookedCompany: matched.company_name || matched.companyName
            };
          }
          return b;
        }));
      }
    }).catch(err => console.warn('Booths fetch warning:', err));

    // Load custom persisted bookings from localStorage
    if (typeof window !== 'undefined') {
      const savedExhibitors = JSON.parse(localStorage.getItem('gujcorr_exhibitors') || '[]');
      if (savedExhibitors.length > 0) {
        setBooths(prev => prev.map(b => {
          const matched = savedExhibitors.find((s: any) => s.stallNumber === b.number || s.stallId === b.id);
          if (matched) {
            return {
              ...b,
              status: matched.paymentStatus === 'Paid' ? 'Booked' : 'Reserved',
              bookedCompany: matched.companyName
            };
          }
          return b;
        }));
      }
    }
  }, [user]);

  const handleStallClick = (booth: BoothData) => {
    setSelectedBooth(booth);
    setBookingStep('details');
    setBookingForm(prev => ({
      ...prev,
      fasciaName: prev.companyName ? prev.companyName.toUpperCase() : (booth.bookedCompany || '').toUpperCase()
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooth) return;

    if (paymentChoice === 'online') {
      setIsRazorpayOpen(true);
    } else {
      finalizeBooking('Pending Wire Transfer (Proforma Issued)');
    }
  };

  const handleRazorpaySuccess = (result: RazorpayPaymentResult) => {
    setIsRazorpayOpen(false);
    finalizeBooking('Confirmed & Paid (Razorpay)', result.razorpay_payment_id);
  };

  const finalizeBooking = (status: string, txnRef?: string) => {
    if (!selectedBooth) return;
    setIsProcessing(true);

    const isPaid = status.includes('Paid');
    const newExhibitorRecord = {
      id: 'EXH-' + Math.floor(100000 + Math.random() * 900000),
      stallId: selectedBooth.id,
      stallNumber: selectedBooth.number,
      stallType: selectedBooth.type,
      dimensions: selectedBooth.dimensions,
      areaSqm: selectedBooth.areaSqm,
      companyName: bookingForm.companyName,
      contactPerson: bookingForm.contactPerson,
      email: bookingForm.email,
      mobile: bookingForm.mobile,
      fasciaName: bookingForm.fasciaName || bookingForm.companyName.toUpperCase(),
      gstin: bookingForm.gstin,
      basePrice: selectedBooth.basePrice,
      gstAmount: selectedBooth.gstAmount,
      totalPrice: selectedBooth.totalPrice,
      paymentStatus: isPaid ? 'Paid' : 'Pending',
      paymentMethod: isPaid ? 'Razorpay Online' : 'Wire Transfer / NEFT',
      transactionRef: txnRef || (isPaid ? 'RZP-EXH-' + Math.random().toString(36).substring(2, 8).toUpperCase() : 'UNPAID-PROFORMA'),
      bookedAt: new Date().toISOString()
    };

    // Update local state
    setBooths(prev => prev.map(b => {
      if (b.id === selectedBooth.id) {
        return {
          ...b,
          status: isPaid ? 'Booked' : 'Reserved',
          bookedCompany: bookingForm.companyName
        };
      }
      return b;
    }));

    // Persist in localStorage
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('gujcorr_exhibitors') || '[]');
      existing.push(newExhibitorRecord);
      localStorage.setItem('gujcorr_exhibitors', JSON.stringify(existing));
    }

    // Sync to WordPress REST API
    api.reserveBooth({
      boothNumber: selectedBooth.number,
      stallNumber: selectedBooth.number,
      stallType: selectedBooth.type,
      companyName: bookingForm.companyName,
      contactPerson: bookingForm.contactPerson,
      email: bookingForm.email,
      mobile: bookingForm.mobile,
      fasciaName: bookingForm.fasciaName || bookingForm.companyName.toUpperCase(),
      gstin: bookingForm.gstin,
      boothSize: `${selectedBooth.areaSqm} sqm`,
      basePrice: selectedBooth.basePrice,
      gstAmount: selectedBooth.gstAmount,
      totalPrice: selectedBooth.totalPrice,
      paymentStatus: isPaid ? 'Booked' : 'Reserved',
      status: isPaid ? 'Paid' : 'Reserved'
    }).catch(err => console.warn('WordPress booth sync warning:', err));

    // Trigger confirmation email
    api.sendNotificationEmail({
      type: 'exhibition_booked',
      to: bookingForm.email,
      data: {
        stallNumber: selectedBooth.number,
        stallType: selectedBooth.type,
        areaSqm: selectedBooth.areaSqm,
        companyName: bookingForm.companyName,
        contactPerson: bookingForm.contactPerson,
        fasciaName: bookingForm.fasciaName || bookingForm.companyName.toUpperCase(),
        totalPrice: selectedBooth.totalPrice,
        status: isPaid ? 'Confirmed & Fully Paid' : 'Provisional Reservation (Proforma Issued)'
      }
    }).catch(err => console.warn('Exhibition email warning:', err));

    setIsProcessing(false);
    setBookingStep('success');
  };

  const filteredBooths = booths.filter(b => {
    if (filterType === 'All') return true;
    if (filterType === 'Available') return b.status === 'Available';
    if (filterType === 'Island') return b.type.includes('Island');
    if (filterType === 'Standard') return b.type.includes('Standard');
    return true;
  });

  return (
    <div className="space-y-8" suppressHydrationWarning>
      
      {/* Interactive Legend & Filter Toolbar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-emerald-500 shadow-xs"></span>
            <span className="text-slate-700">Available ({booths.filter(b => b.status === 'Available').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-amber-400 shadow-xs"></span>
            <span className="text-slate-700">Reserved ({booths.filter(b => b.status === 'Reserved').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-slate-400 shadow-xs"></span>
            <span className="text-slate-700">Booked ({booths.filter(b => b.status === 'Booked').length})</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Available', 'Island', 'Standard'].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
                filterType === f
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 2D Visual Floor Plan Grid */}
      <div className="bg-slate-950 p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl text-white space-y-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800">
              Sarabhai Pavilion &bull; 18–20 Feb 2027
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Industrial Technology Exhibition Arena
            </h3>
          </div>
          <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            Click any stall to view deliverables &amp; book online
          </span>
        </div>

        {/* 1. Main Entrance & Island Pavilions Center Stage */}
        <div className="space-y-3">
          <div className="text-center">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-slate-900 text-slate-400 px-6 py-1.5 rounded-full border border-slate-800 inline-block">
              ▼ MAIN ENTRANCE &amp; DELEGATE REGISTRATION FOYER ▼
            </span>
          </div>

          <div className="text-xs font-extrabold text-amber-400 uppercase tracking-wider pt-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Premium Center-Stage Island Pavilions (6m × 6m / 36 sqm)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {filteredBooths.filter(b => b.type.includes('Island')).map(booth => {
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
                      : 'bg-slate-900/90 border-slate-800 opacity-90'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono font-black text-xl text-white group-hover:scale-105 transition-transform">
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
                    {booth.bookedCompany ? (
                      <div className="text-[11px] font-semibold text-amber-300 truncate mt-1">
                        {booth.bookedCompany}
                      </div>
                    ) : (
                      <div className="text-[11px] font-bold text-emerald-400 mt-1">
                        ₹{booth.totalPrice.toLocaleString('en-IN')} (Incl. GST)
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Corner Stalls (18 sqm) */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-4 h-4 text-blue-400" />
            <span>Corner Stalls &bull; 2-Sides Open (6m × 3m / 18 sqm)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {filteredBooths.filter(b => b.type.includes('Corner')).map(booth => {
              const isAvailable = booth.status === 'Available';
              const isReserved = booth.status === 'Reserved';

              return (
                <div
                  key={booth.id}
                  onClick={() => handleStallClick(booth)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between h-28 ${
                    isAvailable
                      ? 'bg-emerald-950/30 border-emerald-500 hover:bg-emerald-900/50'
                      : isReserved
                      ? 'bg-amber-950/30 border-amber-500 hover:bg-amber-900/50'
                      : 'bg-slate-900 border-slate-800 opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-white">{booth.number}</span>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      isAvailable ? 'bg-emerald-500 text-white' : isReserved ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {booth.status}
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400">{booth.areaSqm} sqm</div>
                    <div className="text-[10px] font-extrabold truncate text-slate-200">
                      {booth.bookedCompany || `₹${(booth.totalPrice / 1000).toFixed(0)}k`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Standard Octanorm Shell Scheme Stalls (9 sqm) */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Standard Modular Shell Schemes (3m × 3m / 9 sqm)</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
            {filteredBooths.filter(b => b.type.includes('Standard')).map(booth => {
              const isAvailable = booth.status === 'Available';
              const isReserved = booth.status === 'Reserved';

              return (
                <div
                  key={booth.id}
                  onClick={() => handleStallClick(booth)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-24 ${
                    isAvailable
                      ? 'bg-emerald-950/20 border-emerald-500/80 hover:bg-emerald-900/40 hover:border-emerald-400'
                      : isReserved
                      ? 'bg-amber-950/20 border-amber-500/80 hover:bg-amber-900/40'
                      : 'bg-slate-900 border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-white">{booth.number}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      isAvailable ? 'bg-emerald-400' : isReserved ? 'bg-amber-400' : 'bg-slate-600'
                    }`}></span>
                  </div>

                  <div className="text-[9px] text-slate-400 truncate">
                    {booth.bookedCompany || 'Available'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Interactive Modal Dialog for Stall Inspection & Booking */}
      {selectedBooth && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded ${
                  selectedBooth.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : selectedBooth.status === 'Reserved' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-800'
                }`}>
                  {selectedBooth.status}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  Stall #{selectedBooth.number} &bull; {selectedBooth.type}
                </h3>
                <p className="text-xs text-slate-500">{selectedBooth.dimensions} &bull; {selectedBooth.areaSqm} sqm</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBooth(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {bookingStep === 'details' && (
              <div className="space-y-4">
                {/* Pricing Details */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block">Total Tariff (18% GST Inclusive)</span>
                    <div className="text-2xl font-black text-slate-900">
                      ₹{selectedBooth.totalPrice.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      ₹{selectedBooth.basePrice.toLocaleString('en-IN')} Base + ₹{selectedBooth.gstAmount.toLocaleString('en-IN')} GST
                    </span>
                  </div>

                  <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl">
                    Standard Amenities
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

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBooth(null)}
                    className="text-xs font-bold text-slate-600 px-4 py-2.5 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Close
                  </button>
                  {selectedBooth.status === 'Available' ? (
                    <button
                      type="button"
                      onClick={() => setBookingStep('form')}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      Book This Stall Online <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 italic">
                      Stall is currently {selectedBooth.status} by {selectedBooth.bookedCompany || 'Exhibitor'}
                    </span>
                  )}
                </div>
              </div>
            )}

            {bookingStep === 'form' && (
              <form onSubmit={handleFormSubmit} className="space-y-4">
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
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">GSTIN Number (Optional)</label>
                      <input
                        type="text"
                        placeholder="24AAAAA0000A1Z5"
                        value={bookingForm.gstin}
                        onChange={(e) => setBookingForm({ ...bookingForm, gstin: e.target.value.toUpperCase() })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Fascia Board Title (Max 30 chars)</label>
                    <input
                      type="text"
                      placeholder="CORRPRO ASIA"
                      value={bookingForm.fasciaName}
                      onChange={(e) => setBookingForm({ ...bookingForm, fasciaName: e.target.value.toUpperCase() })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase text-slate-900"
                    />
                  </div>

                  {/* Payment Selection Options */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-2">Select Payment Method:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`p-3 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                        paymentChoice === 'online' ? 'border-red-600 bg-red-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}>
                        <input
                          type="radio"
                          name="paymentChoice"
                          className="sr-only"
                          checked={paymentChoice === 'online'}
                          onChange={() => setPaymentChoice('online')}
                        />
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-red-600" />
                          <span className="text-xs font-extrabold text-slate-900">Instant Online</span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">UPI / Cards / NetBanking</span>
                      </label>

                      <label className={`p-3 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                        paymentChoice === 'wire' ? 'border-red-600 bg-red-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}>
                        <input
                          type="radio"
                          name="paymentChoice"
                          className="sr-only"
                          checked={paymentChoice === 'wire'}
                          onChange={() => setPaymentChoice('wire')}
                        />
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-teal-700" />
                          <span className="text-xs font-extrabold text-slate-900">Bank Wire Transfer</span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">Issue Proforma Invoice</span>
                      </label>
                    </div>
                  </div>

                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep('details')}
                    className="text-xs font-bold text-slate-600 px-4 py-2.5 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {paymentChoice === 'online' ? `Pay ₹${selectedBooth.totalPrice.toLocaleString('en-IN')} & Confirm` : 'Confirm Reservation'}
                  </button>
                </div>
              </form>
            )}

            {bookingStep === 'success' && (
              <div className="text-center py-4 space-y-5 animate-in fade-in">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                    Reservation Confirmed
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Stall #{selectedBooth.number} Allocated!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                    Stall reservation for <strong>{bookingForm.companyName}</strong> has been logged. An official confirmation email with stall deliverables has been dispatched to <strong>{bookingForm.email}</strong>.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <Link
                    href="/invoice"
                    className="w-full sm:w-auto text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-colors"
                  >
                    Download Proforma Invoice &rarr;
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedBooth(null)}
                    className="w-full sm:w-auto text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Razorpay Checkout Gateway Modal */}
      {selectedBooth && (
        <RazorpayModal
          isOpen={isRazorpayOpen}
          onClose={() => setIsRazorpayOpen(false)}
          onSuccess={handleRazorpaySuccess}
          amount={selectedBooth.totalPrice}
          description={`Exhibition Stall #${selectedBooth.number} (${selectedBooth.type})`}
          prefill={{
            name: bookingForm.contactPerson,
            email: bookingForm.email,
            contact: bookingForm.mobile
          }}
        />
      )}

    </div>
  );
}
