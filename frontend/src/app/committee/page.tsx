'use client';

import React from 'react';
import Link from 'next/link';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import CommitteeSection from '@/components/CommitteeSection';
import Footer from '@/components/Footer';
import { ArrowRight, Mail } from 'lucide-react';

export default function CommitteePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />
      <PageHeader
        badge="Organizing Framework"
        title="Organizing &amp; Executive"
        highlightedTitle="Committees"
        description="Meet the dedicated leaders, academic chairpersons, and industry consultants driving the mission of GUJCORR 2027."
        breadcrumbs={[{ label: 'Organizing Committee' }]}
      />
      <CommitteeSection />

      {/* Secretariat Contact Callout */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h3 className="text-2xl font-extrabold text-slate-900">
            Have questions for the Organizing Committee?
          </h3>
          <p className="text-sm text-slate-600">
            Reach out directly to Conference Secretary Mr. Hiren Panchal or email the IIM Baroda Chapter secretariat.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/contact"
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" /> Contact Committee
            </Link>
            <Link
              href="/about"
              className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-sm px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              About AMPP &amp; IIM <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
