'use client';

import React, { useState } from 'react';
import { 
  Check, 
  Crown, 
  Sparkles, 
  Download, 
  FileText, 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { SPONSORSHIP_PACKAGES, ADVERTISEMENT_RATES, CONFERENCE_INFO } from '../data/mockData';

interface SponsorshipSectionProps {
  onContactClick: () => void;
}

export default function SponsorshipSection({ onContactClick }: SponsorshipSectionProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>('sponsor-diamond');
  const [inquirySent, setInquirySent] = useState(false);

  return (
    <section id="sponsorship" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-block bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Corporate Partnerships &amp; Branding
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Details for <span className="text-red-600">Sponsorship</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Showcase your brand in front of 500+ decision-makers, plant owners, EPC contractors, and corrosion engineers across India and globally.
          </p>
        </div>

        {/* 5 Sponsorship Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SPONSORSHIP_PACKAGES.map((pkg) => {
            const isSelected = selectedPackage === pkg.id;

            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`rounded-3xl p-8 border transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                  pkg.tier === 'Diamond'
                    ? 'bg-gradient-to-b from-purple-50/70 to-white border-purple-300 shadow-md hover:shadow-xl'
                    : pkg.popular
                    ? 'bg-gradient-to-b from-amber-50/70 to-white border-amber-400 shadow-md hover:shadow-xl'
                    : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
                    ⭐ Most Popular
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Tier Level
                    </span>
                    <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-sm">
                      {pkg.tier === 'Diamond' ? '💎' : pkg.tier === 'Gold' ? '🥇' : pkg.tier === 'Silver' ? '🥈' : pkg.tier === 'Bronze' ? '🥉' : '☕'}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                    {pkg.tier} Sponsor
                  </h3>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 my-4">
                    <div className="text-3xl font-black text-slate-900">{pkg.priceFormatted}</div>
                    <div className="text-xs text-slate-500 mt-1 font-semibold">+ 18% GST Extra</div>
                  </div>

                  {/* Included Benefits List */}
                  <div className="space-y-3 mb-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
                      Included Benefits:
                    </div>
                    {pkg.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onContactClick}
                  className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-red-600 text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  Book {pkg.tier} Sponsorship <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            );
          })}
        </div>

        {/* Advertisement in Souvenir Table */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-block bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                Print Publicity
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Advertisement for Sponsor / Souvenir Tariff
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Published in the official conference souvenir distributed to all delegates, VIPs, and industry libraries.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg block">
                18% GST Extra on all rates
              </span>
            </div>
          </div>

          {/* Rates Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Dimensions</th>
                  <th className="py-3 px-4 text-right">Rate (INR)</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-800">
                {ADVERTISEMENT_RATES.map((ad, index) => (
                  <tr key={index} className="hover:bg-white transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-500">{ad.type}</td>
                    <td className="py-4 px-4 font-extrabold text-slate-900">{ad.category}</td>
                    <td className="py-4 px-4 text-xs font-mono text-slate-600">{ad.dimensions}</td>
                    <td className="py-4 px-4 text-right font-black text-base text-red-600">{ad.rateFormatted}</td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={onContactClick}
                        className="text-xs font-bold text-slate-900 hover:text-red-600 bg-white border border-slate-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Reserve Space
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Advertisement Specs Box */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-700" />
              Technical Artwork Guidelines for Souvenir Publication:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li><strong>Bleed Advertisement:</strong> 8.23&quot; (w) × 11.75&quot; (h). Artwork should extend 0.25&quot; beyond cut marks on all sides.</li>
              <li><strong>Non-Bleed Advertisement:</strong> 7.25&quot; (w) × 10.15&quot; (h). Resolution: 300 DPI (minimum).</li>
              <li><strong>Format:</strong> High-resolution CDR, PDF, or EPS format (with fonts converted to curves/outlines).</li>
              <li><strong>Email Submissions:</strong> Send artwork files directly to <strong className="text-red-600">coraxm2024@gmail.com</strong> with your company reference.</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
