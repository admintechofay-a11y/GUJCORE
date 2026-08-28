'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import SupportersSection from '@/components/SupportersSection';
import SponsorshipSection from '@/components/SponsorshipSection';
import Footer from '@/components/Footer';

export default function SupportersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />
      <PageHeader
        badge="Industry Trust &amp; Legacy"
        title="Our Past"
        highlightedTitle="Supporters &amp; Exhibitors"
        description="A legacy of collaboration with India's foremost PSUs, EPC contractors, coating manufacturers, and testing laboratories."
        breadcrumbs={[{ label: 'Past Supporters' }]}
      />
      <SupportersSection onOpenSponsor={() => router.push('/sponsorship')} />
      <SponsorshipSection onContactClick={() => router.push('/contact')} />
      <Footer />
    </div>
  );
}
