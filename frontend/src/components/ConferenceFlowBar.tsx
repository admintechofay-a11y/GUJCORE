'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserPlus, LogIn, FileText, CreditCard, LayoutDashboard, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ConferenceFlowBarProps {
  currentStep?: 1 | 2 | 3 | 4 | 5;
}

export default function ConferenceFlowBar({ currentStep }: ConferenceFlowBarProps) {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  // Determine active step from pathname if not explicitly passed
  let step = currentStep || 1;
  if (pathname === '/register') step = 1;
  else if (pathname === '/login') step = 2;
  else if (pathname === '/call-for-papers') step = 3;
  else if (pathname === '/registration' || pathname === '/invoice') step = 4;
  else if (pathname === '/dashboard' || pathname === '/masterhome') step = 5;

  const steps = [
    { num: 1, label: '1. Register', href: '/register', icon: UserPlus, desc: 'Free Account' },
    { num: 2, label: '2. Login', href: '/login', icon: LogIn, desc: 'Portal Access' },
    { num: 3, label: '3. Submit Paper/Poster', href: '/call-for-papers', icon: FileText, desc: 'Oral or Poster' },
    { num: 4, label: '4. Pass & Payment', href: '/registration', icon: CreditCard, desc: 'Razorpay / Bank' },
    { num: 5, label: '5. Master Home', href: '/masterhome', icon: LayoutDashboard, desc: 'Badges & Letters' }
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white py-3 px-4 sm:px-6 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-1 scrollbar-none">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.num || (s.num === 1 && isAuthenticated);
            const isCurrent = step === s.num;

            return (
              <Link
                key={s.num}
                href={s.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-red-600 text-white font-extrabold shadow-sm ring-2 ring-red-400/50'
                    : isCompleted
                    ? 'bg-slate-800/90 text-emerald-400 font-bold hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  isCurrent
                    ? 'bg-white text-red-600'
                    : isCompleted
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {isCompleted && !isCurrent ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[11px]">{s.label}</span>
                  <span className="text-[9px] opacity-75 hidden md:inline">{s.desc}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
