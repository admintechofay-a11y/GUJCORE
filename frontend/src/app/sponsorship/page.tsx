'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import SponsorshipSection from '@/components/SponsorshipSection';
import SupportersSection from '@/components/SupportersSection';
import Footer from '@/components/Footer';

export default function SponsorshipPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />
      <PageHeader
        badge="Corporate Partnerships"
        title="Sponsorship Packages &amp;"
        highlightedTitle="Souvenir Advertising"
        description="Maximize your organization's brand visibility, network with 500+ decision-makers, and feature in the official conference souvenir handbook."
        breadcrumbs={[{ label: 'Sponsorship & Advertising' }]}
      />
      <SponsorshipSection onContactClick={() => router.push('/contact')} />
      <SupportersSection onOpenSponsor={() => window.scrollTo({ top: 400, behavior: 'smooth' })} />
      <Footer />
    </div>
  );
}
