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
  ArrowRight,
  CheckCircle2,
  Award,
  BookOpen,
  Users
} from 'lucide-react';
import { CONFERENCE_INFO } from '@/data/conference';

export default function AboutSection() {
  const focusSectors = [
    { name: 'Oil & Gas', icon: Flame, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { name: 'Petrochemicals & Refineries', icon: Building2, color: 'text-red-600 bg-red-50 border-red-200' },
    { name: 'Power Generation', icon: Zap, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { name: 'Chemical Processing', icon: Sparkles, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { name: 'Infrastructure & Concrete Assets', icon: Building2, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { name: 'Transportation & Railways', icon: Compass, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { name: 'Marine & Offshore Facilities', icon: Ship, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    { name: 'Defence Sector', icon: Shield, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { name: 'Water & Wastewater Systems', icon: Droplets, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { name: 'Renewable Energy & Clean Tech', icon: Sparkles, color: 'text-lime-600 bg-lime-50 border-lime-200' }
  ];

  const technicalPlatformItems = [
    "Corrosion Mechanisms & Electrochemistry",
    "Materials Degradation & Characterization",
    "Failure Analysis & Forensic Metallurgy",
    "Corrosion Monitoring & Autonomous Sensors",
    "Materials Selection & High-Performance Alloys",
    "Protective Coatings & Specialized Linings",
    "Cathodic & Anodic Protection Systems",
    "Inspection Technologies & Non-Destructive Testing (NDT)",
    "Asset Integrity Assessment & Lifecycle Modeling"
  ];

  const formatItems = [
    { title: "Keynote Lectures", desc: "Plenary addresses by global corrosion science luminaries." },
    { title: "Peer-Reviewed Presentations", desc: "Oral and poster technical sessions across 14 tracks." },
    { title: "Industry Case Studies", desc: "Real-world mitigation from refineries, pipelines & plants." },
    { title: "Expert Panel Debates", desc: "Interactive forums on sustainability, hydrogen & digital twins." },
    { title: "Tutorials & Workshops", desc: "Hands-on masterclasses and workforce training modules." },
    { title: "Technology Exhibition", desc: "Expo booths presenting cutting-edge equipment & coatings." }
  ];

  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-block bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            About The Conference &amp; Vision
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            AMPP Gujarat Global Conference &amp; Expo on Corrosion <span className="text-red-600">(GUJCORR 2027)</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {CONFERENCE_INFO.subtitle}
          </p>
        </div>

        {/* Chairman's Message Card */}
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
                {CONFERENCE_INFO.chairmansMessage.content[1]}
              </p>

              <p className="text-slate-300">
                {CONFERENCE_INFO.chairmansMessage.content[2]}
              </p>
              
              <p className="text-slate-300">
                {CONFERENCE_INFO.chairmansMessage.content[3]}
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-[11px] text-slate-400 font-medium">
                <span>&bull; Global Cost of Corrosion: <strong>US$ 2.5 Trillion (~3.4% GDP)</strong></span>
                <span>&bull; Potential Reduction via Integrity Management: <strong>Up to 50%</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Official About Overview Text */}
        <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200 mb-16 shadow-2xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full inline-block mb-3">
              Conference Scope &amp; Vision
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              India&apos;s Premier International Corrosion Conference &amp; Exhibition
            </h3>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {CONFERENCE_INFO.about.overview}
          </p>

          {/* Aim Box */}
          <div className="p-5 bg-white rounded-2xl border-l-4 border-red-600 shadow-2xs">
            <h4 className="font-extrabold text-slate-900 text-sm mb-1 uppercase tracking-wider">
              Conference Aim &amp; Global Mission
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              &ldquo;{CONFERENCE_INFO.about.aim}&rdquo;
            </p>
          </div>
        </div>

        {/* Technical Platform & Focus Sectors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          
          {/* Left: Technical Platform */}
          <div className="lg:col-span-6 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600" />
              Technical Platform Coverage
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              A comprehensive technical platform bridging fundamental science and field engineering:
            </p>
            <div className="grid grid-cols-1 gap-2 pt-2">
              {technicalPlatformItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Focus Industrial Sectors */}
          <div className="lg:col-span-6 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-700" />
              Focus Industrial Sectors
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Targeted discussions addressing challenges across critical global and national industries:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {focusSectors.map((sector, idx) => {
                const Icon = sector.icon;
                return (
                  <div key={idx} className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-900 shadow-2xs">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${sector.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{sector.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Conference Format Grid */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1 rounded-full">
              Multi-Track Format
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Interactive Conference Architecture
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Engineered to facilitate maximum knowledge transfer, networking, and industry-academia collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {formatItems.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs hover:border-red-300 hover:shadow-md transition-all space-y-2">
                <span className="text-xs font-black font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  0{idx + 1}
                </span>
                <h4 className="font-extrabold text-slate-900 text-base">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Organizers Detail Section */}
        <div className="bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-3 py-1 rounded-full inline-block mb-2">
              Institutional Heritage
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Meet the Organizers &amp; Partners
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONFERENCE_INFO.organizers.map((org, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {org.role}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                    {org.name}
                  </h4>
                  {org.established && (
                    <div className="text-[11px] font-semibold text-slate-500">
                      Established: {org.established}
                    </div>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {org.description}
                  </p>
                </div>

                {org.website && (
                  <div className="pt-2 border-t border-slate-100">
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                    >
                      Visit Website <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
