'use client';

import React from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import ContactSection from '@/components/ContactSection';
import CommitteeSection from '@/components/CommitteeSection';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />
      <PageHeader
        badge="Conference Secretariat"
        title="Contact"
        highlightedTitle="Secretariat"
        description="Get in touch with the GUJCORR 2027 organizing committee for registration queries, author assistance, booth reservations, or partnership inquiries."
        breadcrumbs={[{ label: 'Contact Us' }]}
      />
      <ContactSection />
      <CommitteeSection />
      <Footer />
    </div>
  );
}
