'use client';

import React from 'react';
import { Users, Shield, Award, CheckCircle2 } from 'lucide-react';
import { COMMITTEE_MEMBERS } from '../data/mockData';

export default function CommitteeSection() {
  return (
    <section id="committee" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-block bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Leadership &amp; Committees
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Organizing <span className="text-red-600">Committee &amp; Board of Directors</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Steered by recognized authorities from AMPP Gujarat Chapter, Indian Institute of Metals Baroda Chapter, and leading industrial engineering enterprises.
          </p>
        </div>

        {/* Section 1: AMPP Gujarat Leadership (with Real Photos from amppgujarat.org) */}
        <div className="mb-16">
          <div className="flex items-center gap-2 pb-3 mb-8 border-b border-slate-200">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-700 bg-red-100 px-3.5 py-1 rounded-full">
              AMPP Gujarat Chapter Board of Directors
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMITTEE_MEMBERS.amppLeadership.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-2xs hover:border-red-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {m.photo ? (
                      <img
                        src={m.photo}
                        alt={m.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-xs group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                        {m.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                    )}
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base group-hover:text-red-600 transition-colors">
                        {m.name}
                      </h4>
                      <span className="text-xs font-bold text-red-600 block mt-0.5">
                        {m.role}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {m.org}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Executive Committee Grid */}
        <div className="mb-16">
          <div className="flex items-center gap-2 pb-3 mb-8 border-b border-slate-200">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800 bg-teal-100 px-3.5 py-1 rounded-full">
              Executive Committee Members (ECC)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {COMMITTEE_MEMBERS.executiveCommittee.map((m, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 hover:shadow-xs transition-all"
              >
                <h5 className="font-bold text-slate-900 text-sm leading-snug">{m.name}</h5>
                <span className="text-[11px] text-teal-700 font-bold block mt-1">{m.role}</span>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{m.org}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: IIM Baroda Chapter */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-8 border-b border-slate-200">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-900 bg-amber-100 px-3.5 py-1 rounded-full">
              Indian Institute of Metals (IIM) Baroda Chapter Leadership
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMITTEE_MEMBERS.iimLeadership.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-2xs hover:border-amber-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div className="flex items-center gap-4 mb-3">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
                      onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {m.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                  )}
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{m.name}</h4>
                    <span className="text-xs font-bold text-amber-700 block mt-0.5">{m.role}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {m.org}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
