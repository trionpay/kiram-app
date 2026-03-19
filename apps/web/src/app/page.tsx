import { LandingNav } from '@/components/landing/LandingNav';
import { Hero } from '@/components/landing/Hero';
import { TrustBar } from '@/components/landing/TrustBar';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Security } from '@/components/landing/Security';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { CTABanner } from '@/components/landing/CTABanner';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNav />
      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <Security />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  );
}
