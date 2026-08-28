'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Check, 
  CreditCard, 
  QrCode, 
  Building2, 
  UserCheck, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  ArrowRight,
  ShieldAlert,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  FileCheck,
  Receipt,
  FileText,
  Clock,
  ShieldCheck,
  Zap,
  LayoutDashboard
} from 'lucide-react';
import { REGISTRATION_TIERS, CONFERENCE_INFO } from '../data/mockData';
import { DelegateRegistration } from '../types';
import { api } from '../lib/api';
import { useAuth, UserRole } from '../context/AuthContext';
import RazorpayModal, { RazorpayPaymentResult } from './RazorpayModal';

interface DelegateRegistrationProps {
  onSuccess?: (reg: DelegateRegistration) => void;
  defaultTierId?: string;
}

export default function DelegateRegistrationSection({ onSuccess, defaultTierId }: DelegateRegistrationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const linkedPaperId = searchParams.get('paperId');
  const fromSource = searchParams.get('from');
  const { user, register: authRegister } = useAuth();

  const [role, setRole] = useState<UserRole>('Delegate');
  const [selectedTierId, setSelectedTierId] = useState<string>(
    fromSource === 'paper' || user?.membershipType?.includes('Member') ? 'tier-member' : defaultTierId || 'tier-non-member'
  );
  const [paymentOption, setPaymentOption] = useState<'pay_later' | 'pay_now'>('pay_later');
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay Online (UPI/Card/NetBanking)' | 'Bank Transfer / NEFT' | 'UPI / QR'>('Razorpay Online (UPI/Card/NetBanking)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedReg, setConfirmedReg] = useState<DelegateRegistration | null>(null);

  // Razorpay Modal State
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);

  const [form, setForm] = useState({
    title: 'Mr.',
    firstName: '',
    lastName: '',
    gender: 'Male',
    nationality: 'Indian',
    email: '',
    password: '',
    mobileNumber: '',
    isWhatsapp: true,
    designation: '',
    organization: '',
    department: 'Corrosion & Materials Engineering',
    membershipType: 'Non-Member',
    membershipNumber: '',
    hasGstin: false,
    gstin: '',
    companyLegalName: '',
    country: 'India',
    state: 'Gujarat',
    city: 'Vadodara',
    pincode: '390001',
    address: '',
    dietaryPreference: 'Pure Vegetarian',
    needAccommodationInfo: false,
    transactionReference: '',
    agreedToTerms: true
  });

  // Sync auth user profile
  React.useEffect(() => {
    if (user) {
      let rawName = (user.fullName || '').trim();
      let extractedTitle = form.title || 'Mr.';
      const titleMatch = rawName.match(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.|Er\.)\s+/i);
      if (titleMatch) {
        extractedTitle = titleMatch[1];
        rawName = rawName.replace(/^(?:(?:Dr|Prof|Mr|Ms|Mrs|Er)\.?\s*)+/gi, '').trim();
      }

      const parts = rawName.split(' ');
      const fName = parts[0] || '';
      const lName = parts.slice(1).join(' ') || '';

      setForm(prev => ({
        ...prev,
        title: extractedTitle,
        firstName: fName || prev.firstName,
        lastName: lName || prev.lastName,
        email: user.email || prev.email || '',
        organization: user.organization || prev.organization || '',
        designation: user.designation || prev.designation || '',
        mobileNumber: user.mobileNumber || prev.mobileNumber || '',
        city: user.city || prev.city || 'Vadodara',
        country: user.country || prev.country || 'India',
        membershipNumber: user.membershipNumber || prev.membershipNumber || '',
        membershipType: user.membershipType?.includes('Member') ? 'AMPP Member' : prev.membershipType
      }));

      if (user.membershipType?.includes('Member') || fromSource === 'paper') {
        setSelectedTierId('tier-member');
      }
    }
  }, [user, fromSource]);

  const selectedTier = REGISTRATION_TIERS.find(t => t.id === selectedTierId) || REGISTRATION_TIERS[1];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreedToTerms) {
      alert('Please accept the conference terms and conditions to proceed.');
      return;
    }

    if (paymentOption === 'pay_now' && paymentMethod === 'Razorpay Online (UPI/Card/NetBanking)') {
      setIsRazorpayOpen(true);
    } else {
      executeRegistration(form.transactionReference || 'UNPAID-PROVISIONAL');
    }
  };

  const handleRazorpaySuccess = (result: RazorpayPaymentResult) => {
    setIsRazorpayOpen(false);
    executeRegistration(result.razorpay_payment_id, 'Confirmed & Paid (Razorpay)');
  };

  const executeRegistration = async (txnRef: string, statusOverride?: string) => {
    setIsProcessing(true);
    const cleanFirst = form.firstName.replace(/^(?:(?:Dr|Prof|Mr|Ms|Mrs|Er)\.?\s*)+/gi, '').trim();
    const cleanLast = form.lastName.replace(/^(?:(?:Dr|Prof|Mr|Ms|Mrs|Er)\.?\s*)+/gi, '').trim();
    const fullName = `${form.title} ${cleanFirst} ${cleanLast}`.trim();

    try {
      const isPaid = paymentOption === 'pay_now' || statusOverride?.includes('Paid');
      const res = await api.registerDelegate({
        fullName: fullName,
        gender: form.gender,
        designation: form.designation,
        organization: form.organization,
        department: form.department,
        email: form.email,
        mobileNumber: form.mobileNumber,
        country: form.country,
        state: form.state,
        city: form.city,
        address: form.address || `${form.city}, ${form.state}`,
        category: selectedTier.name,
        membershipNumber: form.membershipNumber,
        baseAmount: selectedTier.basePrice,
        gstAmount: selectedTier.gstAmount,
        totalAmount: selectedTier.totalPrice,
        paymentMethod: isPaid ? (paymentMethod === 'Razorpay Online (UPI/Card/NetBanking)' ? 'Razorpay (UPI / Card / NetBanking)' : paymentMethod) : 'Pay Later / Pending Verification',
        transactionReference: txnRef || (isPaid ? 'TXN-' + Math.floor(100000 + Math.random() * 900000) : 'UNPAID-PROVISIONAL')
      });

      if (res.success) {
        setConfirmedReg(res.data);
        
        // Auto-register session in Auth Context
        await authRegister({
          email: form.email,
          fullName: fullName,
          title: form.title,
          role: role,
          organization: form.organization,
          designation: form.designation,
          mobileNumber: form.mobileNumber,
          city: form.city,
          country: form.country,
          membershipType: form.membershipType,
          membershipNumber: form.membershipNumber,
          ticketId: res.data.ticketId,
          passTier: selectedTier.name + ` (₹${selectedTier.totalPrice.toLocaleString()})`
        });

        // Trigger appropriate email notification via Nodemailer
        if (isPaid) {
          api.sendNotificationEmail({
            type: 'payment_success',
            to: form.email,
            data: {
              ticketId: res.data.ticketId,
              fullName: fullName,
              email: form.email,
              category: selectedTier.name,
              amount: selectedTier.totalPrice,
              transactionRef: txnRef || 'RZP-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
              paymentMethod: paymentMethod || 'Razorpay Online'
            }
          }).catch(err => console.warn('Email dispatch warning:', err));
        } else {
          api.sendNotificationEmail({
            type: 'payment_pending',
            to: form.email,
            data: {
              ticketId: res.data.ticketId,
              fullName: fullName,
              email: form.email,
              category: selectedTier.name,
              totalAmount: selectedTier.totalPrice
            }
          }).catch(err => console.warn('Email dispatch warning:', err));
        }

        if (onSuccess) onSuccess(res.data);
      }
    } catch {
      alert('Registration error. Please check your inputs or contact iim.barodachapter@gmail.com.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="register" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-block bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Free Account &amp; Delegate Registration
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Register for <span className="text-red-600">GUJCORR 2027</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Create your master account for free to submit abstracts, access author tools, book delegate passes, or manage booth credentials. <strong>No upfront payment required!</strong>
          </p>
        </div>

        {/* Confirmed Ticket & Account Creation Display */}
        {confirmedReg ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xl max-w-3xl mx-auto text-center space-y-8 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Account Created &bull; Registration Confirmed
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Welcome to GUJCORR 2027, {confirmedReg.fullName}!
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Your delegate pass is registered. You can now login to the <strong>Master Home</strong> to access all author and conference tools.
              </p>
            </div>

            {/* Official Delegate Badge Preview */}
            <div className="p-6 bg-slate-900 text-white rounded-3xl text-left border-2 border-red-500 shadow-xl relative overflow-hidden max-w-md mx-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-red-400">GUJCORR 2027</div>
                  <div className="text-xs font-bold text-slate-300">Official Delegate Pass</div>
                </div>
                <div className="w-12 h-12 bg-white rounded-xl p-1 shrink-0 flex items-center justify-center">
                  <img 
                    src={confirmedReg.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GUJCORR2027:${confirmedReg.ticketId}`} 
                    alt="Delegate QR Token"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="py-4 space-y-2">
                <div className="text-lg font-black text-white">{confirmedReg.fullName}</div>
                <div className="text-xs text-slate-300">{confirmedReg.designation} &bull; {confirmedReg.organization}</div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-red-600 text-white rounded">
                    {confirmedReg.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    ID: {confirmedReg.ticketId}
                  </span>
                </div>
                {confirmedReg.transactionRef && (
                  <div className="text-[10px] text-emerald-400 font-mono pt-1">
                    Txn Ref: {confirmedReg.transactionRef}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>18–20 Feb 2027 &bull; Vadodara</span>
                <span className="text-emerald-400 font-bold">Status: {confirmedReg.status}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/masterhome"
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Master Home Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Print Badge
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Linked Research Paper Banner */}
            {linkedPaperId && (
              <div className="p-4 bg-teal-50 border-2 border-teal-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-teal-700 text-white rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-teal-950 block font-extrabold text-sm">
                      ⚡ Linked Author Pass for Paper #{linkedPaperId}
                    </strong>
                    <span className="text-teal-800">
                      Booking this pass confirms your presentation slot in the GUJCORR 2027 Scientific Schedule.
                    </span>
                  </div>
                </div>
                <span className="bg-teal-700 text-white font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shrink-0 shadow-2xs">
                  Member Discount Applied
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Pass Selection & Features */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <UserCheck className="w-5 h-5 text-red-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Select Your Registration Category
                  </h3>
                </div>

                <div className="space-y-3">
                  {REGISTRATION_TIERS.map((tier) => {
                    const isSelected = selectedTierId === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-red-600 bg-red-50/40 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-extrabold text-xs sm:text-sm text-slate-900">{tier.name}</div>
                            <div className="text-[11px] text-slate-500">{tier.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-sm text-red-600">₹{tier.totalPrice.toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-slate-400">incl. 18% GST</div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="mt-2 pt-2 border-t border-red-200 text-[11px] text-red-700 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Selected Category
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delegate Entitlements */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-3 shadow-md">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">All Passes Include:</h4>
                <ul className="text-xs space-y-2 text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Access to all 14 Technical Symposia &amp; Keynotes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Official GUJCORR 2027 Conference Delegate Kit &amp; Bag</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Buffet Lunch &amp; High Tea on all 3 conference days</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Gala Cultural Dinner &amp; Awards Evening Pass</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Peer-Reviewed Proceedings volume with ISBN</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Right Column: Registration Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
              
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* 1. Account Role Switcher */}
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    1. Account Type &amp; Profile Role
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Delegate', 'Author', 'Speaker', 'Exhibitor'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          role === r
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Personal Information */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-md inline-block">
                    2. Delegate Personal Details
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Title *</label>
                      <select
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                      >
                        <option>Mr.</option>
                        <option>Ms.</option>
                        <option>Dr.</option>
                        <option>Prof.</option>
                        <option>Er.</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sharma"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="delegate@company.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={form.mobileNumber}
                        onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Professional Organization */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md inline-block">
                    3. Professional Affiliation
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Designation / Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lead Corrosion Specialist"
                        value={form.designation}
                        onChange={(e) => setForm({ ...form, designation: e.target.value })}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Organization / Company *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. L&amp;T / ONGC / Reliance / MSU Baroda"
                        value={form.organization}
                        onChange={(e) => setForm({ ...form, organization: e.target.value })}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. GST & Billing Details (Optional) */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-purple-900 bg-purple-50 px-2.5 py-1 rounded-md inline-block">
                      4. Corporate Tax Invoice (GST 18%)
                    </span>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.hasGstin}
                        onChange={(e) => setForm({ ...form, hasGstin: e.target.checked })}
                        className="rounded text-red-600"
                      />
                      <span>Require GST Invoice</span>
                    </label>
                  </div>

                  {form.hasGstin && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-purple-50/50 rounded-2xl border border-purple-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">15-Digit GSTIN *</label>
                        <input
                          type="text"
                          placeholder="24AAAAA0000A1Z5"
                          value={form.gstin}
                          onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                          className="w-full py-2 px-3 bg-white border border-purple-300 rounded-xl text-xs font-mono font-bold text-slate-900 uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Company Legal Billing Name *</label>
                        <input
                          type="text"
                          placeholder="Legal Entity Name on GST Portal"
                          value={form.companyLegalName}
                          onChange={(e) => setForm({ ...form, companyLegalName: e.target.value })}
                          className="w-full py-2 px-3 bg-white border border-purple-300 rounded-xl text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Payment Choice: Pay Later or Pay Now */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    5. Payment Option
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setPaymentOption('pay_later')}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        paymentOption === 'pay_later'
                          ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentOption === 'pay_later' ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'
                        }`}>
                          {paymentOption === 'pay_later' && <Check className="w-2.5 h-2.5" />}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Register Now &amp; Pay Later</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 pl-6">
                        Activate your account immediately. Pay via Bank NEFT / PO / On-site before 15 Dec 2026.
                      </p>
                    </div>

                    <div
                      onClick={() => setPaymentOption('pay_now')}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        paymentOption === 'pay_now'
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentOption === 'pay_now' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}>
                          {paymentOption === 'pay_now' && <Check className="w-2.5 h-2.5" />}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Pay Now Online (Razorpay)</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 pl-6">
                        Instant checkout via UPI (GPay/PhonePe), Credit/Debit Card, or NetBanking.
                      </p>
                    </div>
                  </div>

                  {paymentOption === 'pay_now' && (
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-xs">
                            R
                          </div>
                          <span className="text-xs font-bold text-slate-900">Razorpay Secure Payment Gateway</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          256-Bit SSL Encrypted
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {['Razorpay Online (UPI/Card/NetBanking)', 'Bank Transfer / NEFT', 'UPI / QR'].map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method as any)}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              paymentMethod === method
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200'
                            }`}
                          >
                            {method === 'Razorpay Online (UPI/Card/NetBanking)' ? '⚡ Razorpay Instant' : method}
                          </button>
                        ))}
                      </div>

                      {paymentMethod !== 'Razorpay Online (UPI/Card/NetBanking)' && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Transaction UTR / Bank Reference No.
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. UTR1234567890 or UPI Ref"
                            value={form.transactionReference}
                            onChange={(e) => setForm({ ...form, transactionReference: e.target.value })}
                            className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-900 uppercase"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Total Summary */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Selected Pass ({selectedTier.name}):</span>
                    <span>₹{selectedTier.basePrice.toLocaleString('en-IN')} + 18% GST (₹{selectedTier.gstAmount})</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Pass Tariff:</span>
                    <span className="text-red-600 text-xl font-black">₹{selectedTier.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.agreedToTerms}
                      onChange={(e) => setForm({ ...form, agreedToTerms: e.target.checked })}
                      className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                    />
                    <span>
                      I agree to the conference guidelines, code of conduct, and create my GUJCORR 2027 user account.
                    </span>
                  </label>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm sm:text-base py-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  {isProcessing ? (
                    <span>Creating Account &amp; Issuing Credentials...</span>
                  ) : (
                    <>
                      {paymentOption === 'pay_later' 
                        ? `Complete Free Registration & Enter Master Home` 
                        : `Pay ₹${selectedTier.totalPrice.toLocaleString('en-IN')} via Razorpay`} <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

              </form>

            </div>
          </div>
          </div>
        )}

      </div>

      {/* Razorpay Checkout Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        amount={selectedTier.totalPrice}
        description={`GUJCORR 2027 - ${selectedTier.name}`}
        prefill={{
          name: `${form.title} ${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          contact: form.mobileNumber
        }}
        onSuccess={handleRazorpaySuccess}
        onFailure={(err) => alert(`Payment Failed: ${err.description}`)}
      />

    </section>
  );
}
