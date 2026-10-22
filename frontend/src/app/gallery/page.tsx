'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  GALLERY_ITEMS, 
  GALLERY_CATEGORIES, 
  GalleryItem 
} from '@/data/gallery';
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ZoomIn, 
  Tag, 
  Calendar, 
  MapPin, 
  Shield, 
  Award, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    let list = GALLERY_ITEMS;

    if (selectedCategory !== 'all') {
      if (selectedCategory === 'technical') {
        list = list.filter(p => p.category === 'presentations' || p.category === 'academic' || p.category === 'technical');
      } else if (selectedCategory === 'cultural' || selectedCategory === 'networking') {
        list = list.filter(p => p.category === 'cultural' || p.category === 'committee');
      } else {
        list = list.filter(p => p.category === selectedCategory);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.event.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [selectedCategory, searchQuery]);

  // Current active photo in lightbox
  const activePhoto: GalleryItem | null = useMemo(() => {
    if (activePhotoIndex === null || activePhotoIndex < 0 || activePhotoIndex >= filteredPhotos.length) {
      return null;
    }
    return filteredPhotos[activePhotoIndex];
  }, [activePhotoIndex, filteredPhotos]);

  // Open lightbox at specific index
  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setImageLoading(true);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setActivePhotoIndex(null);
  }, []);

  const goToPrevious = useCallback(() => {
    if (activePhotoIndex === null) return;
    setImageLoading(true);
    setActivePhotoIndex((prev) => {
      if (prev === null) return 0;
      return prev === 0 ? filteredPhotos.length - 1 : prev - 1;
    });
  }, [activePhotoIndex, filteredPhotos.length]);

  const goToNext = useCallback(() => {
    if (activePhotoIndex === null) return;
    setImageLoading(true);
    setActivePhotoIndex((prev) => {
      if (prev === null) return 0;
      return prev === filteredPhotos.length - 1 ? 0 : prev + 1;
    });
  }, [activePhotoIndex, filteredPhotos.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, closeLightbox, goToPrevious, goToNext]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-500 selection:text-white">
      {/* 1. Announcement Ticker */}
      <AnnouncementBar />

      {/* 2. Navigation */}
      <Navbar />

      {/* 3. Hero Header Section */}
      <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-14 pb-16 sm:pb-20 overflow-hidden border-b border-slate-800">
        {/* Decorative background grid and glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Breadcrumbs */}
          <nav className="flex justify-center items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-red-400 font-semibold">Photo Gallery</span>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-wider uppercase mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Official Conference &amp; Symposia Archive
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
            Visual Highlights &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">Past Editions Archive</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Explore {GALLERY_ITEMS.length} archival photographs from our past international symposiums — capturing distinguished AMPP dignitaries, traditional lamp lighting ceremonies, souvenir releases, keynote addresses, and vibrant networking moments.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto pt-4 border-t border-slate-800/80">
            <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-white">{GALLERY_ITEMS.length}</div>
              <div className="text-[11px] text-slate-400 font-semibold">Archived Photographs</div>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">CORSYM</div>
              <div className="text-[11px] text-slate-400 font-semibold">2024 Research Symposia</div>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-teal-400">RSCCM</div>
              <div className="text-[11px] text-slate-400 font-semibold">2024 National Seminar</div>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-red-400">100%</div>
              <div className="text-[11px] text-slate-400 font-semibold">DSLR High-Res Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Filter & Search Controls */}
      <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {GALLERY_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-red-800/80 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input Box */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dignitary, keynote, event..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 placeholder-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 5. Main Gallery Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Active Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 pb-3 border-b border-slate-200">
          <div>
            Showing <strong className="text-slate-900 font-extrabold">{filteredPhotos.length}</strong> of {GALLERY_ITEMS.length} photographs
            {searchQuery && (
              <span> matching &ldquo;<span className="text-red-600 font-semibold">{searchQuery}</span>&rdquo;</span>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-medium">
            <span>Click any photo for interactive high-resolution viewer</span>
          </div>
        </div>

        {/* No Results Message */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No photographs found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              We couldn&apos;t find any photos matching &ldquo;{searchQuery}&rdquo;. Try another search term or reset your category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredPhotos.map((photo, index) => {
            const isPortrait = photo.orientation === 'portrait';
            return (
              <div
                key={photo.id}
                onClick={() => openLightbox(index)}
                className="group relative bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container */}
                <div className={`relative w-full overflow-hidden bg-slate-100 ${
                  isPortrait ? 'aspect-[3/4]' : 'aspect-[16/10]'
                }`}>
                  <Image
                    src={photo.thumbSrc}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                      {photo.categoryLabel}
                    </span>
                    {photo.featured && (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow-xs flex items-center gap-1">
                        ★ Highlight
                      </span>
                    )}
                  </div>

                  {/* Resolution & Index pill */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-950/70 backdrop-blur-md text-slate-300">
                    {photo.width} × {photo.height}
                  </div>
                </div>

                {/* Card Content Footer */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-red-600 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{photo.event}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-red-600 transition-colors">
                      {photo.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {photo.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex items-center gap-1 truncate max-w-[80%]">
                      <Tag className="w-3 h-3 shrink-0" />
                      <span className="truncate">{photo.tags.slice(0, 2).join(' • ')}</span>
                    </div>
                    <span className="text-slate-400 font-mono">#{photo.id.replace('photo-', '')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 6. Contextual Event Archives Note */}
        <section className="mt-16 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Legacy of Excellence: CORSYM &amp; RSCCM
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              These photographs capture the profound academic and industrial milestones achieved through the joint initiatives of <strong>AMPP India Chapter</strong>, <strong>The Maharaja Sayajirao University of Baroda</strong>, and the <strong>Indian Institute of Metals (IIM) Baroda Chapter</strong>. As we advance to <strong>GUJCORR 2027</strong>, we build upon this legacy to deliver an unprecedented 3-day global summit with 14 specialized symposia.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/registration"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Register for GUJCORR 2027</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/about"
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
              >
                Learn About Organizing Bodies
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Interactive Full-Screen Lightbox Modal */}
      {lightboxOpen && activePhoto && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          {/* Lightbox Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-900/90 border-b border-slate-800 text-white z-10">
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 rounded-lg bg-red-600/80 text-white text-xs font-mono font-black">
                {activePhotoIndex !== null ? activePhotoIndex + 1 : 1} / {filteredPhotos.length}
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-bold text-white truncate max-w-md block">{activePhoto.title}</span>
                <span className="text-[11px] text-slate-400">{activePhoto.event}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Direct Download of Raw/DSLR Original */}
              <a
                href={activePhoto.origSrc}
                download={activePhoto.filename}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                title={`Download original file (${activePhoto.originalSizeMb} MB)`}
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Download DSLR Original</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">({activePhoto.originalSizeMb}MB)</span>
              </a>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeLightbox}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-600 text-white transition-colors cursor-pointer"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Center Image Viewer */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
            {/* Previous Button */}
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md border border-slate-700 shadow-xl transition-all cursor-pointer active:scale-95"
              title="Previous photo (Left arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md border border-slate-700 shadow-xl transition-all cursor-pointer active:scale-95"
              title="Next photo (Right arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main High-Res Image */}
            <div className="relative max-w-full max-h-[75vh] sm:max-h-[80vh] flex items-center justify-center">
              <Image
                src={activePhoto.src}
                alt={activePhoto.title}
                width={activePhoto.width}
                height={activePhoto.height}
                priority
                onLoad={() => setImageLoading(false)}
                className={`max-w-full max-h-[75vh] sm:max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
                  imageLoading ? 'opacity-40' : 'opacity-100'
                }`}
              />

              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Lightbox Footer & Caption Info */}
          <div className="bg-slate-900/95 border-t border-slate-800 p-4 sm:px-6 sm:py-4 text-white z-10">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
                    {activePhoto.categoryLabel}
                  </span>
                  <span className="text-xs text-amber-400 font-bold">{activePhoto.event}</span>
                </div>
                <h4 className="font-black text-sm sm:text-base text-white">{activePhoto.title}</h4>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">{activePhoto.description}</p>
              </div>

              {/* Tags and Meta Details */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                {activePhoto.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-300 border border-slate-700">
                    #{tag}
                  </span>
                ))}
                <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 bg-slate-950 rounded">
                  {activePhoto.width}×{activePhoto.height} px
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Corporate Footer */}
      <Footer />
    </div>
  );
}
