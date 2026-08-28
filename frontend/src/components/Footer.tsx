'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Phone, Mail, Globe, MapPin, ExternalLink, Calendar, QrCode, FileText, Award } from 'lucide-react';
import { CONFERENCE_INFO, IMPORTANT_DATES, REGISTRATION_TIERS } from '../data/mockData';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand & Theme */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight font-sans">
                  GUJ<span className="text-red-500">CORR</span> 2027
                </span>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  AMPP Gujarat Global Conference &amp; Expo
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              India&apos;s premier international conference and exhibition on corrosion science, asset integrity, advanced alloys, and protective coatings.
            </p>

            <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs text-slate-300 italic">
              &ldquo;Stronger Together: Uniting the Global Fight Against Corrosion&rdquo;
            </div>

            <div className="text-[11px] text-slate-400 space-y-0.5">
              <div><strong>Dates:</strong> 18th – 20th February 2027</div>
              <div><strong>Host City:</strong> Vadodara, Gujarat, India</div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/" className="hover:text-red-400 transition-colors">Home Overview</Link></li>
              <li><Link href="/about" className="hover:text-red-400 transition-colors">About GUJCORR</Link></li>
              <li><Link href="/schedule" className="hover:text-red-400 transition-colors font-bold text-red-400">3-Day Schedule</Link></li>
              <li><Link href="/symposia" className="hover:text-red-400 transition-colors">14 Symposia</Link></li>
              <li><Link href="/speakers" className="hover:text-red-400 transition-colors">Keynote Speakers</Link></li>
              <li><Link href="/call-for-papers" className="hover:text-red-400 transition-colors">Call for Papers</Link></li>
              <li><Link href="/registration" className="hover:text-red-400 transition-colors">Registration &amp; Passes</Link></li>
              <li><Link href="/exhibition" className="hover:text-red-400 transition-colors">Exhibition Floor Plan</Link></li>
              <li><Link href="/sponsorship" className="hover:text-red-400 transition-colors">Sponsorship Tiers</Link></li>
              <li><Link href="/awards" className="hover:text-red-400 transition-colors">Corrosion Awards</Link></li>
              <li><Link href="/invoice" className="hover:text-red-400 transition-colors">Proforma Invoices</Link></li>
              <li><Link href="/masterhome" className="hover:text-red-400 transition-colors">Master Home Portal</Link></li>
              <li><Link href="/venue" className="hover:text-red-400 transition-colors">Venue &amp; Partner Hotels</Link></li>
              <li><Link href="/contact" className="hover:text-red-400 transition-colors">Contact Secretariat</Link></li>
            </ul>
          </div>

          {/* Column 3: Tariff & Deadlines Summary */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-2">
                Registration Tariffs
              </h4>
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>IIM / AMPP Members:</span>
                  <strong className="text-white font-mono">₹4,720</strong>
                </div>
                <div className="flex justify-between">
                  <span>Non-Members:</span>
                  <strong className="text-white font-mono">₹7,670</strong>
                </div>
                <div className="flex justify-between">
                  <span>Full-time Students:</span>
                  <strong className="text-white font-mono">₹1,770</strong>
                </div>
                <span className="text-[10px] text-slate-500 block pt-0.5">*All tariffs inclusive of 18% GST</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-1.5">
                Key Deadlines
              </h4>
              <p className="text-xs text-red-400 font-bold">
                Abstracts Due: 30th Sept 2026
              </p>
              <p className="text-xs text-slate-400">
                Full Paper: 15th Oct 2026
              </p>
              <p className="text-xs text-slate-400">
                Event: 18th – 20th Feb 2027
              </p>
            </div>
          </div>

          {/* Column 4: Secretariat Contacts & Portals */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Secretariat Contact
            </h4>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <a href="tel:+919988881674" className="hover:text-white font-bold">
                  +91 99888 81674
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <a href="mailto:iim.barodachapter@gmail.com" className="hover:text-white">
                  iim.barodachapter@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <a href="mailto:coraxm2024@gmail.com" className="hover:text-white">
                  coraxm2024@gmail.com
                </a>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                <div>
                  <strong>AMPP Gujarat:</strong>{' '}
                  <a href="https://www.amppgujarat.org" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                    www.amppgujarat.org
                  </a>
                </div>
                <div>
                  <strong>IIM Baroda:</strong>{' '}
                  <a href="https://www.iimbaroda.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
                    www.iimbaroda.com
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2027 GUJCORR &bull; Jointly organized by AMPP Gujarat Chapter &amp; The Indian Institute of Metals Baroda Chapter.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Knowledge Partner: The M.S. University of Baroda</span>
            <span>&bull;</span>
            <span>SAC Code: 998397</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
