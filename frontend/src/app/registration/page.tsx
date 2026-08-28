'use client';

import React, { Suspense } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import ConferenceFlowBar from '@/components/ConferenceFlowBar';
import PageHeader from '@/components/PageHeader';
import DelegateRegistrationSection from '@/components/DelegateRegistration';
import VenueSection from '@/components/VenueSection';
import Footer from '@/components/Footer';

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans" suppressHydrationWarning>
      <AnnouncementBar />
      <Navbar />
      <ConferenceFlowBar currentStep={4} />
      <PageHeader
        badge="Step 4 of 5: Pass &amp; Payment"
        title="Official Conference Pass &amp;"
        highlightedTitle="Tariff"
        description="Select your registration category. All pass prices include 18% GST, access to all 14 technical sessions, technology exhibition, delegate kit, souvenir, and networking lunches in Vadodara."
        breadcrumbs={[{ label: 'Delegate Registration' }]}
      />
      <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading delegate portal...</div>}>
        <DelegateRegistrationSection />
      </Suspense>
      <VenueSection />
      <Footer />
    </div>
  );
}
