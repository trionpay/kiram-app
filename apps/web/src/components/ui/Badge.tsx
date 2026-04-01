type BadgeVariant = 'success' | 'error' | 'warning' | 'pending' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-amber-50 text-amber-900 border-amber-200',
  pending: 'bg-orange-50 text-orange-900 border-orange-200',
  default: 'bg-surface text-text-secondary border-border',
};

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex min-h-[1.375rem] items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold leading-none border ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
