'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ImportantDates from '@/components/ImportantDates';
import SupportersSection from '@/components/SupportersSection';
import Footer from '@/components/Footer';
import { 
  ArrowRight, 
  FileText, 
  UserCheck, 
  Award, 
  Store, 
  CheckCircle2, 
  Shield, 
  QrCode, 
  Layers, 
  Users, 
  Quote,
  Building2,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  Camera,
  ZoomIn
} from 'lucide-react';
import Image from 'next/image';
import { CONFERENCE_INFO, SYMPOSIA, SPEAKERS, REGISTRATION_TIERS, getSpeakerPhoto } from '@/data/mockData';
import { getFeaturedGalleryItems } from '@/data/gallery';

export default function HomePage() {
  const router = useRouter();

  const featuredSymposia = SYMPOSIA.slice(0, 6);
  const featuredSpeakers = SPEAKERS.slice(0, 4);
  const featuredGallery = getFeaturedGalleryItems().slice(0, 6);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-500 selection:text-white">
      {/* 1. Announcement Ticker */}
      <AnnouncementBar />

      {/* 2. Multi-Page Header & Navigation */}
      <Navbar />

      {/* 3. Hero Section with Live Countdown & Metrics */}
      <Hero
        onOpenRegister={() => router.push('/registration')}
        onOpenCFP={() => router.push('/call-for-papers')}
        onOpenSponsor={() => router.push('/sponsorship')}
      />

      {/* 4. Quick Gateway Action Cards */}
      <section className="bg-slate-900 text-white py-6 sm:py-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
            <Link
              href="/call-for-papers"
              className="p-4 sm:p-5 bg-slate-800/90 hover:bg-teal-700 rounded-2xl border border-slate-700/80 transition-all duration-200 group flex flex-col items-center justify-center gap-2 shadow-xs active:scale-98"
            >
              <FileText className="w-6 h-6 text-amber-400 group-hover:text-white" />
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-white">Call for Papers</div>
                <div className="text-[11px] text-slate-400 group-hover:text-teal-100">Abstracts Due 11 Oct</div>
              </div>
            </Link>

            <Link
              href="/registration"
              className="p-4 sm:p-5 bg-slate-800/90 hover:bg-red-600 rounded-2xl border border-slate-700/80 transition-all duration-200 group flex flex-col items-center justify-center gap-2 shadow-xs active:scale-98"
            >
              <UserCheck className="w-6 h-6 text-emerald-400 group-hover:text-white" />
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-white">Delegate Passes</div>
                <div className="text-[11px] text-slate-400 group-hover:text-red-100">Member ₹4,720 / Non ₹7,670</div>
              </div>
            </Link>

            <Link
              href="/sponsorship"
              className="p-4 sm:p-5 bg-slate-800/90 hover:bg-purple-700 rounded-2xl border border-slate-700/80 transition-all duration-200 group flex flex-col items-center justify-center gap-2 shadow-xs active:scale-98"
            >
              <Award className="w-6 h-6 text-purple-400 group-hover:text-white" />
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-white">Sponsorship</div>
                <div className="text-[11px] text-slate-400 group-hover:text-purple-100">Diamond to Bronze Packages</div>
              </div>
            </Link>

            <Link
              href="/exhibition"
              className="p-4 sm:p-5 bg-slate-800/90 hover:bg-sky-700 rounded-2xl border border-slate-700/80 transition-all duration-200 group flex flex-col items-center justify-center gap-2 shadow-xs active:scale-98"
            >
              <Store className="w-6 h-6 text-sky-400 group-hover:text-white" />
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-white">Exhibition Stalls</div>
                <div className="text-[11px] text-slate-400 group-hover:text-sky-100">Interactive Floor Plan</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Streamlined About & Chairman's Message Gateway */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: About Summary */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full inline-block">
                About GUJCORR 2027
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Uniting Global Corrosion Science &amp; Industrial Asset Integrity
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Hosted in Vadodara, Gujarat — India&apos;s leading chemical, petrochemical, and heavy engineering hub — <strong>GUJCORR 2027</strong> is jointly organized by the <strong>AMPP Gujarat Chapter</strong> (est. 2024) and the historic <strong>IIM Baroda Chapter</strong> (est. 1971) with <strong>The M.S. University of Baroda</strong> as Knowledge Partner.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-900">US$ 2.5 Trillion</div>
                  <div className="text-[11px] text-slate-500">Global Corrosion Cost (~3.4% GDP)</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-900">Up to 50% Reduction</div>
                  <div className="text-[11px] text-slate-500">Through Proactive Integrity Management</div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-white bg-slate-900 hover:bg-slate-800 px-5 py-3 rounded-xl transition-colors"
                >
                  Read Full About &amp; Vision <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/committee"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-xl transition-colors"
                >
                  View Organizing Committee
                </Link>
              </div>
            </div>

            {/* Right: Chairman's Message Highlight Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden">
              <div className="flex items-start gap-4">
                <img
                  src={CONFERENCE_INFO.chairmansMessage.photo}
                  alt={CONFERENCE_INFO.chairmansMessage.chairName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-red-500 shadow-md shrink-0"
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded">
                    Chairman&apos;s Address
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                    {CONFERENCE_INFO.chairmansMessage.chairName}
                  </h3>
                  <p className="text-xs font-bold text-amber-400">
                    {CONFERENCE_INFO.chairmansMessage.chairRole}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 italic mt-4 leading-relaxed line-clamp-4">
                &ldquo;{CONFERENCE_INFO.chairmansMessage.content[0]} Our mission at the Gujarat Chapter is to promote the understanding and application of corrosion control techniques, protective coatings, and materials integrity across industries and academia.&rdquo;
              </p>

              <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">The M.S. University of Baroda</span>
                <Link href="/about" className="text-red-400 font-bold hover:underline">
                  Full Message →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Key Deadlines & Timeline */}
      <ImportantDates
        onOpenCFP={() => router.push('/call-for-papers')}
        onOpenRegister={() => router.push('/registration')}
      />

      {/* 7. Featured Symposia Preview Grid (6 of 14) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-block mb-2">
                Technical Tracks
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                14 Specialized <span className="text-red-600">Technical Symposia</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Featuring cutting-edge research across science, industrial plant reliability, and digital asset integrity.
              </p>
            </div>

            <Link
              href="/symposia"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-colors self-start md:self-auto"
            >
              Explore All 14 Symposia <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredSymposia.map((symp) => (
              <div
                key={symp.id}
                className="bg-slate-50 hover:bg-white rounded-3xl p-6 border border-slate-200 hover:border-red-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black font-mono text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      {symp.code}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {symp.category}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base mb-2 group-hover:text-red-600 transition-colors leading-snug">
                    {symp.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {symp.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <Link
                    href={`/call-for-papers?symp=${symp.id}`}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    Submit Paper <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href="/symposia"
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    View Scope
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. Keynote Faculty Preview */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full inline-block mb-2">
                Distinguished Faculty
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Keynote &amp; <span className="text-red-600">Invited Speakers</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Hear from leading academic pioneers and industrial failure investigation specialists.
              </p>
            </div>

            <Link
              href="/speakers"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-4 py-2.5 rounded-xl transition-colors self-start md:self-auto"
            >
              View All Speakers &amp; Bios <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSpeakers.map((spk) => {
              const photoUrl = getSpeakerPhoto(spk);

              return (
                <div
                  key={spk.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-lg hover:border-red-300 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={spk.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-sm group-hover:scale-105 transition-transform"
                          onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className={`w-16 h-16 rounded-2xl ${spk.color} flex items-center justify-center font-black text-lg shadow-sm`}>
                          {spk.initials}
                        </div>
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {spk.category}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-red-600 transition-colors mb-1">
                      {spk.name}
                    </h3>
                    <p className="text-xs font-bold text-teal-700 mb-1">
                      {spk.role}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {spk.organization}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium truncate max-w-[120px]">{spk.symposium}</span>
                    <Link href="/speakers" className="text-red-600 font-bold hover:underline">
                      Bio →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. Delegate Registration Passes & Tariffs Grid */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-block">
              Registration Tariffs (18% GST Inclusive)
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Official Conference <span className="text-red-600">Delegate Passes</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Includes 3-day access to 14 symposia, conference kits, proceedings, networking lunches, and exhibition entry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {REGISTRATION_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`bg-white rounded-3xl p-6 sm:p-8 border flex flex-col justify-between transition-all duration-200 shadow-2xs hover:shadow-lg ${
                  tier.popular ? 'border-2 border-red-500 relative' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    Most Popular Pass
                  </span>
                )}

                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-1">{tier.name}</h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">{tier.description}</p>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6 text-center">
                    <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">All-Inclusive Fee</span>
                    <div className="text-3xl font-black text-slate-900 mt-1">
                      ₹{tier.totalPrice.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ₹{tier.basePrice.toLocaleString('en-IN')} + 18% GST (₹{tier.gstAmount})
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    {tier.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/registration?tier=${tier.id}`}
                  className={`w-full text-center font-extrabold text-xs sm:text-sm py-3.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 ${
                    tier.popular ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Select &amp; Register Pass <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9.5. Visual Highlights & Photo Gallery Showcase */}
      <section className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
                <Camera className="w-3.5 h-3.5" />
                Archival Photo Gallery • Symposia Highlights
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Glimpses of <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">Past Symposia</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Reliving CORSYM 2024 and RSCCM 2024 — organized by AMPP India Chapter, The M.S. University of Baroda, and IIM Baroda Chapter.
              </p>
            </div>

            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-white bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-red-600/20 self-start md:self-auto shrink-0"
            >
              <span>Explore Photo Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGallery.map((photo) => (
              <Link
                key={photo.id}
                href="/gallery"
                className="group relative bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-md hover:border-slate-700 transition-all duration-300 flex flex-col"
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950">
                  <Image
                    src={photo.thumbSrc}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-400/30">
                      {photo.categoryLabel}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white/90 text-slate-900 flex items-center gap-1 shadow-sm">
                      <ZoomIn className="w-3 h-3" /> View
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-red-400 mb-1">
                      {photo.event}
                    </div>
                    <h3 className="font-extrabold text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {photo.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{photo.tags.slice(0, 2).join(' • ')}</span>
                    <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                      View in Gallery →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <span>Click to view the complete photo archive with high-resolution lightbox &amp; original DSLR downloads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Official Past Supporters Grid (with real logos from amppgujarat.org) */}
      <SupportersSection
        onOpenSponsor={() => router.push('/sponsorship')}
      />

      {/* 11. Quick Help & Secretariat Contact Banner */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl font-extrabold text-slate-900">
                Have Queries About Delegate Passes or Submissions?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Contact Conference Secretary Mr. Hiren Panchal (+91 99888 81674) or email <span className="font-semibold text-slate-800">iim.barodachapter@gmail.com</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="https://wa.me/919988881674?text=Hello%2C%20I%20am%20inquiring%20about%20GUJCORR%202027%20Conference."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp Us
              </a>
              <Link
                href="/contact"
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors"
              >
                Secretariat Desk →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Corporate Footer */}
      <Footer />
    </div>
  );
}
