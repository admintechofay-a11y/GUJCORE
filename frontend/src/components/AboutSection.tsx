'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Building2, 
  Flame, 
  Droplets, 
  Zap, 
  Ship, 
  Sparkles, 
  ExternalLink,
  Target,
  Compass,
  Quote,
  ArrowRight
} from 'lucide-react';
import { CONFERENCE_INFO } from '../data/mockData';

export default function AboutSection() {
  const sectors = [
    { name: 'Oil, Gas & Petrochemicals', icon: Flame, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { name: 'Refineries & Process Units', icon: Building2, color: 'text-red-600 bg-red-50 border-red-200' },
    { name: 'Power Generation (Thermal & Nuclear)', icon: Zap, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { name: 'Marine & Offshore Assets', icon: Ship, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { name: 'Infrastructure & Concrete Structures', icon: Building2, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { name: 'Defence Sector & Specialized Alloys', icon: Shield, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { name: 'Water & Wastewater Pipelines', icon: Droplets, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    { name: 'Renewable Energy & Green Hydrogen', icon: Sparkles, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
  ];

  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-block bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            About The Conference &amp; Chapter
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            AMPP Gujarat Global Conference &amp; Expo on Corrosion <span className="text-red-600">(GUJCORR 2027)</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            India&apos;s premier international technical forum dedicated to corrosion science, materials performance, protective coatings, and asset integrity.
          </p>
        </div>

        {/* Chairman's Message Highlight Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-4 text-center lg:text-left space-y-4">
              <div className="relative inline-block mx-auto lg:mx-0">
                <img
                  src={CONFERENCE_INFO.chairmansMessage.photo}
                  alt={CONFERENCE_INFO.chairmansMessage.chairName}
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover border-4 border-slate-700 shadow-xl mx-auto"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute -bottom-2 -right-2 bg-red-600 text-white p-2 rounded-xl shadow-md">
                  <Quote className="w-4 h-4" />
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {CONFERENCE_INFO.chairmansMessage.chairName}
                </h3>
                <p className="text-xs font-bold text-amber-400 mt-0.5">
                  {CONFERENCE_INFO.chairmansMessage.chairRole}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {CONFERENCE_INFO.chairmansMessage.chairAffiliation}
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed border-t lg:border-t-0 lg:border-l border-slate-700/80 pt-6 lg:pt-0 lg:pl-8">
              <div className="inline-block bg-red-600/30 text-red-300 font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider border border-red-500/30">
                Chairman&apos;s Welcome Address
              </div>
              
              <p className="italic font-medium text-slate-100 text-sm sm:text-base">
                &ldquo;{CONFERENCE_INFO.chairmansMessage.content[0]}&rdquo;
              </p>
              
              <p className="text-slate-300">
                {CONFERENCE_INFO.chairmansMessage.content[2]}
              </p>
              
              <p className="text-slate-300">
                {CONFERENCE_INFO.chairmansMessage.content[3]}
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-[11px] text-slate-400 font-medium">
                <span>&bull; Global Cost of Corrosion: <strong>$2.5 Trillion (3.4% GDP)</strong></span>
                <span>&bull; Potential Reduction via Proactive Management: <strong>Up to 50%</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Vision, Mission & Core Values Grid with SVGs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Vision Card */}
          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 hover:border-teal-300 transition-colors flex flex-col justify-between space-y-4 shadow-2xs">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded">
                Our Vision
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                Safe, Sustainable Infrastructure
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {CONFERENCE_INFO.vision}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[11px] font-semibold text-teal-700">
              AMPP Global Framework
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 hover:border-red-300 transition-colors flex flex-col justify-between space-y-4 shadow-2xs">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 bg-red-100 px-2.5 py-0.5 rounded">
                Our Mission
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                Protecting Society &amp; Assets
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {CONFERENCE_INFO.mission}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[11px] font-semibold text-red-600">
              Knowledge Sharing &amp; Innovation
            </div>
          </div>

          {/* Core Values / Focus Card */}
          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 hover:border-amber-300 transition-colors flex flex-col justify-between space-y-4 shadow-2xs">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded">
                Regional Hub
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                AMPP Gujarat Territory
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Serving the mega manufacturing, refinery, chemical, pipeline, and heavy engineering hubs across Gujarat, Rajasthan, and western Maharashtra.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[11px] font-semibold text-amber-800">
              Established Sept 19, 2024
            </div>
          </div>

        </div>

        {/* Overview & Focus Sectors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          <div className="lg:col-span-7 space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
            <p>
              Hosted in Gujarat, the industrial engine of India, <strong>GUJCORR 2027</strong> brings together leading scientists, researchers, corrosion engineers, asset owners, EPC contractors, and global technology innovators from academia, research institutions, and defense establishments worldwide.
            </p>
            <p>
              The conference provides a comprehensive technical platform for the dissemination and exchange of knowledge on corrosion mechanisms, materials degradation, failure analysis, corrosion monitoring, materials selection, protective coatings and linings, cathodic protection, inspection technologies, and integrity assessment.
            </p>
            <p>
              Through distinguished keynote lectures, 14 peer-reviewed technical symposia, industry case studies, panel debates, tutorials, and an expansive technology expo, GUJCORR 2027 advances the science and practice of corrosion control, optimizes life-cycle costs, and builds resilient, sustainable infrastructure worldwide.
            </p>
          </div>

          <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              Focus Industrial Sectors
            </h3>
            <p className="text-xs text-slate-500">
              Specialized symposia and real-world case studies across key national &amp; global manufacturing sectors:
            </p>
            <div className="grid grid-cols-1 gap-2.5 pt-2">
              {sectors.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                    <div className={`p-2 rounded-lg ${s.color} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{s.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
          
          {/* AMPP Global Card */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col justify-between space-y-4 hover:border-teal-300 transition-colors">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                Global Framework
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">AMPP Global</h3>
              <p className="text-xs font-semibold text-red-600 italic">
                &ldquo;A Safer, Protected, and Sustainable World&rdquo;
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Association for Materials Protection &amp; Performance represents the world&apos;s largest community of corrosion control and protective coating professionals, establishing global ISO/NACE/SSPC standards.
              </p>
            </div>
            <a
              href="https://www.ampp.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
            >
              Visit www.ampp.org <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* AMPP Gujarat Chapter Card */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col justify-between space-y-4 hover:border-red-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 bg-red-100 px-2 py-0.5 rounded">
                  Established Sept 19, 2024
                </span>
                <img
                  src="/images/ampp/Logo.png"
                  alt="AMPP Gujarat"
                  className="h-7 w-auto object-contain"
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">AMPP Gujarat Chapter</h3>
              <p className="text-xs font-semibold text-slate-700">
                Active Regional Hub for Corrosion Awareness
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated to promoting corrosion education, engineering standards, and training across Gujarat, Rajasthan, and Maharashtra with emphasis on heavy chemical, petrochemical, refinery, and pipeline hubs.
              </p>
            </div>
            <a
              href="https://www.amppgujarat.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-red-600 hover:text-red-800 inline-flex items-center gap-1"
            >
              Visit www.amppgujarat.org <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* IIM Baroda Chapter Card */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col justify-between space-y-4 hover:border-amber-300 transition-colors">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                Established 1971
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">IIM Baroda Chapter</h3>
              <p className="text-xs font-semibold text-slate-700">
                Indian Institute of Metals at MSU Baroda
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                One of IIM&apos;s oldest chapters, established at the Department of Metallurgical &amp; Materials Engineering, The M.S. University of Baroda, advancing metallurgical research and industrial standards.
              </p>
            </div>
            <a
              href="https://www.iimbaroda.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1"
            >
              Visit www.iimbaroda.com <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
