'use client';

import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Download, 
  Bell, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { 
  CalendarEventDetails, 
  getGoogleCalendarUrl, 
  getOutlookCalendarUrl, 
  downloadIcsFile 
} from '../lib/calendar';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEventDetails | null;
}

export default function CalendarModal({ isOpen, onClose, event }: CalendarModalProps) {
  if (!isOpen || !event) return null;

  const handleOpenGoogle = () => {
    const url = getGoogleCalendarUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenOutlook = () => {
    const url = getOutlookCalendarUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadIcs = () => {
    downloadIcsFile(event, `${event.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}.ics`);
  };

  const handleBrowserReminder = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification('GUJCORR 2027 Reminder Set!', {
        body: `You will be notified for: ${event.title}`,
        icon: '/images/ampp-logo.png'
      });
      alert(`Reminder scheduled for "${event.title}"!`);
    } else {
      alert('Notification permissions are required to set a desktop reminder.');
    }
  };

  // Format readable dates for display
  const formatReadableDate = (str: string) => {
    if (!str || str.length < 8) return '';
    const y = str.substring(0, 4);
    const m = str.substring(4, 6);
    const d = str.substring(6, 8);
    const time = str.length >= 13 ? `${str.substring(9, 11)}:${str.substring(11, 13)}` : '';
    const dateObj = new Date(`${y}-${m}-${d}T${time || '00:00'}:00`);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-red-600">
              Add Event to Calendar
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              Set Date &amp; Reminder
            </h3>
          </div>
        </div>

        {/* Event Preview Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 mb-6">
          <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
            {event.title}
          </h4>

          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-600">
            <div className="flex items-center gap-1 font-semibold text-red-600">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatReadableDate(event.startDate)}</span>
            </div>

            <div className="flex items-center gap-1 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span className="truncate max-w-xs">{event.location}</span>
            </div>
          </div>

          {event.description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
              {event.description}
            </p>
          )}
        </div>

        {/* Calendar Provider Options */}
        <div className="space-y-3">
          
          {/* 1. Google Calendar (Highlighted as Primary) */}
          <button
            onClick={handleOpenGoogle}
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-xs sm:text-sm p-4 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center font-black text-xs text-white">
                G
              </div>
              <div className="text-left">
                <div className="font-extrabold">Google Calendar</div>
                <div className="text-[11px] text-red-100 font-normal">Add event + 24h &amp; 1h mobile push notification</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* 2. Outlook / Office 365 */}
          <button
            onClick={handleOpenOutlook}
            className="w-full bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-xs">
                O
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900">Microsoft Outlook / Office 365</div>
                <div className="text-[11px] text-slate-500 font-normal">Open Outlook Web calendar sync</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* 3. Apple Calendar / iCal File (.ics) */}
          <button
            onClick={handleDownloadIcs}
            className="w-full bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center font-bold text-xs">
                <Download className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900">Apple Calendar &amp; iCal (.ics)</div>
                <div className="text-[11px] text-slate-500 font-normal">Download universal calendar file</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* 4. Browser Notification Alert */}
          <button
            onClick={handleBrowserReminder}
            className="w-full bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 font-extrabold text-xs sm:text-sm p-3.5 rounded-2xl border border-emerald-200 transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-emerald-200 text-emerald-800 rounded-lg flex items-center justify-center font-bold text-xs">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-emerald-950">Set Browser Push Reminder</div>
                <div className="text-[11px] text-emerald-700 font-normal">Get notified on your computer/phone</div>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </button>

        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-[11px] text-slate-400">
          GUJCORR 2027 &bull; 18–20 February 2027 &bull; Vadodara, Gujarat
        </div>

      </div>
    </div>
  );
}
