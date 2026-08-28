'use client';

import React from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import { 
  MapPin, 
  Building2, 
  Plane, 
  Train, 
  Car, 
  Hotel, 
  Compass, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ExternalLink,
  Sparkles,
  Calendar
} from 'lucide-react';
import { CONFERENCE_INFO } from '@/data/mockData';

interface HotelPartner {
  name: string;
  category: string;
  distance: string;
  tariff: string;
  promoCode: string;
  amenities: string[];
  contact: string;
  bookingUrl: string;
}

const PARTNER_HOTELS: HotelPartner[] = [
  {
    name: 'Welcomhotel by ITC Hotels, Alkapuri',
    category: '5-Star Luxury Partner',
    distance: '3.2 km from Conference Venue',
    tariff: 'Special Tariff: ₹5,500 + Tax / Night',
    promoCode: 'GUJCORR27',
    amenities: ['Buffet Breakfast Included', 'Complimentary Venue Shuttle', 'High-Speed Wi-Fi', 'Fitness Center & Pool'],
    contact: '+91 265 233 0033',
    bookingUrl: 'https://www.itchotels.com'
  },
  {
    name: 'Sayaji Hotel Vadodara, Bhimnath Bridge',
    category: '5-Star Business Partner',
    distance: '2.5 km from Conference Venue',
    tariff: 'Special Tariff: ₹4,500 + Tax / Night',
    promoCode: 'GUJCORR27',
    amenities: ['24hr Airport Transfer', 'Complimentary Breakfast', 'Executive Lounge', 'Fine Dining Restaurants'],
    contact: '+91 265 224 3888',
    bookingUrl: 'https://sayajihotels.com'
  },
  {
    name: 'Grand Mercure Vadodara Surya Palace',
    category: '4-Star Premium Partner',
    distance: '1.8 km from Conference Venue',
    tariff: 'Special Tariff: ₹4,200 + Tax / Night',
    promoCode: 'GUJCORR27',
    amenities: ['Close to Railway Station', 'Complimentary Breakfast', 'Business Center', 'Free Airport Drop'],
    contact: '+91 265 236 3366',
    bookingUrl: 'https://all.accor.com'
  },
  {
    name: 'The Fern Residency, Central Vadodara',
    category: 'Eco-Friendly 4-Star Hotel',
    distance: '2.0 km from Conference Venue',
    tariff: 'Special Tariff: ₹3,500 + Tax / Night',
    promoCode: 'GUJCORR27',
    amenities: ['Complimentary Breakfast', 'Eco-Certified Operations', 'Free Wi-Fi', '24/7 Travel Desk'],
    contact: '+91 265 712 3000',
    bookingUrl: 'https://www.fernhotels.com'
  }
];

export default function VenuePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <AnnouncementBar />
      <Navbar />

      <PageHeader
        badge="Vadodara, Gujarat &bull; 18–20 Feb 2027"
        title="Conference Venue &amp;"
        highlightedTitle="Travel Portal"
        description="Comprehensive travel guide, official partner hotels with exclusive delegate discount codes, and cultural tour excursions in the cultural capital of Gujarat."
        breadcrumbs={[{ label: 'Venue & Travel' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* 1. Official Venue Spotlight Card */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-red-600 text-white px-3 py-1 rounded">
                Official Host Venue
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {CONFERENCE_INFO.venue}
              </h2>
              <div className="text-sm font-bold text-amber-400">
                Sarabhai Convention Center &amp; Technology Arena
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                A world-class conference destination equipped with state-of-the-art acoustic auditoriums, technical breakout halls, and expansive exhibition space located in the vibrant hub of Vadodara.
              </p>
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{CONFERENCE_INFO.venueAddress}</span>
                </div>
                <div className="text-slate-400 pl-5">Near Kalabhavan / Faculty of Technology &amp; Engg</div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-3 text-xs">
              <h3 className="font-extrabold text-white text-base">Key Connectivity</h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl">
                  <span className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-sky-400" /> Vadodara Airport (BDQ)
                  </span>
                  <strong className="text-white">6.5 km (15 mins)</strong>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl">
                  <span className="flex items-center gap-2">
                    <Train className="w-4 h-4 text-emerald-400" /> Vadodara Junction (BRC)
                  </span>
                  <strong className="text-white">1.8 km (5 mins)</strong>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl">
                  <span className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-amber-400" /> Ahmedabad Int&apos;l (AMD)
                  </span>
                  <strong className="text-white">110 km (Expressway 1.5h)</strong>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 2. Partner Hotels with Exclusive Promo Codes */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full inline-block">
              Accommodation Partnerships
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Official Partner <span className="text-red-600">Hotels &amp; Tariffs</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Use conference promo code <strong className="text-red-600 font-mono">GUJCORR27</strong> during reservation to avail exclusive discounted rates and shuttle access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PARTNER_HOTELS.map((hotel, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded">
                      {hotel.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">{hotel.distance}</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900">{hotel.name}</h3>
                  <div className="text-xs font-black text-red-600 mt-1">{hotel.tariff}</div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 my-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">Conference Promo Code:</span>
                    <span className="text-xs font-mono font-black text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-300">
                      {hotel.promoCode}
                    </span>
                  </div>

                  <div className="space-y-1 pt-1">
                    {hotel.amenities.map((am, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{am}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Desk: <strong>{hotel.contact}</strong></span>
                  <a
                    href={hotel.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
                  >
                    Book Hotel <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Cultural Excursions */}
        <section className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full inline-block">
              Delegate Excursions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Explore Heritage &amp; World-Class Wonders
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Special guided post-conference tours arranged for delegates and accompanying guests (21st February 2027).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded">
                World&apos;s Tallest Statue
              </span>
              <h3 className="font-extrabold text-slate-900 text-lg">Statue of Unity (Ekta Nagar)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standing at 182 meters on the Narmada River (90 km from Vadodara), dedicated to Sardar Vallabhbhai Patel. Includes viewing gallery at 153m and laser light show.
              </p>
              <div className="text-xs font-bold text-teal-800">
                1-Day Delegate Express Coach Available
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <span className="text-[10px] font-extrabold uppercase bg-red-50 text-red-700 px-2.5 py-0.5 rounded">
                Royal Gaekwad Heritage
              </span>
              <h3 className="font-extrabold text-slate-900 text-lg">Laxmi Vilas Palace</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Four times the size of Buckingham Palace, built in Indo-Saracenic architectural splendor in 1890 with Venetian mosaic tile work and Belgian stained glass.
              </p>
              <div className="text-xs font-bold text-teal-800">
                Located 4 km from Conference Venue
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <span className="text-[10px] font-extrabold uppercase bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded">
                UNESCO World Heritage Site
              </span>
              <h3 className="font-extrabold text-slate-900 text-lg">Champaner-Pavagadh</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                8th to 14th-century historical citadel with intricate sandstone mosques, stepwells, and the revered Kalika Mata hilltop temple reachable by ropeway.
              </p>
              <div className="text-xs font-bold text-teal-800">
                Located 45 km from Vadodara
              </div>
            </div>

          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}
