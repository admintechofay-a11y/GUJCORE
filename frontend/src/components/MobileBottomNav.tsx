'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UserCheck, FileText, Layers, Phone } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const items = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Symposia', href: '/symposia', icon: Layers },
    { name: 'Submit', href: '/call-for-papers', icon: FileText, highlight: true },
    { name: 'Register', href: '/registration', icon: UserCheck, primary: true },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside aria-label="Mobile quick actions" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.primary) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full p-3 shadow-lg shadow-red-500/30 active:scale-95 transition-transform"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-extrabold mt-0.5 uppercase tracking-tighter">
                  Register
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
                active 
                  ? 'text-red-600 font-bold' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-red-600 stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-1 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
