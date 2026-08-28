/**
 * GUJCORR 2027 Calendar Integration Utility
 * Generates direct URLs for Google Calendar, Outlook, Office 365, Yahoo, and iCal (.ics)
 */

export interface CalendarEventDetails {
  title: string;
  description: string;
  location: string;
  startDate: string; // YYYYMMDDTHHMMSS format (e.g. 20270218T093000)
  endDate: string;   // YYYYMMDDTHHMMSS format (e.g. 20270218T103000)
  timezone?: string; // default 'Asia/Kolkata'
}

/**
 * 1. Generates Google Calendar direct event URL with reminders
 */
export function getGoogleCalendarUrl(event: CalendarEventDetails): string {
  const tz = event.timezone || 'Asia/Kolkata';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: `${event.description}\n\nConference: GUJCORR 2027 (18–20 Feb 2027, Vadodara)\nOfficial Portal: https://amppgujarat.org/`,
    location: event.location,
    dates: `${event.startDate}/${event.endDate}`,
    ctz: tz
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * 2. Generates Outlook Web / Office 365 Calendar URL
 */
export function getOutlookCalendarUrl(event: CalendarEventDetails): string {
  // Convert YYYYMMDDTHHMMSS to ISO string
  const formatIso = (str: string) => {
    return `${str.substring(0, 4)}-${str.substring(4, 6)}-${str.substring(6, 8)}T${str.substring(9, 11)}:${str.substring(11, 13)}:${str.substring(13, 15)}`;
  };

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description,
    location: event.location,
    startdt: formatIso(event.startDate),
    enddt: formatIso(event.endDate)
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * 3. Generates and triggers download of .ics file for Apple Calendar / Desktop Outlook
 */
export function downloadIcsFile(event: CalendarEventDetails, filename = 'GUJCORR_Event.ics') {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GUJCORR 2027//Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@gujcorr.org`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;TZID=${event.timezone || 'Asia/Kolkata'}:${event.startDate}`,
    `DTEND;TZID=${event.timezone || 'Asia/Kolkata'}:${event.endDate}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:GUJCORR 2027 Reminder: ' + event.title,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
