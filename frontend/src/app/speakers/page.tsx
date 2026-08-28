'use client';

import React from 'react';
import Link from 'next/link';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import SpeakersSection from '@/components/SpeakersSection';
import Footer from '@/components/Footer';
import { ArrowRight, FileText } from 'lucide-react';

export default function SpeakersPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />
      <PageHeader
        badge="Distinguished Faculty"
        title="Keynote &amp; Invited"
        highlightedTitle="Speakers"
        description="Meet the world-class corrosion engineers, academic leaders from The M.S. University of Baroda, Linde Engineering, TCR Advanced, and international industry specialists."
        breadcrumbs={[{ label: 'Speakers & Faculty' }]}
      />
      <SpeakersSection />

      {/* Speaker Callout CTA */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h3 className="text-2xl font-extrabold text-slate-900">
            Interested in presenting your research alongside our keynote faculty?
          </h3>
          <p className="text-sm text-slate-600">
            Submit your abstract before 30th September 2026 to be considered for oral and poster presentation sessions.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/call-for-papers"
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> Submit Abstract Now
            </Link>
            <Link
              href="/symposia"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              Explore 14 Symposia <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
