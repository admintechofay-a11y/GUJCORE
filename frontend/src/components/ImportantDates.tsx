'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, ArrowRight, Bell, ExternalLink } from 'lucide-react';
import { IMPORTANT_DATES } from '../data/mockData';
import { CalendarEventDetails, getGoogleCalendarUrl } from '../lib/calendar';
import CalendarModal from './CalendarModal';

interface ImportantDatesProps {
  onOpenCFP: () => void;
  onOpenRegister: () => void;
}

export default function ImportantDates({ onOpenCFP, onOpenRegister }: ImportantDatesProps) {
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventDetails | null>(null);

  const getMilestoneEvent = (item: typeof IMPORTANT_DATES[0]): CalendarEventDetails => {
    let startDate = '20260731T090000';
    let endDate = '20260731T235900';

    if (item.id === 1) {
      startDate = '20260731T090000';
      endDate = '20260731T235900';
    } else if (item.id === 2) {
      startDate = '20260831T090000';
      endDate = '20260831T180000';
    } else if (item.id === 3) {
      startDate = '20261015T090000';
      endDate = '20261015T235900';
    } else if (item.id === 4) {
      startDate = '20261115T090000';
      endDate = '20261115T235900';
    } else if (item.id === 5) {
      startDate = '20270218T090000';
      endDate = '20270220T180000';
    }

    return {
      title: `GUJCORR 2027: ${item.title}`,
      description: `${item.description}\nCategory: ${item.category}\nOfficial Portal: https://amppgujarat.org/`,
      location: 'Vadodara, Gujarat, India',
      startDate,
      endDate,
      timezone: 'Asia/Kolkata'
    };
  };

  const handleOpenGoogle = (item: typeof IMPORTANT_DATES[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const event = getMilestoneEvent(item);
    const url = getGoogleCalendarUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenModal = (item: typeof IMPORTANT_DATES[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const event = getMilestoneEvent(item);
    setSelectedEvent(event);
    setIsCalendarModalOpen(true);
  };

  return (
    <section id="dates" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-block bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Key Deadlines &amp; Timeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Important <span className="text-red-600">Dates</span> for Authors &amp; Delegates
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Mark your calendar to ensure your research papers, presentations, and registrations are submitted on schedule.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {IMPORTANT_DATES.map((item, index) => {
            const isLast = index === IMPORTANT_DATES.length - 1;
            const isCritical = item.status === 'Critical' || item.status === 'Open';

            return (
              <div
                key={item.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
                  isLast
                    ? 'bg-slate-900 text-white border-2 border-red-500 shadow-xl'
                    : isCritical
                    ? 'bg-white border-2 border-red-200 shadow-md hover:border-red-400'
                    : 'bg-white border border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                {/* Step Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      isLast
                        ? 'bg-red-600 text-white'
                        : isCritical
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    0{item.id}
                  </span>
                  <span
                    className={`text-[10.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      isLast
                        ? 'bg-red-600/30 text-red-300 border border-red-500/40'
                        : item.status === 'Open'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'Critical'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2 mb-6">
                  <div className={`text-xs font-bold uppercase tracking-wider ${isLast ? 'text-red-400' : 'text-slate-500'}`}>
                    {item.category}
                  </div>
                  <h3 className={`font-extrabold text-base leading-snug ${isLast ? 'text-white' : 'text-slate-900'}`}>
                    {item.title}
                  </h3>
                  <div className={`text-sm font-extrabold flex items-center gap-1.5 pt-1 ${isLast ? 'text-red-400' : 'text-red-600'}`}>
                    <Calendar className="w-4 h-4 shrink-0" />
                    {item.date}
                  </div>
                  <p className={`text-xs leading-relaxed ${isLast ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.description}
                  </p>
                </div>

                {/* Action & Calendar Options */}
                <div className="pt-3 border-t border-slate-100/50 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    {item.category === 'Call for Papers' || item.category === 'Manuscript' ? (
                      <button
                        onClick={onOpenCFP}
                        className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                      >
                        Submit <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : item.category === 'Registration' || isLast ? (
                      <button
                        onClick={onOpenRegister}
                        className={`text-xs font-bold flex items-center gap-1 cursor-pointer ${isLast ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                      >
                        Register <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Milestone
                      </span>
                    )}

                    {/* Google Calendar Direct Link */}
                    <button
                      onClick={(e) => handleOpenGoogle(item, e)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                        isLast 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-red-50 hover:bg-red-100 text-red-700'
                      }`}
                      title="Add reminder to Google Calendar"
                    >
                      <Calendar className="w-3 h-3 text-red-500" />
                      <span>Google Cal</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Notice Banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              Need assistance with author formatting or registration deadlines?
            </h4>
            <p className="text-xs text-slate-500">
              Contact our Technical Review Committee: <strong className="text-slate-800">iim.barodachapter@gmail.com</strong>
            </p>
          </div>
          <button
            onClick={onOpenCFP}
            className="shrink-0 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Author Guidelines &amp; Submission
          </button>
        </div>

      </div>

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        event={selectedEvent}
      />
    </section>
  );
}
