'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Globe } from 'lucide-react';
import { CONFERENCE_INFO } from '../data/mockData';
import { api } from '../lib/api';

export default function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: 'General Enquiry',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.submitContact(form);
      if (res.success) {
        setSubmitted(true);
        api.sendNotificationEmail({
          type: 'contact_inquiry',
          to: form.email,
          data: form
        }).catch(err => console.warn('Contact email dispatch warning:', err));
      }
    } catch {
      alert('Error sending message. Please email iim.barodachapter@gmail.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-block bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Contact Secretariat
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Get in Touch with <span className="text-red-600">GUJCORR 2027</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Have questions regarding delegate passes, paper submissions, booth bookings, or sponsorship? Reach out to our organizing team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contacts & Secretariat */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-extrabold text-slate-900 text-lg">
                Conference Secretariat
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Phone &amp; WhatsApp:</div>
                    <a href="tel:+919988881674" className="text-red-600 hover:text-red-800 font-bold block">
                      +91 99888 81674 (Mr. Hiren Panchal)
                    </a>
                    <span className="text-slate-500 text-[11px]">Secretary, AMPP Gujarat Chapter &amp; IIM Baroda</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Email Enquiries:</div>
                    <a href="mailto:iim.barodachapter@gmail.com" className="text-teal-700 hover:text-teal-900 font-semibold block">
                      iim.barodachapter@gmail.com (Secretariat)
                    </a>
                    <a href="mailto:coraxm2024@gmail.com" className="text-teal-700 hover:text-teal-900 font-semibold block">
                      coraxm2024@gmail.com (Souvenir Desk)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Official Portals:</div>
                    <a href="https://www.amppgujarat.org" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-red-600 block">
                      www.amppgujarat.org
                    </a>
                    <a href="https://www.iimbaroda.com" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-red-600 block">
                      www.iimbaroda.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Postal Address:</div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Department of Metallurgical &amp; Materials Engineering, The M.S. University of Baroda, Vadodara – 390001, Gujarat, India.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Connect */}
              <a
                href="https://wa.me/919988881674?text=Hello%2C%20I%20am%20inquiring%20about%20GUJCORR%202027%20Conference."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Message on WhatsApp
              </a>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-lg mb-1">
              Send an Instant Inquiry
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Our conference coordinators respond to all formal inquiries within 24 hours.
            </p>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-lg">Message Delivered!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you! Your message has been routed to the GUJCORR 2027 Organizing Committee. We will get back to you shortly at {form.email}.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', phone: '', organization: '', subject: 'General Enquiry', message: '' });
                  }}
                  className="text-xs font-bold text-emerald-800 underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="email@domain.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Category *</label>
                    <select
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                      <option>General Conference Enquiry</option>
                      <option>Delegate Registration &amp; Bulk Passes</option>
                      <option>Call for Papers &amp; Abstract Review</option>
                      <option>Sponsorship Packages</option>
                      <option>Exhibition Booth Reservation</option>
                      <option>Souvenir Advertisement</option>
                      <option>Awards &amp; Nominations</option>
                      <option>Hotel Accommodation Assistance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Organization / University</label>
                  <input
                    type="text"
                    placeholder="e.g. Linde Engineering / ONGC / MSU Baroda"
                    value={form.organization}
                    onChange={e => setForm({ ...form, organization: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your inquiry or question in detail..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-red-600 text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message →'}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
