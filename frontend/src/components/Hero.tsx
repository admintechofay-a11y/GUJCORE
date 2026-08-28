'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Award, Users, BookOpen, Clock, Download, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { CONFERENCE_INFO } from '../data/mockData';
import BrochureModal from './BrochureModal';

interface HeroProps {
  onOpenRegister: () => void;
  onOpenCFP: () => void;
  onOpenSponsor: () => void;
}

export default function Hero({ onOpenRegister, onOpenCFP, onOpenSponsor }: HeroProps) {
  const [brochureOpen, setBrochureOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date(CONFERENCE_INFO.startDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section id="home" className="relative pt-6 pb-14 sm:pt-10 sm:pb-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200 overflow-hidden subtle-grid-bg">
        {/* Background Decorative Rings */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-red-100/40 via-rose-50/20 to-teal-100/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Main Headline & Information */}
            <div className="lg:col-span-7 space-y-5 text-left">
              
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                <span>AMPP Gujarat Global Conference &amp; Expo</span>
              </div>

              {/* Main Title Banner */}
              <div className="space-y-1.5">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  GUJ<span className="text-red-600">CORR</span> <span className="text-slate-800">2027</span>
                </h1>
                <p className="text-lg sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug">
                  India&apos;s Premier Corrosion Conference &amp; Expo in Gujarat
                </p>
              </div>

              {/* Conference Theme Quote */}
              <div className="p-3.5 sm:p-4 bg-slate-900 text-white rounded-2xl border-l-4 border-red-500 shadow-md">
                <p className="text-xs sm:text-sm md:text-base font-semibold italic text-slate-100">
                  &ldquo;Stronger Together: Uniting the Global Fight Against Corrosion&rdquo;
                </p>
              </div>

              {/* Metadata Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Conference Dates</div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">18th – 20th February 2027</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Host City &amp; Venue</div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">Vadodara, Gujarat, India</div>
                  </div>
                </div>
              </div>

              {/* Interactive Working CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  Register Pass (₹4,720) <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onOpenCFP}
                  className="w-full sm:w-auto bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Submit Abstract
                </button>
                <button
                  type="button"
                  onClick={onOpenSponsor}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm px-5 py-3.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-amber-600" /> Sponsorship
                </button>
              </div>

              {/* Organizing Entities Footer Note */}
              <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600 font-medium">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Organizers:</span>
                <span className="bg-slate-100 px-2.5 py-0.5 rounded-md text-slate-800 font-semibold border border-slate-200 text-xs">
                  AMPP Gujarat Chapter
                </span>
                <span className="text-slate-400">×</span>
                <span className="bg-slate-100 px-2.5 py-0.5 rounded-md text-slate-800 font-semibold border border-slate-200 text-xs">
                  IIM Baroda Chapter
                </span>
                <span className="text-slate-400">×</span>
                <span className="text-teal-800 font-bold text-xs">
                  Knowledge Partner: The M.S. University of Baroda
                </span>
              </div>
            </div>

            {/* Right Column: Live Countdown Box & Key Metrics */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Live Countdown Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-red-100/40 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-red-600" />
                    <span className="font-extrabold text-slate-900 text-sm">Conference Countdown</span>
                  </div>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                    18–20 Feb 2027
                  </span>
                </div>

                {/* Countdown Ticker Grid */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3 my-5 text-center">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 sm:p-3 shadow-2xs">
                    <div className="text-xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Days</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 sm:p-3 shadow-2xs">
                    <div className="text-xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Hours</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 sm:p-3 shadow-2xs">
                    <div className="text-xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Mins</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 sm:p-3 shadow-2xs">
                    <div className="text-xl sm:text-3xl font-extrabold text-red-600 font-mono">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Secs</div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 text-center font-medium bg-slate-50 py-2.5 rounded-xl border border-slate-100">
                  Vadodara &bull; Grand Inauguration 09:00 AM IST
                </div>
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-black text-slate-900">500+</div>
                    <div className="text-[11px] font-semibold text-slate-500">Global Delegates</div>
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0 font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-black text-slate-900">14</div>
                    <div className="text-[11px] font-semibold text-slate-500">Symposia Sessions</div>
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-black text-slate-900">3 Days</div>
                    <div className="text-[11px] font-semibold text-slate-500">Expo &amp; Sessions</div>
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-black text-slate-900">50+</div>
                    <div className="text-[11px] font-semibold text-slate-500">Invited Faculty</div>
                  </div>
                </div>
              </div>

              {/* Working Brochure Download / View trigger */}
              <div className="p-3.5 bg-gradient-to-r from-slate-100 to-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-700">
                <span className="font-semibold truncate max-w-[200px] sm:max-w-none">
                  Official Conference Brochure &amp; Tariff
                </span>
                <button
                  type="button"
                  onClick={() => setBrochureOpen(true)}
                  className="font-extrabold text-red-600 hover:text-red-700 flex items-center gap-1.5 cursor-pointer bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" /> View Brochure
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Brochure Modal Component */}
      <BrochureModal
        isOpen={brochureOpen}
        onClose={() => setBrochureOpen(false)}
      />
    </>
  );
}
