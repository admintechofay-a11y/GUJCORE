'use client';

import React from 'react';
import { MapPin, Plane, Train, Car, Hotel, Building2, ExternalLink } from 'lucide-react';
import { CONFERENCE_INFO } from '../data/mockData';

export default function VenueSection() {
  return (
    <section id="venue" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-block bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Location &amp; Travel
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Conference Venue &amp; <span className="text-red-600">Vadodara Host City</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Vadodara, known as the &ldquo;Sanskari Nagari&rdquo; and industrial hub of Gujarat, home to India&apos;s leading refineries, petrochemical complexes, and academic institutions.
          </p>
        </div>

        {/* Venue Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: City Information & Travel Connectivity */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Vadodara, Gujarat, India</h3>
                  <p className="text-xs text-slate-500">18th – 20th February 2027</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Vadodara is strategically situated in western India, serving as the nucleus of Gujarat&apos;s massive engineering, chemical, pharmaceutical, and oil &amp; gas corridor (with mega plants of IOCL Gujarat Refinery, Reliance Industries, GSFC, and GACL nearby).
              </p>

              {/* Transit Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <Plane className="w-5 h-5 text-teal-700 mb-1" />
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">By Air</div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">
                    Vadodara Airport (BDQ) with direct flights from Mumbai, Delhi, Bangalore; or AMD (Ahmedabad) 90 mins away.
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <Train className="w-5 h-5 text-red-600 mb-1" />
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">By Rail</div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">
                    Vadodara Junction (BRC) on Western Railway main line. Vande Bharat, Tejas &amp; Rajdhani stops.
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <Car className="w-5 h-5 text-amber-600 mb-1" />
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">By Road</div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">
                    National Highway 48 &amp; National Expressway 1 (NE-1) connect directly to Ahmedabad, Surat, and Mumbai.
                  </div>
                </div>
              </div>
            </div>

            {/* Accommodation Assistance */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <Hotel className="w-6 h-6 text-purple-700" />
                <h4 className="font-extrabold text-slate-900 text-base">
                  Hotel Accommodation &amp; Delegate Assistance Desk
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Special negotiated rates are arranged with leading luxury and business hotels in Vadodara (including Grand Mercure, Vivanta Vadodara, Sayaji Hotel, and Welcomhotel).
              </p>
              <div className="text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                For accommodation inquiries &amp; room block reservation codes, contact: <strong className="text-red-700">iim.barodachapter@gmail.com</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Knowledge Partner & Location Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-5">
              <div className="inline-block bg-teal-100 text-teal-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Knowledge Partner
              </div>

              <h4 className="text-lg font-extrabold text-slate-900 leading-snug">
                The Maharaja Sayajirao University of Baroda
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                Department of Metallurgical &amp; Materials Engineering, Faculty of Technology &amp; Engineering, Kalabhavan Campus, Vadodara.
              </p>

              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl border border-slate-300 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <MapPin className="w-8 h-8 text-red-600" />
                <div className="font-extrabold text-slate-900 text-sm">Vadodara Convention Hub</div>
                <div className="text-xs text-slate-500">Vadodara, Gujarat 390001, India</div>
                <a
                  href="https://maps.google.com/?q=Vadodara,Gujarat,India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                >
                  Open in Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
