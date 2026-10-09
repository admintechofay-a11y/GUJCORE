'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import TechnicalProgramme from '@/components/TechnicalProgramme';
import ImportantDates from '@/components/ImportantDates';
import Footer from '@/components/Footer';

export default function TechnicalSessionsPage() {
  const router = useRouter();

  const handleSelectSymposium = (sympId: number) => {
    router.push(`/call-for-papers?symp=${sympId}`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />
      <PageHeader
        badge="Official Technical Program"
        title="14 Specialized"
        highlightedTitle="Technical Sessions"
        description="Explore the 14 comprehensive technical sessions covering corrosion science, plant integrity, protective coatings, cathodic protection, and emerging AI technologies."
        breadcrumbs={[{ label: 'Technical Sessions' }]}
      />
      <TechnicalProgramme onSelectSymposiumForCFP={handleSelectSymposium} />
      <ImportantDates
        onOpenCFP={() => router.push('/call-for-papers')}
        onOpenRegister={() => router.push('/registration')}
      />
      <Footer />
    </div>
  );
}
