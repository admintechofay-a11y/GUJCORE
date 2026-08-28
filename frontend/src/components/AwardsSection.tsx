'use client';

import React from 'react';
import { Trophy, Award, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { AWARDS } from '../data/mockData';

interface AwardsSectionProps {
  onNominateClick: () => void;
}

export default function AwardsSection({ onNominateClick }: AwardsSectionProps) {
  return (
    <section id="awards" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-block bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Honors &amp; Recognition
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            GUJCORR 2027 <span className="text-red-600">Corrosion Excellence Awards</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Celebrating pioneering contributions, young scientific talent, industrial asset preservation milestones, and outstanding student research.
          </p>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {AWARDS.map((award, i) => (
            <div
              key={award.id}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Deadline: {award.deadline}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-3">
                  {award.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {award.description}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1">
                <div className="font-bold text-slate-900">Eligibility Criteria:</div>
                <div className="text-slate-600">{award.eligibility}</div>
              </div>

            </div>
          ))}
        </div>

        {/* Nomination Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
              Submit Award Nominations &amp; Self-Applications
            </h4>
            <p className="text-xs text-slate-500">
              Send nomination dossiers &amp; CVs directly to the Awards Committee: <strong className="text-slate-800">iim.barodachapter@gmail.com</strong>
            </p>
          </div>

          <button
            onClick={onNominateClick}
            className="shrink-0 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Inquire About Award Nominations
          </button>
        </div>

      </div>
    </section>
  );
}
