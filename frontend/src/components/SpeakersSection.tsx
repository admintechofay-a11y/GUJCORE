'use client';

import React, { useState } from 'react';
import { Award, User, Building, X, ExternalLink } from 'lucide-react';
import { SPEAKERS, getSpeakerPhoto } from '../data/mockData';
import { Speaker } from '../types';

export default function SpeakersSection() {
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  return (
    <section id="speakers" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-block bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Distinguished Faculty
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Keynote &amp; <span className="text-red-600">Invited Speakers</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            World-class researchers, industrial leaders, and forensic corrosion specialists delivering groundbreaking insights.
          </p>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SPEAKERS.map((spk) => {
            const photoUrl = getSpeakerPhoto(spk);

            return (
              <div
                key={spk.id}
                onClick={() => setSelectedSpeaker(spk)}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-lg hover:border-red-300 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Speaker Avatar / Real Photo */}
                  <div className="flex items-center justify-between mb-4">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={spk.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-sm group-hover:scale-105 transition-transform"
                        onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-2xl ${spk.color} flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform`}>
                        {spk.initials}
                      </div>
                    )}
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {spk.category}
                    </span>
                  </div>

                  {/* Speaker Name */}
                  <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-red-600 transition-colors leading-snug mb-1">
                    {spk.name}
                  </h3>

                  {/* Role / Committee */}
                  <p className="text-xs font-bold text-teal-700 mb-2">
                    {spk.role}
                  </p>

                  {/* Organization */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {spk.organization}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate max-w-[150px] font-medium text-slate-600">
                    {spk.symposium || 'Corrosion Science'}
                  </span>
                  <span className="text-red-600 font-bold group-hover:translate-x-0.5 transition-transform">
                    Bio →
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Speaker Bio Modal */}
        {selectedSpeaker && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-150">
              <button
                onClick={() => setSelectedSpeaker(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-5">
                {getSpeakerPhoto(selectedSpeaker) ? (
                  <img
                    src={getSpeakerPhoto(selectedSpeaker)!}
                    alt={selectedSpeaker.name}
                    className="w-18 h-18 rounded-2xl object-cover border-2 border-slate-200 shadow-md"
                  />
                ) : (
                  <div className={`w-16 h-16 rounded-2xl ${selectedSpeaker.color} flex items-center justify-center font-black text-xl shadow-md`}>
                    {selectedSpeaker.initials}
                  </div>
                )}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedSpeaker.category}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    {selectedSpeaker.name}
                  </h3>
                  <p className="text-xs font-bold text-teal-700">
                    {selectedSpeaker.role}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6 text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{selectedSpeaker.organization}</span>
                </div>
                {selectedSpeaker.designation && (
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-600">{selectedSpeaker.designation}</span>
                  </div>
                )}
                {selectedSpeaker.symposium && (
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-red-700">Featured Session: {selectedSpeaker.symposium}</span>
                  </div>
                )}
                <p className="text-xs text-slate-700 pt-2 border-t border-slate-200">
                  {selectedSpeaker.bio}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedSpeaker(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
