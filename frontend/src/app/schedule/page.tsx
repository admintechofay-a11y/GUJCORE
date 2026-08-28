'use client';

import React from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import ConferenceSchedule from '@/components/ConferenceSchedule';
import Footer from '@/components/Footer';
import { Calendar, Download, Printer, Clock, MapPin, Users } from 'lucide-react';

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />

      <PageHeader
        badge="Technical Programme Matrix"
        title="3-Day Multi-Hall"
        highlightedTitle="Conference Schedule"
        description="Comprehensive daily breakdown across 14 technical symposia, plenary keynotes, student poster sessions, and grand valedictory awards (18–20 Feb 2027, Vadodara)."
        breadcrumbs={[{ label: 'Schedule' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-1">
            <Calendar className="w-5 h-5 text-red-600 mx-auto" />
            <div className="text-xl font-extrabold text-slate-900">3 Days</div>
            <div className="text-xs text-slate-500 font-medium">18–20 February 2027</div>
          </div>

          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-1">
            <MapPin className="w-5 h-5 text-teal-700 mx-auto" />
            <div className="text-xl font-extrabold text-slate-900">4 Parallel Halls</div>
            <div className="text-xs text-slate-500 font-medium">Sarabhai Campus, Vadodara</div>
          </div>

          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-1">
            <Users className="w-5 h-5 text-amber-600 mx-auto" />
            <div className="text-xl font-extrabold text-slate-900">14 Symposia</div>
            <div className="text-xs text-slate-500 font-medium">120+ Research Papers</div>
          </div>

          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-1">
            <Clock className="w-5 h-5 text-purple-600 mx-auto" />
            <div className="text-xl font-extrabold text-slate-900">50+ Keynotes</div>
            <div className="text-xs text-slate-500 font-medium">Industrial & Academic Faculty</div>
          </div>
        </div>

        {/* Interactive Schedule Component */}
        <ConferenceSchedule />

      </div>

      <Footer />
    </div>
  );
}
