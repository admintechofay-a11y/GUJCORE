'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import TechnicalProgramme from '@/components/TechnicalProgramme';
import ImportantDates from '@/components/ImportantDates';
import Footer from '@/components/Footer';

export default function SymposiaPage() {
  const router = useRouter();

  const handleSelectSymposium = (sympId: number) => {
    router.push(`/call-for-papers?symp=${sympId}`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />
      <PageHeader
        badge="Technical Programme"
        title="14 Specialized"
        highlightedTitle="Technical Symposia"
        description="Comprehensive technical sessions covering fundamental corrosion science, oil & gas integrity, protective coatings, cathodic protection, and AI-driven asset management."
        breadcrumbs={[{ label: 'Technical Symposia' }]}
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
