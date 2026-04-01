type Props = {
  title: string;
  body: string;
};

/** Yaklaşık kilit ekranı bildirimi genişliği (pt ≈ CSS px; OS sürümüne göre değişir). */
const NOTIFICATION_INNER = 'w-[248px]';

export function BroadcastDevicePreview({ title, body }: Props) {
  const displayTitle = title.trim() || 'Başlık';
  const displayBody = body.trim() || 'Mesaj yazdıkça burada kısaltılmış hali görünür.';

  return (
    <aside
      className="space-y-4 rounded-2xl border border-border bg-elevated p-4 lg:sticky lg:top-24"
      aria-label="Kilit ekranı bildirim önizlemesi"
    >
      <div>
        <h3 className="text-sm font-bold text-text-primary">Cihaz önizlemesi</h3>
        <p className="mt-1 text-xs leading-snug text-text-tertiary">
          Başlık ve metnin kilit ekranında yaklaşık nasıl kesileceği (iOS / Android stilleri farklıdır; gerçek cihaz ve
          sürümde satır sayısı değişebilir).
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <IosLockPreview title={displayTitle} body={displayBody} />
        <AndroidLockPreview title={displayTitle} body={displayBody} />
      </div>
    </aside>
  );
}

function AppIcon() {
  return (
    <div
      className="flex size-5 shrink-0 items-center justify-center rounded-[5px] bg-accent text-[10px] font-bold text-text-inverse"
      aria-hidden
    >
      K
    </div>
  );
}

function IosLockPreview({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">iOS · kilit ekranı</p>
      <div
        className={`mx-auto overflow-hidden rounded-[2rem] border-[3px] border-neutral-800 bg-gradient-to-b from-slate-900 via-slate-950 to-black px-3 pb-5 pt-8 shadow-lg ${NOTIFICATION_INNER} max-w-full`}
      >
        <p className="text-center text-[13px] font-medium tabular-nums text-white/90">9:41</p>
        <p className="mt-1 text-center text-[11px] font-medium text-white/45">Çarşamba 1 Nisan</p>
        <div className="mt-5 rounded-[14px] border border-white/10 bg-white/75 px-3 py-2.5 shadow-md backdrop-blur-md dark:bg-white/80">
          <div className="flex gap-2">
            <AppIcon />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-neutral-500">Kiram</p>
              <p className="mt-0.5 text-[15px] font-semibold leading-snug text-neutral-900 line-clamp-2">{title}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-neutral-700 line-clamp-4">{body}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AndroidLockPreview({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">Android · kilit ekranı</p>
      <div
        className={`mx-auto overflow-hidden rounded-[1.75rem] border-[3px] border-neutral-700 bg-gradient-to-b from-neutral-900 to-neutral-950 px-3 pb-5 pt-7 shadow-lg ${NOTIFICATION_INNER} max-w-full`}
      >
        <p className="text-center text-sm font-medium tabular-nums text-white/85">10:00</p>
        <div className="mt-4 rounded-2xl bg-neutral-800/95 px-3 py-2.5 shadow-md ring-1 ring-white/10">
          <div className="flex gap-2.5">
            <AppIcon />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-[13px] font-medium text-white">Kiram</p>
                <p className="shrink-0 text-[11px] text-white/45">şimdi</p>
              </div>
              <p className="mt-0.5 text-[14px] font-semibold leading-snug text-white line-clamp-1">{title}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-white/75 line-clamp-2">{body}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
