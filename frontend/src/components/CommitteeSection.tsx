'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Shield, Award, CheckCircle2, Globe, ArrowRight } from 'lucide-react';
import { ORGANIZING_COMMITTEE, INTERNATIONAL_ADVISORY, getSpeakerPhoto } from '@/data/conference';

export default function CommitteeSection() {
  return (
    <section id="committee" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-block bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Leadership &amp; Governance
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Organizing <span className="text-red-600">Committee</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Steered by recognized leaders from AMPP Gujarat Chapter, The M.S. University of Baroda, The Indian Institute of Metals (IIM) Baroda Chapter, and leading engineering industries.
          </p>
        </div>

        {/* 1. Core Executive Leadership Grid (Chairman, Co-Chairman, Convener, Co-Convener) */}
        <div className="mb-16">
          <div className="flex items-center justify-between pb-3 mb-8 border-b border-slate-200">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-700 bg-red-100 px-3.5 py-1 rounded-full">
              Executive Leadership
            </span>
            <span className="text-xs text-slate-500 font-medium">GUJCORR 2027 Secretariat</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ORGANIZING_COMMITTEE.leadership.map((leader, idx) => (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:border-red-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {leader.photo ? (
                      <img
                        src={leader.photo}
                        alt={leader.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-xs group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white flex items-center justify-center font-black text-lg shadow-xs">
                        {leader.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-700 inline-block mb-1">
                        {leader.role}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base group-hover:text-red-600 transition-colors leading-snug">
                        {leader.name}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-teal-800">
                    {leader.designation}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {leader.org}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Organizing Committee Members (25 Members from Official Brochure) */}
        <div className="mb-20">
          <div className="flex items-center justify-between pb-3 mb-8 border-b border-slate-200">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800 bg-teal-100 px-3.5 py-1 rounded-full">
              Organizing Committee Members ({ORGANIZING_COMMITTEE.members.length})
            </span>
            <span className="text-xs text-slate-500 font-medium">Academia &bull; Industry &bull; Research</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ORGANIZING_COMMITTEE.members.map((member, idx) => {
              const photo = member.photo || getSpeakerPhoto(member);

              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                        Member
                      </span>
                    </div>

                    <div className="flex items-start gap-3 mb-2">
                      {photo && (
                        <img
                          src={photo}
                          alt={member.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                          onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                        />
                      )}
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm leading-snug">
                          {member.name}
                        </h5>
                        {member.designation && (
                          <span className="text-[11px] text-teal-700 font-semibold block mt-0.5">
                            {member.designation}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {member.org}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. International Advisory Section */}
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-700 bg-purple-100 px-3.5 py-1 rounded-full inline-block mb-2">
                Global Advisory Board
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                International Advisory
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Eminent international authorities providing strategic vision and academic oversight for GUJCORR 2027.
              </p>
            </div>

            <Link
              href="/advisory"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl transition-colors self-start md:self-auto"
            >
              Dedicated Advisory Page <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* International Advisory Chairman Highlight */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-200 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                BB
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {INTERNATIONAL_ADVISORY.chairman.role}
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                  {INTERNATIONAL_ADVISORY.chairman.name}
                </h4>
                <p className="text-xs font-bold text-slate-600">
                  {INTERNATIONAL_ADVISORY.chairman.designation}, {INTERNATIONAL_ADVISORY.chairman.org}
                </p>
              </div>
            </div>
          </div>

          {/* International Advisory Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INTERNATIONAL_ADVISORY.members.map((adv, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-300 hover:shadow-xs transition-all space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                      Advisory Member
                    </span>
                    {adv.country && (
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-slate-400" />
                        {adv.country}
                      </span>
                    )}
                  </div>

                  <h5 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {adv.name}
                  </h5>

                  <p className="text-xs text-purple-800 font-semibold mt-1">
                    {adv.designation}
                  </p>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {adv.org}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
