'use client';

import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  Building2, 
  CheckCircle2, 
  FileText, 
  X, 
  Calendar,
  CreditCard,
  Building,
  Lock,
  Sparkles
} from 'lucide-react';
import { CONFERENCE_INFO, REGISTRATION_TIERS } from '../data/mockData';
import RazorpayModal, { RazorpayPaymentResult } from './RazorpayModal';

interface ProformaInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    companyName?: string;
    contactName?: string;
    email?: string;
    gstin?: string;
    tierName?: string;
    quantity?: number;
    amount?: number;
  };
}

export default function ProformaInvoiceModal({ isOpen, onClose, initialData }: ProformaInvoiceModalProps) {
  const [invoiceType, setInvoiceType] = useState<'PROFORMA INVOICE' | 'TAX INVOICE' | 'REGISTRATION RECEIPT'>('PROFORMA INVOICE');
  const [companyName, setCompanyName] = useState(initialData?.companyName || 'Larsen & Toubro Ltd');
  const [contactName, setContactName] = useState(initialData?.contactName || 'Dr. Rajesh Sharma');
  const [address, setAddress] = useState('Knowledge City, NH-8, Vadodara, Gujarat 390019');
  const [gstin, setGstin] = useState(initialData?.gstin || '24AAACL0140P1ZT');
  const [tierId, setTierId] = useState('tier-non-member');
  const [quantity, setQuantity] = useState(initialData?.quantity || 1);
  const [invoiceNumber] = useState(`GUJCORR-PI-${Math.floor(10000 + Math.random() * 90000)}`);
  const [invoiceDate] = useState(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
  
  // Payment Status & Razorpay State
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [razorpayTxnId, setRazorpayTxnId] = useState('');

  if (!isOpen) return null;

  const selectedTier = REGISTRATION_TIERS.find(t => t.id === tierId) || REGISTRATION_TIERS[1];
  const unitBasePrice = selectedTier.basePrice;
  const totalBasePrice = unitBasePrice * quantity;
  const cgst = totalBasePrice * 0.09;
  const sgst = totalBasePrice * 0.09;
  const totalAmount = totalBasePrice + cgst + sgst;

  const handlePrint = () => {
    window.print();
  };

  const handleRazorpaySuccess = (result: RazorpayPaymentResult) => {
    setIsRazorpayOpen(false);
    setIsPaid(true);
    setInvoiceType('TAX INVOICE');
    setRazorpayTxnId(result.razorpay_payment_id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 space-y-6 relative max-h-[92vh] overflow-y-auto">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            {(['PROFORMA INVOICE', 'TAX INVOICE', 'REGISTRATION RECEIPT'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setInvoiceType(type)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                  invoiceType === type
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {!isPaid ? (
              <button
                type="button"
                onClick={() => setIsRazorpayOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CreditCard className="w-3.5 h-3.5" /> Pay via Razorpay
              </button>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PAID (Razorpay)
              </span>
            )}

            <button
              onClick={handlePrint}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE DOCUMENT */}
        <div className="p-6 sm:p-8 border-2 border-slate-200 rounded-2xl space-y-6 bg-white text-slate-900 print:border-none print:p-0 relative">
          
          {/* Paid Stamp watermark */}
          {isPaid && (
            <div className="absolute top-1/3 right-12 transform rotate-[-20deg] border-4 border-emerald-600 text-emerald-600 px-6 py-2 rounded-2xl font-black text-2xl tracking-widest opacity-80 pointer-events-none select-none">
              PAID ONLINE
              <div className="text-[10px] font-mono tracking-normal">{razorpayTxnId}</div>
            </div>
          )}

          {/* 1. Header with Organizers & Document Title */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                GUJCORR 2027
              </div>
              <div className="text-xs font-bold text-red-600 uppercase tracking-wider">
                International Conference on Corrosion Science &amp; Engineering
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                Jointly organized by <strong>AMPP Gujarat Chapter</strong> &amp; <strong>Indian Institute of Metals (IIM) Baroda</strong>
              </div>
              <div className="text-[10px] text-slate-500">
                Department of Metallurgical &amp; Materials Engineering, The M.S. University of Baroda, Vadodara, Gujarat 390001
              </div>
            </div>

            <div className="text-right sm:shrink-0">
              <span className={`text-sm sm:text-base font-black uppercase tracking-wider px-3 py-1 rounded inline-block ${
                isPaid ? 'bg-emerald-700 text-white' : 'bg-slate-900 text-white'
              }`}>
                {invoiceType}
              </span>
              <div className="text-xs font-mono font-bold text-slate-800 mt-2">
                Doc Ref: {invoiceNumber}
              </div>
              <div className="text-xs text-slate-500">
                Date: <strong>{invoiceDate}</strong>
              </div>
              {isPaid && (
                <div className="text-[10px] text-emerald-700 font-mono font-bold mt-1">
                  Razorpay Txn: {razorpayTxnId}
                </div>
              )}
            </div>
          </div>

          {/* 2. Issuer & Bill-To Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-extrabold uppercase text-[10.5px] text-slate-500 tracking-wider">
                Issuer / Remittance Details:
              </div>
              <div className="font-extrabold text-slate-900">The Indian Institute of Metals (IIM) Baroda Chapter</div>
              <div className="text-slate-600">A/C: GUJCORR 2027 Conference Account</div>
              <div className="text-slate-600">PAN: <strong className="font-mono">AAATI1234F</strong></div>
              <div className="text-slate-600">GSTIN: <strong className="font-mono">24AAATI1234F1Z8</strong> (Gujarat, Code: 24)</div>
              <div className="text-slate-600">SAC Code: <strong className="font-mono">998397</strong> (Technical Scientific Conferences)</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-extrabold uppercase text-[10.5px] text-slate-500 tracking-wider">
                Bill To / Corporate Delegate:
              </div>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="font-extrabold text-slate-900 bg-transparent border-b border-dashed border-slate-300 w-full focus:outline-none"
                placeholder="Company / Legal Entity Name"
              />
              <div className="text-slate-600">Attn: 
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="font-bold text-slate-800 bg-transparent border-b border-dashed border-slate-300 ml-1 focus:outline-none"
                  placeholder="Delegate Name"
                />
              </div>
              <div className="text-slate-600">GSTIN: 
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="font-mono font-bold text-slate-800 bg-transparent border-b border-dashed border-slate-300 ml-1 uppercase focus:outline-none"
                  placeholder="Recipient GSTIN (Optional)"
                />
              </div>
              <div className="text-slate-500 text-[11px] pt-1">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-transparent border-b border-dashed border-slate-300 w-full text-slate-600 focus:outline-none"
                  placeholder="Billing Postal Address"
                />
              </div>
            </div>
          </div>

          {/* 3. Itemized Tariff Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold">
                  <th className="p-3">#</th>
                  <th className="p-3">Description &amp; Symposium Access</th>
                  <th className="p-3">SAC</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Rate (INR)</th>
                  <th className="p-3 text-right">Taxable Amt (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-bold">1</td>
                  <td className="p-3">
                    <div className="font-extrabold text-slate-900">
                      GUJCORR 2027 Conference Delegate Pass ({selectedTier.name})
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Full access to 14 Technical Symposia, ISBN Proceedings, Delegate Kit, Lunches &amp; Gala Banquet (18–20 Feb 2027).
                    </div>
                  </td>
                  <td className="p-3 font-mono text-slate-600">998397</td>
                  <td className="p-3 text-center font-bold">
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 text-center bg-slate-100 rounded border border-slate-200 p-0.5"
                    />
                  </td>
                  <td className="p-3 text-right font-mono font-bold">₹{unitBasePrice.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-mono font-bold">₹{totalBasePrice.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. Tax Calculation Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-slate-300">
            
            {/* Bank Remittance Instructions */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:w-1/2 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 block">
                Direct NEFT / RTGS Remittance Bank Details:
              </span>
              <div className="text-[11px] text-slate-700">Bank: <strong>{CONFERENCE_INFO.bankDetails.bankName}, Dandia Bazar</strong></div>
              <div className="text-[11px] text-slate-700">Account: <strong>{CONFERENCE_INFO.bankDetails.accountName}</strong></div>
              <div className="text-[11px] text-slate-700 font-mono">A/C No: <strong>{CONFERENCE_INFO.bankDetails.accountNumber}</strong></div>
              <div className="text-[11px] text-slate-700 font-mono">IFSC: <strong>{CONFERENCE_INFO.bankDetails.ifscCode}</strong> &bull; MICR: <strong>{CONFERENCE_INFO.bankDetails.micrCode}</strong></div>
            </div>

            {/* Subtotals & Grand Total */}
            <div className="sm:w-1/2 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Total Base Value:</span>
                <span className="font-mono font-bold">₹{totalBasePrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Central GST (CGST @ 9%):</span>
                <span className="font-mono">₹{cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>State GST (SGST @ 9%):</span>
                <span className="font-mono">₹{sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t-2 border-slate-900">
                <span>Grand Total Payable (INR):</span>
                <span className="text-red-600 font-mono text-lg">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">
                (Amount in words: Indian Rupees {Math.round(totalAmount).toLocaleString('en-IN')} Only)
              </span>
            </div>

          </div>

          {/* 5. Authorized Signatory & Digital Conference Stamp */}
          <div className="flex items-end justify-between pt-8 border-t border-slate-200 text-xs">
            <div className="text-slate-500 text-[10.5px] space-y-1">
              <div>* This is an official computer-generated proforma document.</div>
              <div>* Payments should be remitted within 30 days or prior to 15th December 2026.</div>
            </div>

            <div className="text-center space-y-1">
              <div className="font-serif italic font-bold text-slate-800 text-sm">
                Hiren Panchal
              </div>
              <div className="w-32 border-b border-slate-400 mx-auto"></div>
              <span className="text-[10px] font-extrabold uppercase text-slate-900 block">
                Conference Secretary &amp; Treasurer
              </span>
              <span className="text-[9.5px] text-slate-500 block">
                GUJCORR 2027 Secretariat &bull; IIM Baroda Chapter
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Razorpay Checkout Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        amount={totalAmount}
        description={`GUJCORR 2027 Invoice: ${invoiceNumber}`}
        prefill={{
          name: contactName,
          email: initialData?.email || 'delegate@company.com',
          contact: '+91 98765 43210'
        }}
        onSuccess={handleRazorpaySuccess}
        onFailure={(err) => alert(`Payment Failed: ${err.description}`)}
      />

    </div>
  );
}
