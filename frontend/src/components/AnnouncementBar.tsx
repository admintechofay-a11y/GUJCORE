'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Calendar, ArrowRight } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <aside aria-label="Conference announcements" className="bg-gradient-to-r from-red-700 via-rose-700 to-teal-800 text-white text-[11px] sm:text-xs py-2 px-3 sm:px-4 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left Ticker Text */}
        <div className="flex items-center gap-2 truncate">
          <span className="flex items-center justify-center p-1 bg-white/20 rounded-full animate-pulse shrink-0">
            <Bell className="w-3 h-3 text-amber-300" />
          </span>
          <div className="font-medium tracking-wide flex items-center gap-1.5 truncate">
            <span className="bg-amber-400 text-gray-950 font-extrabold px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider shrink-0">
              Alert
            </span>
            <span className="truncate">
              <strong>Abstracts Due:</strong> 30th Sept 2026 &nbsp;|&nbsp; 
              <span className="hidden sm:inline"> <strong>Conference:</strong> 18–20 Feb 2027, Vadodara</span>
            </span>
          </div>
        </div>

        {/* Right CTA Link */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden xl:inline text-[11px] text-rose-100 items-center gap-1">
            Organized by AMPP Gujarat &amp; IIM Baroda
          </span>
          <Link
            href="/registration"
            className="bg-white text-red-700 hover:bg-amber-300 hover:text-gray-950 font-extrabold text-[10px] sm:text-xs px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full transition-all duration-200 shadow-sm flex items-center gap-1 cursor-pointer shrink-0"
          >
            Register <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </Link>
        </div>

      </div>
    </aside>
  );
}
