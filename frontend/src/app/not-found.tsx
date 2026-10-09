'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Home, ArrowLeft, FileText, Phone } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-4 py-20 text-center my-auto space-y-6">
        <div className="inline-flex p-4 bg-red-600/20 border border-red-500/30 rounded-2xl text-red-400">
          <Shield className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-red-400 text-sm font-extrabold uppercase tracking-widest font-mono">
            Error 404 &bull; Page Not Found
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Lost in the Pipeline?
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base">
            The page you are looking for doesn&apos;t exist or has been relocated to another section of the GUJCORR 2027 conference portal.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
          >
            <Home className="w-4 h-4" /> Return to Home
          </Link>
          <Link
            href="/technical-sessions"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all"
          >
            <FileText className="w-4 h-4" /> 14 Technical Sessions
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all"
          >
            <Phone className="w-4 h-4" /> Contact Secretariat
          </Link>
        </div>
      </div>

      <div className="py-6 text-center text-xs text-slate-500 border-t border-slate-800">
        GUJCORR 2027 &bull; AMPP Gujarat Global Conference &amp; Expo on Corrosion &bull; Vadodara, Gujarat
      </div>
    </div>
  );
}
