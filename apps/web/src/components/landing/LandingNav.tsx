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
          ? 'bg-white/95 backdrop-blur-md border-b border-primary/10 shadow-sm'
          : 'bg-white/88 backdrop-blur-md border-b border-primary/10'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <TrionPayLogo width={120} color={scrolled ? '#1E3A5F' : '#FFFFFF'} accentColor="#5FE00B" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium transition-colors text-text-secondary hover:text-text-primary">
            Özellikler
          </a>
          <a href="#how-it-works" className="text-sm font-medium transition-colors text-text-secondary hover:text-text-primary">
            Nasıl Çalışır
          </a>
          <a href="#faq" className="text-sm font-medium transition-colors text-text-secondary hover:text-text-primary">
            SSS
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 rounded-xl transition-colors text-text-secondary hover:text-text-primary"
          >
            Giriş Yap
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold px-4 py-2 rounded-xl border-2 border-primary/25 text-primary transition-colors hover:bg-primary/5"
          >
            Hemen Başla
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1E3A5F"
            strokeWidth="2"
          >
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="px-6 py-4 space-y-3">
            <a href="#features" className="block text-text-secondary hover:text-text-primary py-2">Özellikler</a>
            <a href="#how-it-works" className="block text-text-secondary hover:text-text-primary py-2">Nasıl Çalışır</a>
            <a href="#faq" className="block text-text-secondary hover:text-text-primary py-2">SSS</a>
            <div className="pt-3 border-t border-border space-y-2">
              <Link href="/login" className="block text-center py-2.5 text-text-secondary">Giriş Yap</Link>
              <Link
                href="/login"
                className="block text-center py-2.5 rounded-xl font-semibold border-2 border-accent text-accent hover:bg-accent/5"
              >
                Hemen Başla
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
