'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { PAST_SUPPORTERS } from '../data/mockData';

interface SupportersSectionProps {
  onOpenSponsor?: () => void;
}

export default function SupportersSection({ onOpenSponsor }: SupportersSectionProps) {
  return (
    <section id="supporters" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-block bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Industrial Trust &amp; Legacy
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Past <span className="text-red-600">Supporters &amp; Exhibitors</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Leading PSUs, multinationals, engineering giants, and specialized testing labs that have trusted and partnered with AMPP Gujarat and IIM Baroda.
          </p>
        </div>

        {/* 21 Supporters Grid with Authentic Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-14">
          {PAST_SUPPORTERS.map((sup, idx) => (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-white p-5 rounded-3xl border border-slate-200 hover:border-red-300 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center text-center group min-h-[150px]"
            >
              {/* Badge Emblem / Logo */}
              <div className="w-16 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-slate-800 shadow-2xs group-hover:scale-105 group-hover:border-red-400 group-hover:text-red-600 transition-all mb-3 p-1.5 overflow-hidden">
                {sup.logo ? (
                  <img
                    src={sup.logo}
                    alt={sup.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="leading-tight tracking-tight text-[11px] font-black">{sup.tag}</span>
                )}
              </div>

              <h4 className="font-extrabold text-slate-900 text-xs leading-snug line-clamp-2">
                {sup.name}
              </h4>
              <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 font-medium">
                {sup.category}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Partnership Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Join Leading Industry Innovators
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Partner with GUJCORR 2027 as an Official Sponsor
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Packages starting from ₹50,000 to ₹5,00,000 with complimentary delegate passes, souvenir advertisements, and VIP exhibition presence.
            </p>
          </div>

          <Link
            href="/sponsorship"
            className="shrink-0 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            Explore Sponsorship Tiers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
