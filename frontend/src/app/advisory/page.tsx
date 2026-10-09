'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Users, Shield, ArrowRight, Award } from 'lucide-react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import { INTERNATIONAL_ADVISORY, CONFERENCE_INFO } from '@/data/conference';

export default function InternationalAdvisoryPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />

      <PageHeader
        badge="Global Oversight & Academic Vision"
        title="International"
        highlightedTitle="Advisory Committee"
        description="Distinguished academic dignitaries, global researchers, and industrial leaders providing international oversight for GUJCORR 2027."
        breadcrumbs={[{ label: 'Committee', href: '/committee' }, { label: 'International Advisory' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Chairman Card */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-black text-3xl shadow-2xl border-4 border-white/20 shrink-0">
              BB
            </div>

            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-200 bg-purple-800/60 border border-purple-400/40 px-3.5 py-1 rounded-full inline-block">
                {INTERNATIONAL_ADVISORY.chairman.role}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {INTERNATIONAL_ADVISORY.chairman.name}
              </h2>
              <p className="text-base sm:text-lg font-bold text-amber-300">
                {INTERNATIONAL_ADVISORY.chairman.designation}
              </p>
              <p className="text-sm text-purple-100 max-w-2xl leading-relaxed">
                {INTERNATIONAL_ADVISORY.chairman.org}
              </p>
            </div>
          </div>
        </div>

        {/* Advisory Members Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between pb-3 mb-8 border-b border-slate-200">
            <span className="text-xs font-extrabold uppercase tracking-widest text-purple-800 bg-purple-100 px-3.5 py-1 rounded-full">
              International Advisory Board Members ({INTERNATIONAL_ADVISORY.members.length})
            </span>
            <span className="text-xs text-slate-500 font-medium">Pan-National &bull; Global Leaders</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTERNATIONAL_ADVISORY.members.map((member, idx) => (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 font-mono font-bold text-xs flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    {member.country && (
                      <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                        <Globe className="w-3.5 h-3.5 text-purple-600" />
                        {member.country}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-purple-700 transition-colors leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-xs font-bold text-purple-700 mt-1">
                      {member.designation}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {member.org}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Advisory Board</span>
                  <span className="text-purple-700 font-bold">GUJCORR 2027</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Link & Organizing Committee CTA */}
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">
              Explore the National Organizing Committee
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Meet the 25+ leaders, engineers, and faculty steering the technical symposia and industrial expo.
            </p>
          </div>
          <Link
            href="/committee"
            className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
          >
            View Organizing Committee <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      <Footer />
    </div>
  );
}
