'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Layers, 
  FlaskConical, 
  Biohazard, 
  Building2, 
  Flame, 
  Fuel, 
  Ship, 
  ShieldAlert, 
  Paintbrush, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  X
} from 'lucide-react';
import { SYMPOSIA } from '../data/mockData';
import { Symposium } from '../types';

interface TechnicalProgrammeProps {
  onSelectSymposiumForCFP: (sympId: number) => void;
}

const iconMap: Record<string, React.ElementType> = {
  FlaskConical,
  Biohazard,
  Building2,
  Flame,
  Fuel,
  Ship,
  ShieldAlert,
  Layers,
  Paintbrush,
  Zap,
  Activity,
  ShieldCheck,
  Cpu,
  Sparkles
};

export default function TechnicalProgramme({ onSelectSymposiumForCFP }: TechnicalProgrammeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSymposium, setActiveSymposium] = useState<Symposium | null>(null);

  const categories = ['All', 'Science', 'Industry', 'Technology', 'Digital & AI'];

  const filteredSymposia = SYMPOSIA.filter((symp) => {
    const matchesCategory = selectedCategory === 'All' || symp.category === selectedCategory;
    const matchesSearch = 
      symp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      symp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      symp.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="symposia" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-block bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Technical Sessions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            14 Specialized <span className="text-red-600">Technical Symposia</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Covering fundamental electrochemistry, aggressive plant environments, advanced metallurgical alloys, protective coatings, cathodic protection, and AI-driven asset integrity.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search symposia, topics or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-slate-900"
            />
          </div>

        </div>

        {/* Symposia Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSymposia.map((symp) => {
            const IconComponent = iconMap[symp.icon] || Layers;

            return (
              <div
                key={symp.id}
                className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-red-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Meta */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black tracking-wider text-slate-900 font-mono">
                        {symp.code}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-white border border-slate-200 text-slate-600">
                      {symp.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-2.5 group-hover:text-red-700 transition-colors leading-snug">
                    {symp.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {symp.description}
                  </p>

                  {/* Topics Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {symp.topics.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium bg-white text-slate-700 px-2.5 py-1 rounded-md border border-slate-200/80"
                      >
                        {topic}
                      </span>
                    ))}
                    {symp.topics.length > 3 && (
                      <span className="text-[11px] font-semibold text-slate-400 self-center">
                        +{symp.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
                  <button
                    onClick={() => setActiveSymposium(symp)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
                  >
                    View Scope
                  </button>
                  <button
                    onClick={() => onSelectSymposiumForCFP(symp.id)}
                    className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Submit Paper <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredSymposia.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-600 font-semibold text-sm">
              No technical symposia matched your search query &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 text-xs font-bold text-red-600 underline"
            >
              Clear filters
            </button>
          </div>
        )}

      </div>

      {/* Symposium Details Modal */}
      {activeSymposium && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setActiveSymposium(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-extrabold bg-red-100 text-red-700 px-2.5 py-1 rounded-md font-mono">
                {activeSymposium.code}
              </span>
              <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2.5 py-1 rounded-md uppercase">
                {activeSymposium.category}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">
              {activeSymposium.title}
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {activeSymposium.description}
            </p>

            <div className="space-y-3 mb-8">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Key Technical Topics &amp; Research Areas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeSymposium.topics.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveSymposium(null)}
                className="text-xs font-bold text-slate-600 hover:text-slate-800 px-4 py-2.5 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = activeSymposium.id;
                  setActiveSymposium(null);
                  onSelectSymposiumForCFP(id);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                Submit Paper to this Session <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
