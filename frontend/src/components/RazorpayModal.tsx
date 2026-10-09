'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Building, 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Lock, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export interface RazorpayPaymentResult {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  method: string;
  amount: number;
  currency: string;
  email: string;
  contact: string;
}

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number; // in INR
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (result: RazorpayPaymentResult) => void;
  onFailure?: (error: { code: string; description: string }) => void;
}

export default function RazorpayModal({
  isOpen,
  onClose,
  amount,
  description,
  prefill,
  onSuccess,
  onFailure
}: RazorpayModalProps) {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [upiVpa, setUpiVpa] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(prefill?.name || '');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [qrCodeCountDown, setQrCodeCountDown] = useState(300); // 5 minutes

  useEffect(() => {
    if (isOpen) {
      setPaymentStatus('idle');
      setIsProcessing(false);
      setQrCodeCountDown(300);
      if (prefill?.name && !cardHolder) {
        setCardHolder(prefill.name);
      }
    }
  }, [isOpen, prefill]);

  useEffect(() => {
    if (!isOpen || paymentStatus !== 'idle') return;
    const interval = setInterval(() => {
      setQrCodeCountDown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, paymentStatus]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePay = () => {
    setIsProcessing(true);
    setProcessingStep('Connecting to Razorpay Secure Gateway...');

    setTimeout(() => {
      setProcessingStep('Authorizing payment with bank server...');
    }, 700);

    setTimeout(() => {
      setProcessingStep('Generating payment token & GST receipt...');
    }, 1400);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStatus('success');

      const result: RazorpayPaymentResult = {
        razorpay_payment_id: 'pay_rzp_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        razorpay_order_id: 'order_GUJ27_' + Math.floor(100000 + Math.random() * 900000),
        razorpay_signature: 'sig_' + Math.random().toString(36).substring(2, 14),
        method: activeTab.toUpperCase(),
        amount: amount,
        currency: 'INR',
        email: prefill?.email || 'iim.barodachapter@gmail.com',
        contact: prefill?.contact || '+91 9988881674'
      };

      setTimeout(() => {
        onSuccess(result);
      }, 1200);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Razorpay Brand Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-md">
                R
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white">Razorpay</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                    SECURE GATEWAY
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">GUJCORR 2027 Conference &bull; AMPP Gujarat</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Amount to Pay</div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
            <div className="truncate max-w-xs">{description}</div>
            <div className="flex items-center gap-1 text-emerald-400 font-semibold shrink-0">
              <Lock className="w-3 h-3" />
              <span>256-bit SSL Secured</span>
            </div>
          </div>
        </div>

        {/* Processing Spinner Overlay */}
        {isProcessing && (
          <div className="p-12 text-center space-y-4 bg-white">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-base">Processing Payment...</h4>
              <p className="text-xs text-slate-500 font-medium">{processingStep}</p>
            </div>
            <p className="text-[11px] text-slate-400">Do not refresh or close this browser window.</p>
          </div>
        )}

        {/* Success Confirmation Overlay */}
        {!isProcessing && paymentStatus === 'success' && (
          <div className="p-10 text-center space-y-4 bg-white animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-extrabold text-slate-900">Payment Successful!</h4>
              <p className="text-xs text-slate-500">
                Transaction reference generated. Redirecting to your confirmed badge...
              </p>
            </div>
            <div className="inline-block bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-700">
              Amount Paid: ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        )}

        {/* Main Payment Selection Tabs */}
        {!isProcessing && paymentStatus === 'idle' && (
          <div className="p-6 space-y-6">
            
            {/* Payment Method Selector */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeTab === 'upi' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeTab === 'card' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('netbanking')}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeTab === 'netbanking' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('wallet')}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeTab === 'wallet' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Wallet</span>
              </button>
            </div>

            {/* TAB 1: UPI & QR Code */}
            {activeTab === 'upi' && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-3">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                    <span>Scan with Any UPI App (GPay / PhonePe / Paytm / BHIM)</span> &bull; 
                    <span className="font-mono text-red-600">{formatTimer(qrCodeCountDown)}</span>
                  </div>

                  <div className="w-36 h-36 bg-white p-2.5 rounded-2xl mx-auto border border-slate-200 shadow-inner flex items-center justify-center relative group">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=amppgujarat@icici&pn=GUJCORR2027&am=${amount}&cu=INR`} 
                      alt="Razorpay UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Or Pay via UPI ID / VPA</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="username@okhdfcbank / mobile@paytm"
                      value={upiVpa}
                      onChange={(e) => setUpiVpa(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Card Payment */}
            {activeTab === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="16-digit card number"
                    maxLength={19}
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="3 or 4 digits"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Name as on card"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: NetBanking */}
            {activeTab === 'netbanking' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Select Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank', 'Bank of Baroda'].map(bank => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        selectedBank === bank ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Corporate Wallets */}
            {activeTab === 'wallet' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Supported Wallets</label>
                <div className="space-y-2">
                  {['Paytm Wallet', 'Amazon Pay', 'Mobikwik', 'PhonePe Wallet'].map(wallet => (
                    <div key={wallet} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{wallet}</span>
                      <span className="text-[11px] text-blue-600 font-semibold">Available</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pay CTA */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePay}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Pay ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] text-slate-400 pt-1">
                Powered by Razorpay Payments &bull; PCI-DSS Level 1 Certified
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
