'use client';

import React from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import AboutSection from '@/components/AboutSection';
import CommitteeSection from '@/components/CommitteeSection';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />
      <PageHeader
        badge="About GUJCORR 2027"
        title="About the Conference &amp;"
        highlightedTitle="Organizing Bodies"
        description="Learn about the vision of GUJCORR 2027, the global framework of AMPP, the historic legacy of IIM Baroda Chapter, and our knowledge partner The Maharaja Sayajirao University of Baroda."
        breadcrumbs={[{ label: 'About Us' }]}
      />
      <AboutSection />
      <CommitteeSection />
      <Footer />
    </div>
  );
}
