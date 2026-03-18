type BadgeVariant = 'success' | 'error' | 'warning' | 'pending' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-green-50 text-success border-green-100',
  error: 'bg-red-50 text-error border-red-100',
  warning: 'bg-amber-50 text-warning border-amber-100',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  default: 'bg-surface text-text-secondary border-border',
};

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]}`}>
      {children}
    </span>
  );
}
