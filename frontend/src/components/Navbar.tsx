'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  Shield, 
  QrCode, 
  FileText, 
  ChevronDown, 
  Phone, 
  Mail, 
  Sparkles, 
  ExternalLink,
  Download,
  Calendar,
  Building2,
  Award,
  Layers,
  Users,
  Store,
  MapPin,
  LogIn,
  LogOut,
  User,
  Clock
} from 'lucide-react';
import { useAuth, cleanFullName } from '@/context/AuthContext';
import BrochureModal from './BrochureModal';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brochureOpen, setBrochureOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Primary desktop nav links
  const primaryLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Schedule', href: '/schedule' },
    { name: 'Symposia', href: '/symposia' },
    { name: 'Call for Papers', href: '/call-for-papers' },
    { name: 'Registration', href: '/registration' },
    { name: 'Exhibition', href: '/exhibition' },
    { name: 'Sponsorship', href: '/sponsorship' },
  ];

  // More dropdown items
  const secondaryLinks = [
    { name: 'Speakers & Keynotes', href: '/speakers', icon: Users },
    { name: 'Venue & Travel Guide', href: '/venue', icon: MapPin },
    { name: 'Corrosion Awards', href: '/awards', icon: Award },
    { name: 'Proforma Invoicing', href: '/invoice', icon: FileText },
    { name: 'Organizing Committee', href: '/committee', icon: Users },
    { name: 'Past Supporters (21 PSUs)', href: '/supporters', icon: Building2 },
    { name: 'Master Home Portal', href: '/masterhome', icon: QrCode },
    { name: 'Contact Secretariat', href: '/contact', icon: Phone },
  ];

  const allMobileLinks = [
    { name: 'Home', href: '/', icon: Building2 },
    { name: 'About GUJCORR', href: '/about', icon: Shield },
    { name: '3-Day Schedule', href: '/schedule', icon: Clock },
    { name: '14 Symposia', href: '/symposia', icon: Layers },
    { name: 'Call for Papers', href: '/call-for-papers', icon: FileText },
    { name: 'Registration & Passes', href: '/registration', icon: Calendar },
    { name: 'Exhibition Floor Plan', href: '/exhibition', icon: Store },
    { name: 'Sponsorship Tiers', href: '/sponsorship', icon: Award },
    { name: 'Keynote Speakers', href: '/speakers', icon: Users },
    { name: 'Venue & Partner Hotels', href: '/venue', icon: MapPin },
    { name: 'Corrosion Awards', href: '/awards', icon: Award },
    { name: 'Proforma Invoice', href: '/invoice', icon: FileText },
    { name: 'Organizing Committee', href: '/committee', icon: Users },
    { name: 'Master Home Portal', href: '/masterhome', icon: QrCode },
    { name: 'Contact Secretariat', href: '/contact', icon: Phone },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    router.push('/');
  };

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200' : 'bg-white border-b border-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            
            {/* Brand Logo Container */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
              <div className="h-9 sm:h-11 max-w-[140px] sm:max-w-[190px] flex items-center justify-center p-1 bg-white rounded-xl border border-slate-200 shadow-2xs group-hover:border-red-400 transition-colors shrink-0 overflow-hidden">
                <img
                  src="/images/ampp/Logo.png"
                  alt="AMPP Gujarat"
                  className="h-full w-auto max-w-full object-contain"
                />
              </div>

              <div className="hidden xs:flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-black text-base sm:text-xl tracking-tight text-slate-900 font-sans leading-none">
                    GUJ<span className="text-red-600">CORR</span>
                  </span>
                  <span className="bg-red-100 text-red-700 font-extrabold text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-mono">
                    2027
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 uppercase tracking-tight">
                  Vadodara, India
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 lg:gap-2">
              {primaryLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'text-red-600 bg-red-50/80 font-extrabold'
                        : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* More Dropdown Menu */}
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-red-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>More</span>
                  <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                <div className="absolute top-full right-0 w-64 pt-2 hidden group-hover:block z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1">
                    {secondaryLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-red-600 transition-colors"
                        >
                          <Icon className="w-4 h-4 text-slate-400" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </nav>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Conference Prospectus Brochure Button */}
              <button
                type="button"
                onClick={() => setBrochureOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                title="View & Download Official Conference Brochure"
              >
                <Download className="w-3.5 h-3.5 text-teal-700" />
                <span>Brochure</span>
              </button>

              {/* Dynamic Auth State / Login & Register buttons */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
                  >
                    <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-xs font-extrabold">
                      {cleanFullName(user.fullName).charAt(0)}
                    </div>
                    <div className="hidden sm:flex flex-col text-left leading-tight">
                      <span className="text-xs font-extrabold truncate max-w-[120px]">{cleanFullName(user.fullName)}</span>
                      <span className="text-[10px] text-amber-400 font-bold">{user.role}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 z-50 animate-in fade-in">
                      <div className="px-3 py-2 border-b border-slate-100 text-xs">
                        <div className="font-extrabold text-slate-900 truncate">{cleanFullName(user.fullName)}</div>
                        <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                        <span className="inline-block mt-1 bg-red-100 text-red-700 font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                          {user.ticketId || user.role}
                        </span>
                      </div>

                      <Link
                        href="/masterhome"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-red-600 rounded-xl"
                      >
                        <QrCode className="w-3.5 h-3.5 text-slate-400" /> Master Home Dashboard
                      </Link>

                      {(user.role === 'Admin' || user.role === 'Reviewer') && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl"
                        >
                          <Shield className="w-3.5 h-3.5 text-red-600" /> Admin Console
                        </Link>
                      )}

                      <Link
                        href="/invoice"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-red-600 rounded-xl"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400" /> Proforma Invoices
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/login"
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>

                  <Link
                    href="/registration"
                    className="hidden xs:flex items-center gap-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-xs px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-xs transition-all duration-200"
                  >
                    <span>Register</span>
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-red-600" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-DOWN DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-slate-900/60 backdrop-blur-sm xl:hidden">
          <div className="bg-white h-[calc(100vh-4rem)] max-w-md w-full ml-auto shadow-2xl p-4 sm:p-6 overflow-y-auto flex flex-col justify-between">
            
            <div className="space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Navigation Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 2-Column Mobile Touch Cards */}
              <div className="grid grid-cols-2 gap-2">
                {allMobileLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-3 rounded-2xl flex flex-col justify-between text-left transition-all border ${
                        active
                          ? 'bg-red-50 border-red-200 text-red-700 font-extrabold shadow-xs'
                          : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${active ? 'text-red-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold leading-tight">{link.name}</span>
                    </Link>
                  );
                })}
              </div>

            </div>

            {/* Bottom Actions inside Drawer */}
            <div className="pt-4 border-t border-slate-200 space-y-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setBrochureOpen(true);
                }}
                className="w-full bg-slate-900 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Conference Brochure PDF</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Secretariat: +91 99888 81674</span>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-red-600 font-bold hover:underline">
                  Contact Desk →
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Brochure Prospectus Viewer Modal */}
      <BrochureModal
        isOpen={brochureOpen}
        onClose={() => setBrochureOpen(false)}
      />
    </>
  );
}
