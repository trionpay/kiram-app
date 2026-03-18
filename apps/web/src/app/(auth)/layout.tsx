import { TrionPayLogo } from '@/components/ui/TrionPayLogo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sol panel — hero */}
      <div
        className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-shrink-0 flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #102A43, #0C1929, #061018)' }}
      >
        {/* Logo */}
        <div>
          <TrionPayLogo width={130} color="#FFFFFF" accentColor="#5FE00B" />
        </div>

        {/* Tagline */}
        <div className="space-y-4">
          <div className="w-9 h-0.5 bg-accent rounded-full" />
          <h1 className="text-3xl font-bold text-white leading-snug">
            Kira, aidat, fatura<br />tek yerden öde.
          </h1>
          <p className="text-white/50 text-base leading-relaxed">
            Ödemeleriniz güvende,<br />deneyim sizinle.
          </p>
        </div>

        {/* Footer */}
        <p className="text-white/25 text-xs tracking-widest uppercase">kiram.com</p>

        {/* Dekoratif daireler */}
        <div
          className="absolute top-[-120px] right-[-80px] w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(3, 105, 161, 0.1)' }}
        />
      </div>

      {/* Sag panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobil logo */}
          <div className="mb-10 lg:hidden">
            <TrionPayLogo width={110} color="#0C1929" accentColor="#5FE00B" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
