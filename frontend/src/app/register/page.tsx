'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import ConferenceFlowBar from '@/components/ConferenceFlowBar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import { 
  UserPlus, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  CreditCard, 
  LayoutDashboard, 
  Zap, 
  ShieldCheck,
  Building,
  Mail,
  Lock,
  Phone,
  User,
  Sparkles
} from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Author & Presenter' as UserRole,
    organization: '',
    designation: '',
    mobileNumber: '',
    city: 'Vadodara',
    state: 'Gujarat',
    country: 'India',
    membershipType: 'None',
    membershipNumber: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const generatedTicketId = `GUJ27-DEL-${Math.floor(100000 + Math.random() * 900000)}`;
      const res = await register({
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        organization: formData.organization,
        designation: formData.designation,
        mobileNumber: formData.mobileNumber,
        city: formData.city,
        country: formData.country,
        membershipType: formData.membershipType,
        membershipNumber: formData.membershipNumber,
        password: formData.password
      });

      if (res.success) {
        setIsRegistered(true);
        setRegisteredUser({
          ...formData,
          ticketId: generatedTicketId
        });

        // Trigger welcome email via Nodemailer
        api.sendNotificationEmail({
          type: 'welcome',
          to: formData.email,
          data: {
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role,
            ticketId: generatedTicketId,
            organization: formData.organization
          }
        }).catch(err => console.warn('Email dispatch notice:', err));
      }
    } catch {
      alert('Registration failed. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between" suppressHydrationWarning>
      <AnnouncementBar />
      <Navbar />
      <ConferenceFlowBar currentStep={1} />

      <PageHeader
        badge="Step 1 of 5: Account Registration"
        title="Create Your"
        highlightedTitle="Master Account"
        description="Register your free conference account to submit abstracts, track peer-review status, manage delegate badges, and access author tools. No upfront fee required."
        breadcrumbs={[{ label: 'Register Account' }]}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {isRegistered && registeredUser ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xl text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                Step 1 Completed: Account Active
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Welcome to GUJCORR 2027, {registeredUser.fullName}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Your master account has been created and you are now signed in. Select your next step below to continue your conference journey:
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Attendee ID:</span>
                <span className="font-mono font-bold text-slate-900">{registeredUser.ticketId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-900">{registeredUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Affiliation:</span>
                <span className="font-semibold text-slate-900">{registeredUser.organization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded">{registeredUser.role}</span>
              </div>
            </div>

            {/* Guided Next Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left">
              
              <Link
                href="/call-for-papers"
                className="p-5 bg-gradient-to-br from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 border-2 border-teal-300 rounded-2xl transition-all shadow-xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                      Recommended Next Step
                    </span>
                    <FileText className="w-5 h-5 text-teal-700" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base group-hover:text-teal-900">
                    Step 3: Submit Paper or Poster &rarr;
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Submit your 200–250 word research abstract across 14 technical symposia for peer review.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-teal-800 flex items-center gap-1">
                  <span>Start Paper Submission</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/registration"
                className="p-5 bg-gradient-to-br from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 border-2 border-red-300 rounded-2xl transition-all shadow-xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[10px] font-black uppercase text-red-800 bg-red-100 px-2 py-0.5 rounded">
                      Delegate Access
                    </span>
                    <CreditCard className="w-5 h-5 text-red-700" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base group-hover:text-red-900">
                    Step 4: Book Delegate Pass &amp; Pay &rarr;
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Select your pass category (Member ₹4,720 / Non-Member ₹7,670 / Student ₹1,770) and pay online or later.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-red-800 flex items-center gap-1">
                  <span>View Pass Packages</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

            </div>

            <div className="pt-2">
              <Link
                href="/masterhome"
                className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 underline underline-offset-4"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Or go straight to Master Home Dashboard</span>
              </Link>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
            
            <div className="pb-4 border-b border-slate-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded">
                Free Conference Registration
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                Create Author &amp; Delegate Account
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill in your professional details below to create your official GUJCORR 2027 credentials.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Account Credentials */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-red-600" />
                  <span>1. Login Credentials</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="author@organization.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>2. Personal &amp; Professional Info</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name with Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. / Prof. / Mr. Full Name"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primary Role *</label>
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
                    >
                      <option value="Author">Author / Paper Submitter</option>
                      <option value="Delegate">Delegate / Industry Attendee</option>
                      <option value="Speaker">Invited Keynote Speaker</option>
                      <option value="Exhibitor">Exhibitor / Stall Manager</option>
                      <option value="Sponsor">Sponsor Partner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Mobile *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.mobileNumber}
                      onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Job Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Corrosion Engineer, Professor"
                      value={formData.designation}
                      onChange={e => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Organization / University *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. The M.S. University of Baroda / L&T / IOCL"
                      value={formData.organization}
                      onChange={e => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="Vadodara"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Membership Category *</label>
                    <select
                      value={formData.membershipType}
                      onChange={e => setFormData({ ...formData, membershipType: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
                    >
                      <option value="AMPP / IIM Member">AMPP / IIM Member (Discounted)</option>
                      <option value="Non-Member">Non-Member / Industry</option>
                      <option value="Student / Scholar">Student / Research Scholar</option>
                      <option value="Faculty">Academic Faculty</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Member ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. AMPP-GJ-8812"
                      value={formData.membershipNumber}
                      onChange={e => setFormData({ ...formData, membershipNumber: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <Link href="/login" className="text-red-600 font-bold hover:underline">
                    Sign in here &rarr;
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isSubmitting ? 'Creating Account...' : 'Register Free Account &rarr;'}</span>
                </button>
              </div>

            </form>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
