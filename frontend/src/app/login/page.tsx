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
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

const ROLE_OPTIONS: { role: UserRole; label: string; icon: any; color: string }[] = [
  { role: 'Author', label: 'Author / Submitter', icon: FileText, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  { role: 'Delegate', label: 'Delegate / Attendee', icon: Users, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { role: 'Exhibitor', label: 'Exhibitor / Booth', icon: Store, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { role: 'Reviewer', label: 'Review Committee', icon: UserCheck, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { role: 'Admin', label: 'Secretariat Admin', icon: ShieldCheck, color: 'text-red-700 bg-red-50 border-red-200' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        if (selectedRole === 'Admin') {
          router.push('/admin');
        } else if (selectedRole === 'Author') {
          router.push('/call-for-papers');
        } else if (selectedRole === 'Delegate') {
          router.push('/registration');
        } else if (selectedRole === 'Exhibitor') {
          router.push('/exhibition');
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

  const fillQuickCredentials = (role: UserRole, defaultEmail: string, defaultPass: string) => {
    setSelectedRole(role);
    setEmail(defaultEmail);
    setPassword(defaultPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between" suppressHydrationWarning>
      <AnnouncementBar />
      <Navbar />

      <PageHeader
        badge="Conference Authentication"
        title="Sign In to Your"
        highlightedTitle="Conference Portal"
        description="Access your submitted papers, peer-review feedback, delegate entry badge, tax receipts, and exhibition stalls."
        breadcrumbs={[{ label: 'Login' }]}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          
          {/* Top Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              GUJCORR 2027 Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Member Sign In
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Select your role and enter your registered credentials.
            </p>
          </div>

          {/* Quick Fill Demo Badges */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block text-center">
              Quick One-Click Test Logins:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fillQuickCredentials('Admin', 'admin@amppgujarat.org', 'admin@2027')}
                className="text-[11px] font-bold px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 transition-colors cursor-pointer"
              >
                👑 Admin / Secretariat
              </button>
              <button
                type="button"
                onClick={() => fillQuickCredentials('Author', 'author@tcr-eng.com', 'author123')}
                className="text-[11px] font-bold px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg border border-teal-200 transition-colors cursor-pointer"
              >
                📝 Author Submitter
              </button>
              <button
                type="button"
                onClick={() => fillQuickCredentials('Delegate', 'delegate@lnt.com', 'pass123')}
                className="text-[11px] font-bold px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors cursor-pointer"
              >
                🎟️ Delegate Attendee
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Visual Role Pills Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Your Role:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ROLE_OPTIONS.map(({ role, label, icon: Icon }) => {
                  const isSelected = selectedRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs font-extrabold'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                      <span className="text-[11px] truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="e.g. name@organization.com"
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 cursor-pointer"
                />
                <span className="text-slate-600 font-medium">Keep me signed in</span>
              </label>
              <button
                type="button"
                onClick={() => alert('For password resets or account retrieval, please email the Secretariat: iim.barodachapter@gmail.com with your registered phone number.')}
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
              <span>{isLoading ? 'Authenticating...' : `Sign In as ${selectedRole} →`}</span>
            </button>
          </form>

          {/* Bottom Link to Register */}
          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            Don&apos;t have a conference account yet?{' '}
            <Link href="/register" className="text-red-600 font-extrabold hover:underline">
              Create a free account &rarr;
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
