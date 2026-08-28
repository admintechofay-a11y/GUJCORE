'use client';

import React from 'react';
import { Printer, Download, X, Award, ShieldCheck, QrCode } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  role: string;
  paperTitle?: string;
  credentialId: string;
}

export default function CertificateModal({ isOpen, onClose, recipientName, role, paperTitle, credentialId }: CertificateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 space-y-6 relative max-h-[92vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Official Conference Certificate</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
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

        {/* PRINTABLE GOLD-BORDERED CERTIFICATE */}
        <div className="p-8 sm:p-12 border-8 border-double border-amber-500/80 rounded-2xl space-y-6 bg-gradient-to-b from-amber-50/20 via-white to-amber-50/20 text-center relative overflow-hidden print:border-8 print:p-8">
          
          <div className="space-y-1 font-serif">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              GUJCORR 2027
            </h2>
            <p className="text-xs uppercase tracking-widest text-red-600 font-sans font-bold">
              International Conference on Corrosion Science &amp; Engineering
            </p>
            <p className="text-[10px] text-slate-500 font-sans">
              Organized by AMPP Gujarat Chapter &amp; The Indian Institute of Metals (IIM) Baroda Chapter
            </p>
          </div>

          <div className="py-2">
            <span className="text-lg sm:text-xl font-bold italic text-slate-700 font-serif">
              Certificate of Presentation &amp; Participation
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-500 font-sans">This is to proudly certify that</p>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif border-b-2 border-slate-300 pb-2 max-w-md mx-auto">
              {recipientName}
            </div>
            <p className="text-xs text-slate-600 font-sans pt-1">
              has actively participated as a distinguished <strong className="text-red-700">{role}</strong> and presented the peer-reviewed research work:
            </p>
          </div>

          {paperTitle && (
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-xs italic font-serif text-slate-800 max-w-lg mx-auto shadow-2xs">
              &ldquo;{paperTitle}&rdquo;
            </div>
          )}

          <p className="text-[11px] text-slate-500 font-sans max-w-lg mx-auto">
            held at Sarabhai Campus, The M.S. University of Baroda, Vadodara, Gujarat from 18th to 20th February 2027.
          </p>

          {/* Signatures & Seal */}
          <div className="flex items-end justify-between pt-8 border-t border-amber-200 text-xs font-sans">
            <div className="text-center space-y-1">
              <div className="font-serif italic font-bold text-slate-800 text-sm">Dr. Sunil Kahar</div>
              <div className="w-28 border-b border-slate-400 mx-auto"></div>
              <span className="text-[9.5px] font-bold text-slate-700 block">Chairman, AMPP Gujarat</span>
            </div>

            {/* Gold Seal Emblem */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 border-amber-600 bg-amber-100 flex items-center justify-center mx-auto text-amber-800 font-black text-xs shadow-xs">
                OFFICIAL<br/>SEAL
              </div>
              <span className="text-[9px] font-mono text-slate-400 block mt-1">ID: {credentialId}</span>
            </div>

            <div className="text-center space-y-1">
              <div className="font-serif italic font-bold text-slate-800 text-sm">Hiren Panchal</div>
              <div className="w-28 border-b border-slate-400 mx-auto"></div>
              <span className="text-[9.5px] font-bold text-slate-700 block">Secretary, IIM Baroda</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
