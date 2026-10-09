'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, ArrowRight, Bell, ExternalLink, Clock, Phone, Mail } from 'lucide-react';
import { IMPORTANT_DATES, getDateStatusBadge, CONFERENCE_INFO } from '@/data/conference';
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
    // Generate ISO timestamps from rawDate
    const dateFormatted = item.rawDate.replace(/-/g, '');
    const startDate = `${dateFormatted}T090000`;
    const endDate = item.id === 5 ? '20270220T180000' : `${dateFormatted}T235900`;

    return {
      title: `GUJCORR 2027: ${item.title}`,
      description: `${item.description}\nCategory: ${item.category}\nOfficial Portal: https://www.gujcorr.org/`,
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
            Official Conference Milestones
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Important <span className="text-red-600">Dates</span> &amp; Submission Deadlines
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Every accepted paper requires the presenting author to be registered as a delegate. Mark these official deadlines on your calendar.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {IMPORTANT_DATES.map((item, index) => {
            const isLast = index === IMPORTANT_DATES.length - 1;
            const statusInfo = getDateStatusBadge(item.rawDate);

            return (
              <div
                key={item.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
                  isLast
                    ? 'bg-slate-900 text-white border-2 border-red-500 shadow-xl'
                    : statusInfo.status === 'Open'
                    ? 'bg-white border-2 border-emerald-300 shadow-md hover:border-emerald-400'
                    : statusInfo.status === 'Closing soon'
                    ? 'bg-white border-2 border-amber-300 shadow-md hover:border-amber-400'
                    : 'bg-white border border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                {/* Step Badge & Computed Live Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      isLast
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-900 text-white'
                    }`}
                  >
                    0{item.id}
                  </span>

                  {/* Computed live status badge (Open / Closing soon / Closed) */}
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                      isLast
                        ? 'bg-red-600/30 text-red-300 border border-red-500/40'
                        : statusInfo.badgeClass
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                    <span>{isLast ? 'Event Days' : statusInfo.status}</span>
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
                    <span>{item.date}</span>
                  </div>

                  {!isLast && statusInfo.status !== 'Closed' && (
                    <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{statusInfo.daysLeft} days remaining</span>
                    </div>
                  )}

                  <p className={`text-xs leading-relaxed ${isLast ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.description}
                  </p>
                </div>

                {/* Action & Calendar Options */}
                <div className={`pt-3 border-t space-y-2 ${isLast ? 'border-slate-800' : 'border-slate-100'}`}>
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

        {/* Important Technical & Author Notes Banner */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full inline-block">
              Author Program Guidelines
            </span>
            <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
              Important Author &amp; Delegate Submission Requirements
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              <strong>Notes:</strong> Abstracts are uploaded via the website. The presenting author must register as a delegate for the paper to be included in the technical program.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-slate-700">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-teal-700" />
                Technical Queries: <a href="mailto:iim.barodachapter@gmail.com" className="font-bold text-red-600 hover:underline">iim.barodachapter@gmail.com</a>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-red-600" />
                Phone: <a href="tel:+919988881674" className="font-bold text-slate-900">+91 9988881674</a>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenCFP}
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Submit Abstract Online
            </button>
            <button
              onClick={onOpenRegister}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Author Registration Pass
            </button>
          </div>
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
