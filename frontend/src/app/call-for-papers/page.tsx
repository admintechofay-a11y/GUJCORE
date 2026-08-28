'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import ConferenceFlowBar from '@/components/ConferenceFlowBar';
import PageHeader from '@/components/PageHeader';
import CallForPapers from '@/components/CallForPapers';
import ImportantDates from '@/components/ImportantDates';
import Footer from '@/components/Footer';

function CFPContent() {
  const searchParams = useSearchParams();
  const sympParam = searchParams.get('symp');
  const preselectedSymposiumId = sympParam ? parseInt(sympParam, 10) : undefined;

  return (
    <CallForPapers preselectedSymposiumId={preselectedSymposiumId} />
  );
}

export default function CallForPapersPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />
      <ConferenceFlowBar currentStep={3} />
      <PageHeader
        badge="Step 3 of 5: Paper & Poster Submission"
        title="Author Submission"
        highlightedTitle="Portal"
        description="Submit your structured 200–250 word research abstract across 14 technical symposia. Accepted peer-reviewed manuscripts will be featured in official conference proceedings."
        breadcrumbs={[{ label: 'Call for Papers' }]}
      />
      
      <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading submission portal...</div>}>
        <CFPContent />
      </Suspense>

      <ImportantDates
        onOpenCFP={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
        onOpenRegister={() => window.location.href = '/registration'}
      />
      <Footer />
    </div>
  );
}
