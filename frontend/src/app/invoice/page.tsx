'use client';

import React, { useState } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import ProformaInvoiceModal from '@/components/ProformaInvoiceModal';
import { 
  FileText, 
  Printer, 
  Building2, 
  CheckCircle2, 
  Download, 
  CreditCard,
  Building,
  ArrowRight
} from 'lucide-react';
import { CONFERENCE_INFO, REGISTRATION_TIERS } from '@/data/mockData';

export default function InvoicePage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />

      <PageHeader
        badge="Financial & Tax Compliance"
        title="Proforma Invoice &"
        highlightedTitle="Tax Receipt Generator"
        description="Generate official computer-stamped Proforma Invoices with 15-digit GSTIN, SAC Code 998397, and NEFT remittance banking details for PSU and corporate purchase orders."
        breadcrumbs={[{ label: 'Proforma Invoice' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Corporate &amp; PSU Invoicing Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Click below to launch the interactive invoice editor to configure billing particulars, company GSTIN, and download an official formatted PDF.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Open Official Invoice / Proforma Document
          </button>
        </div>

        {/* Invoice Generator Modal */}
        <ProformaInvoiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

      </div>

      <Footer />
    </div>
  );
}
