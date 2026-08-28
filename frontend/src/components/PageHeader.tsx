'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface PageHeaderProps {
  badge: string;
  title: string;
  highlightedTitle?: string;
  description: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function PageHeader({
  badge,
  title,
  highlightedTitle,
  description,
  breadcrumbs = []
}: PageHeaderProps) {
  return (
    <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200 py-12 md:py-16 overflow-hidden subtle-grid-bg">
      {/* Decorative radial blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-red-100/50 via-rose-50/30 to-teal-100/40 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/" className="hover:text-red-600 flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-red-600 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-800 font-bold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Badge & Title */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-block bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
            {badge}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {title} {highlightedTitle && <span className="text-red-600">{highlightedTitle}</span>}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
