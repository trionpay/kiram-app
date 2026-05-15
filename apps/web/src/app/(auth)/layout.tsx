import { TrionPayLogo } from '@/components/ui/TrionPayLogo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sol panel — hero */}
      <div
        className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-shrink-0 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2a4bb5 0%, #1f3a8e 50%, #061b31 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(42,75,181,0.3), transparent 60%)' }} />
          <div className="absolute bottom-[-80px] left-[-60px] w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(58,94,199,0.25), transparent 60%)' }} />
        </div>

        <div className="relative z-10">
          <TrionPayLogo width={172} variant="horizontal" className="brightness-0 invert" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="w-9 h-0.5 bg-soft-violet rounded-full" />
          <h1 className="text-3xl font-bold text-white leading-snug">
            Kira ve aidat<br />tek yerden öde.
          </h1>
          <p className="text-white/70 text-base leading-relaxed">
            Ödemeleriniz güvende,<br />deneyim sizinle.
          </p>
        </div>

        <p className="relative z-10 text-white/25 text-xs tracking-widest uppercase">kiram.com</p>
      </div>

      {/* Sağ panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] rounded-full opacity-60" style={{ background: 'radial-gradient(circle, rgba(42,75,181,0.06), transparent 50%)' }} />
          <div className="absolute bottom-[5%] left-[10%] w-[400px] h-[400px] rounded-full opacity-50" style={{ background: 'radial-gradient(circle, rgba(58,94,199,0.05), transparent 50%)' }} />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(42,75,181,0.4) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>
        <div className="w-full max-w-md relative z-10">
          <div className="mb-10 lg:hidden">
            <TrionPayLogo width={110} color="#061b31" accentColor="#2a4bb5" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
