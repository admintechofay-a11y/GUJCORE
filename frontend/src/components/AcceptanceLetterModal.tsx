'use client';

import React from 'react';
import { Printer, Download, X, CheckCircle2, Award, Calendar, MapPin } from 'lucide-react';
import { CONFERENCE_INFO } from '../data/mockData';

interface AcceptanceLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperData: {
    id: string;
    paperTitle: string;
    authorName: string;
    organization?: string;
    symposiumTitle: string;
    presentationType: 'Oral' | 'Poster';
  };
}

export default function AcceptanceLetterModal({ isOpen, onClose, paperData }: AcceptanceLetterModalProps) {
  if (!isOpen) return null;

  const letterDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 space-y-6 relative max-h-[92vh] overflow-y-auto">
        
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            Official Technical Acceptance Endorsement
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF Letter
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL LETTERHEAD */}
        <div className="p-8 sm:p-12 border-2 border-slate-200 rounded-2xl space-y-8 bg-white text-slate-900 font-serif print:border-none print:p-0">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b-2 border-slate-900 font-sans">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                GUJCORR 2027
              </h2>
              <div className="text-xs font-bold text-red-600 uppercase tracking-wider">
                International Conference on Corrosion Science &amp; Engineering
              </div>
              <div className="text-[11px] text-slate-600">
                Organized by <strong>AMPP Gujarat Chapter</strong> &amp; <strong>IIM Baroda Chapter</strong>
              </div>
              <div className="text-[10px] text-slate-500">
                The M.S. University of Baroda, Vadodara, Gujarat 390001, India
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-[10px] font-mono text-slate-400 block">Ref Code:</span>
              <strong className="font-mono text-slate-900 text-sm">GUJCORR/2027/ACC/{paperData.id}</strong>
              <div className="text-slate-500 text-[11px] mt-1">Date: {letterDate}</div>
            </div>
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-800 font-sans">
            <div>
              <p className="font-bold text-slate-900">To,</p>
              <p className="font-extrabold text-base text-slate-900">{paperData.authorName}</p>
              <p className="text-slate-600">{paperData.organization || 'Research Scholar / Corrosion Engineer'}</p>
            </div>

            <div className="py-2">
              <p className="font-extrabold text-slate-900 text-sm">
                Subject: <span className="text-red-700">Official Acceptance Letter for Research Presentation at GUJCORR 2027</span>
              </p>
            </div>

            <p>Dear {paperData.authorName},</p>

            <p>
              On behalf of the Technical Programme Review Committee of <strong>GUJCORR 2027</strong>, we are pleased to inform you that your research paper titled:
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 my-3">
              <div className="text-sm sm:text-base font-extrabold text-slate-900 italic">
                &ldquo;{paperData.paperTitle}&rdquo;
              </div>
              <div className="text-xs text-teal-800 font-bold mt-2">
                Paper ID: <span className="font-mono text-slate-900">{paperData.id}</span> &bull; Track: {paperData.symposiumTitle} &bull; Mode: <strong>{paperData.presentationType} Presentation</strong>
              </div>
            </div>

            <p>
              has been rigorously peer-reviewed by our editorial panel and formally <strong>ACCEPTED</strong> for presentation during the <strong>GUJCORR 2027 International Conference</strong> to be held in Vadodara, Gujarat from <strong>18th to 20th February 2027</strong>.
            </p>

            <p>
              Your paper has been scheduled for inclusion in the official Conference Proceedings (ISBN registered). Please submit your final camera-ready manuscript and presentation slides through your author dashboard prior to <strong>15th November 2026</strong>.
            </p>

            <p>
              We look forward to welcoming you to the cultural capital of Gujarat for an inspiring technical exchange.
            </p>
          </div>

          {/* Signatures */}
          <div className="flex items-end justify-between pt-12 border-t border-slate-200 font-sans text-xs">
            <div className="text-center space-y-1">
              <div className="font-serif italic font-bold text-slate-900 text-base">Dr. Sunil Kahar</div>
              <div className="w-40 border-b border-slate-400 mx-auto"></div>
              <div className="text-[10px] font-extrabold uppercase text-slate-900">Prof. (Dr.) Sunil Kahar</div>
              <div className="text-[9.5px] text-slate-500">Conference Chairman &bull; AMPP Gujarat</div>
            </div>

            <div className="text-center space-y-1">
              <div className="font-serif italic font-bold text-slate-900 text-base">Hiren Panchal</div>
              <div className="w-40 border-b border-slate-400 mx-auto"></div>
              <div className="text-[10px] font-extrabold uppercase text-slate-900">Mr. Hiren Panchal</div>
              <div className="text-[9.5px] text-slate-500">Conference Secretary &bull; IIM Baroda</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
