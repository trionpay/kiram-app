import Image from 'next/image';

interface TrionPayLogoProps {
  width?: number;
  color?: string;
  accentColor?: string;
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

const RATIOS: Record<'horizontal' | 'vertical', number> = {
  horizontal: 0.252,
  vertical: 0.365,
};

export function TrionPayLogo({
  width = 140,
  className = '',
  variant = 'horizontal',
}: TrionPayLogoProps) {
  return (
    <Image
      src={variant === 'horizontal' ? '/brand/kiram-yatay-mavi.png' : '/brand/kiram-dikey-mavi.png'}
      alt="Kiram"
      width={width}
      height={Math.round(width * RATIOS[variant])}
      className={className}
      priority
    />
  );
}
