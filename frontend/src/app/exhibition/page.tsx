'use client';

import React from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import InteractiveFloorPlan from '@/components/InteractiveFloorPlan';
import SupportersSection from '@/components/SupportersSection';
import Footer from '@/components/Footer';
import { 
  Store, 
  CheckCircle2, 
  Download, 
  Users, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Building2, 
  Sparkles,
  Award
} from 'lucide-react';
import { CONFERENCE_INFO } from '@/data/mockData';

export default function ExhibitionPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />

      <PageHeader
        badge="Technology Exhibition & Trade Expo"
        title="Industrial"
        highlightedTitle="Exhibition & Floor Plan"
        description="Showcase your state-of-the-art corrosion mitigation products, cathodic protection equipment, testing instruments, and industrial protective coatings to 500+ decision makers (18–20 Feb 2027, Vadodara)."
        breadcrumbs={[{ label: 'Exhibition' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Exhibition Key Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
            <Store className="w-6 h-6 text-red-600" />
            <h4 className="font-extrabold text-slate-900 text-base">40+ Premium Stalls</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standard 9 sqm Octanorm shell schemes, 18 sqm corner booths, and 36 sqm 4-side open island pavilions.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
            <Users className="w-6 h-6 text-teal-700" />
            <h4 className="font-extrabold text-slate-900 text-base">500+ Targeted Buyers</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Chief Engineers, Asset Integrity Managers, and Procurement Heads from ONGC, IOCL, Reliance, L&T, and GAIL.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
            <Award className="w-6 h-6 text-amber-600" />
            <h4 className="font-extrabold text-slate-900 text-base">2 Free Passes per Stall</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every 9 sqm stall booking includes 2 complimentary full-conference delegate passes with 3-day lunch catering.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <h4 className="font-extrabold text-slate-900 text-base">Souvenir Book Directory</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Permanent corporate profile listing with product highlights in the printed GUJCORR 2027 souvenir volume.
            </p>
          </div>
        </div>

        {/* 2D Interactive Floor Plan & Stall Booking Engine */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-block">
              Live Stall Reservation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Interactive <span className="text-red-600">Exhibition Floor Plan</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select your preferred booth location on the Sarabhai Pavilion floor grid below to check availability and reserve online.
            </p>
          </div>

          <InteractiveFloorPlan />
        </section>

        {/* Stall Tariffs Comparison Table */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900">
              Exhibitor Packages &amp; Stall Tariffs (18% GST Inclusive)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              All stall bookings are eligible for 18% Input Tax Credit (ITC) with valid corporate GSTIN.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-3xl border border-slate-200 shadow-xs text-left text-xs">
              <thead className="bg-slate-900 text-white font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4 rounded-tl-3xl">Stall Category</th>
                  <th className="p-4">Dimensions / Area</th>
                  <th className="p-4">Base Fee</th>
                  <th className="p-4">18% GST</th>
                  <th className="p-4">Total Payable</th>
                  <th className="p-4">Complimentary Passes</th>
                  <th className="p-4 rounded-tr-3xl">Inclusions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">Standard Shell Scheme</td>
                  <td className="p-4 font-mono">3m × 3m (9 sqm)</td>
                  <td className="p-4 font-mono">₹95,000</td>
                  <td className="p-4 font-mono text-slate-500">₹17,100</td>
                  <td className="p-4 font-mono font-black text-slate-900">₹1,12,100</td>
                  <td className="p-4 font-bold text-teal-800">2 Delegate Passes</td>
                  <td className="p-4 text-slate-500">Fascia name, 1 table, 2 chairs, 3 lights, 5A plug</td>
                </tr>
                <tr className="hover:bg-slate-50 bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">Corner Stall (2-Side Open)</td>
                  <td className="p-4 font-mono">6m × 3m (18 sqm)</td>
                  <td className="p-4 font-mono">₹1,90,000</td>
                  <td className="p-4 font-mono text-slate-500">₹34,200</td>
                  <td className="p-4 font-mono font-black text-slate-900">₹2,24,200</td>
                  <td className="p-4 font-bold text-teal-800">3 Delegate Passes</td>
                  <td className="p-4 text-slate-500">Double fascia, 2 tables, 4 chairs, 4 lights, 2 plugs</td>
                </tr>
                <tr className="hover:bg-slate-50 bg-amber-50/30">
                  <td className="p-4 font-bold text-amber-900">★ Island Pavilion (4-Side Open)</td>
                  <td className="p-4 font-mono font-bold text-amber-900">6m × 6m (36 sqm)</td>
                  <td className="p-4 font-mono">₹3,50,000</td>
                  <td className="p-4 font-mono text-slate-500">₹63,000</td>
                  <td className="p-4 font-mono font-black text-amber-900">₹4,13,000</td>
                  <td className="p-4 font-bold text-amber-900">4 Delegate Passes</td>
                  <td className="p-4 text-slate-500">Custom fascia structure, 4 tables, 8 chairs, full page color ad</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">Table Top Display</td>
                  <td className="p-4 font-mono">2m × 3m (6 sqm)</td>
                  <td className="p-4 font-mono">₹55,000</td>
                  <td className="p-4 font-mono text-slate-500">₹9,900</td>
                  <td className="p-4 font-mono font-black text-slate-900">₹64,900</td>
                  <td className="p-4 font-bold text-teal-800">1 Delegate Pass</td>
                  <td className="p-4 text-slate-500">1 draped table, 2 chairs, 1 power socket</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Corporate Past Supporters */}
        <SupportersSection />

      </div>

      <Footer />
    </div>
  );
}
