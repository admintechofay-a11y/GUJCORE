'use client';

import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Calendar, 
  MapPin, 
  Shield, 
  CheckCircle2, 
  FileText, 
  ExternalLink,
  Award,
  Phone,
  Mail
} from 'lucide-react';
import { CONFERENCE_INFO, IMPORTANT_DATES, REGISTRATION_TIERS, SPONSORSHIP_PACKAGES } from '../data/mockData';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BrochureModal({ isOpen, onClose }: BrochureModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200 my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Brochure Header */}
        <div className="border-b border-slate-200 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/ampp/Logo.png"
                alt="AMPP Gujarat"
                className="h-12 w-auto object-contain"
                onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
              />
              <div>
                <span className="bg-red-100 text-red-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Official Conference Prospectus
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  GUJ<span className="text-red-600">CORR</span> 2027
                </h2>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  AMPP Gujarat Global Conference &amp; Expo on Corrosion
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>

        {/* Brochure Core Highlights */}
        <div className="space-y-6 text-slate-700 text-xs sm:text-sm">
          
          {/* Key Dates & Venue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Conference Dates</div>
                <div className="text-slate-600 font-medium">18th – 20th February 2027</div>
                <div className="text-[11px] text-slate-500">Abstracts Deadline: 30th September 2026</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Host City &amp; Venue</div>
                <div className="text-slate-600 font-medium">Courtyard by Marriott Vadodara / Convention Hub</div>
                <div className="text-[11px] text-slate-500">Sarabhai Campus, Near Genda Circle, Vadodara – 390023</div>
              </div>
            </div>
          </div>

          {/* Theme & Objective */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Conference Objective &amp; Theme</h3>
            <p className="leading-relaxed bg-red-50 p-4 rounded-xl border border-red-200 text-red-950 font-medium italic">
              &ldquo;Stronger Together: Uniting the Global Fight Against Corrosion&rdquo;
            </p>
            <p className="mt-3 leading-relaxed text-slate-600">
              Corrosion causes estimated global economic losses exceeding US$2.5 trillion (3.4% of global GDP). GUJCORR 2027 unites global researchers, chemical/petrochemical asset owners, EPC contractors, and materials innovators to share cutting-edge corrosion control, protective coatings, cathodic protection, and AI-powered predictive integrity methods to reduce losses by up to 50%.
            </p>
          </div>

          {/* 14 Symposia Summary */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-2">14 Specialized Technical Symposia</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                'SYM-01: Corrosion & Inhibitors',
                'SYM-02: Microbiologically Influenced Corrosion (MIC)',
                'SYM-03: Concrete Structures & Infrastructure',
                'SYM-04: Corrosion Under Insulation (CUI)',
                'SYM-05: Oil, Gas, Petrochemical & Refinery',
                'SYM-06: Ships, Offshore & Marine Assets',
                'SYM-07: Defence Sector & Power Plants',
                'SYM-08: Advanced Alloys & Superalloys',
                'SYM-09: Coatings, Linings & Cladding',
                'SYM-10: Cathodic & Anodic Protection',
                'SYM-11: Corrosion Sensors & Testing (EIS/LPR)',
                'SYM-12: Asset Integrity (RBI / API 580/581)',
                'SYM-13: Digitalization & AI Digital Twins',
                'SYM-14: Emerging Technologies & CCUS'
              ].map((symp, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200/70">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">{symp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delegate Registration Tariffs */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Delegate Registration Fee (Inclusive of 18% GST)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              {REGISTRATION_TIERS.map((tier) => (
                <div key={tier.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="font-bold text-xs text-slate-800 line-clamp-1">{tier.name}</div>
                  <div className="text-xl font-extrabold text-red-600 mt-1">₹{tier.totalPrice.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-500">Base ₹{tier.basePrice} + 18% GST</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bank Details for NEFT/RTGS */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Official Bank Account for Remittance</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Bank &amp; Branch:</span>
                <strong className="text-slate-800">Union Bank of India, Dandia Bazar</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Account Name:</span>
                <strong className="text-slate-800">Indian Institute of Metals</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Account Number:</span>
                <strong className="text-slate-800 font-mono">520101234030441</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">IFSC &amp; MICR:</span>
                <strong className="text-slate-800 font-mono">UBIN0901555 / 390026037</strong>
              </div>
            </div>
          </div>

          {/* Secretariat Contact */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-600" />
              <span>Mr. Hiren Panchal (Secretary): <strong>+91 99888 81674</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-700" />
              <span><strong>iim.barodachapter@gmail.com</strong> / <strong>info@amppgujarat.org</strong></span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
          >
            Close Prospectus
          </button>
        </div>

      </div>
    </div>
  );
}
