'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrionPayLogo } from '@/components/ui/TrionPayLogo';

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-white/80 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <TrionPayLogo width={120} color="#061b31" accentColor="#533afd" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Özellikler</a>
          <a href="#how-it-works" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Nasıl Çalışır</a>
          <a href="#faq" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">SSS</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium px-4 py-2 text-text-secondary hover:text-text-primary transition-colors">
            Giriş Yap
          </Link>
          <Link href="/login" className="text-sm font-semibold px-6 py-2.5 rounded-lg bg-deep-violet text-white hover:bg-accent-dark transition-colors">
            Hemen Başla
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#061b31" strokeWidth="2">
            {menuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="px-6 py-4 space-y-3">
            <a href="#features" className="block text-text-secondary hover:text-text-primary py-2 text-sm">Özellikler</a>
            <a href="#how-it-works" className="block text-text-secondary hover:text-text-primary py-2 text-sm">Nasıl Çalışır</a>
            <a href="#faq" className="block text-text-secondary hover:text-text-primary py-2 text-sm">SSS</a>
            <div className="pt-3 border-t border-border space-y-2">
              <Link href="/login" className="block text-center py-2.5 text-text-secondary text-sm">Giriş Yap</Link>
              <Link href="/login" className="block text-center py-2.5 rounded-lg bg-deep-violet text-white text-sm font-semibold">Hemen Başla</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
