'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Mail, 
  Lock, 
  ArrowRight, 
  UserCheck, 
  FileText, 
  Users, 
  Store, 
  KeyRound, 
  CheckCircle2
} from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import ConferenceFlowBar from '@/components/ConferenceFlowBar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Author');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await login(email, password, selectedRole);
      if (res.success) {
        if (selectedRole === 'Author') {
          router.push('/call-for-papers');
        } else if (selectedRole === 'Delegate') {
          router.push('/registration');
        } else {
          router.push('/masterhome');
        }
      } else {
        setErrorMsg(res.message || 'Invalid credentials. Please verify and try again.');
      }
    } catch {
      setErrorMsg('Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between" suppressHydrationWarning>
      <AnnouncementBar />
      <Navbar />
      <ConferenceFlowBar currentStep={2} />

      <PageHeader
        badge="Step 2 of 5: Member Login"
        title="Sign In to Your"
        highlightedTitle="Conference Portal"
        description="Access your submitted papers, review scores, delegate passes, digital QR credentials, and exhibition stalls."
        breadcrumbs={[{ label: 'Login' }]}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          
          {/* Top Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              GUJCORR 2027 Master Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Enter your registered email and password to access the portal.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full text-xs sm:text-sm px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none font-semibold text-slate-800"
              >
                <option value="Author">Author / Research Submitter</option>
                <option value="Delegate">Delegate / Conference Attendee</option>
                <option value="Speaker">Invited Keynote Speaker</option>
                <option value="Exhibitor">Exhibitor / Booth Manager</option>
                <option value="Reviewer">Technical Review Committee</option>
                <option value="Admin">Secretariat Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
                />
                <span className="text-slate-600">Keep me signed in</span>
              </label>
              <button
                type="button"
                onClick={() => alert('For password recovery, contact the conference secretariat: iim.barodachapter@gmail.com')}
                className="text-red-600 hover:underline font-semibold cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to Portal →'}</span>
            </button>
          </form>

          {/* Bottom Link to Register */}
          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="text-red-600 font-extrabold hover:underline">
              Create a free account in Step 1 &rarr;
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
