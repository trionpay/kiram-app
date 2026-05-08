import Image from 'next/image';

interface TrionPayLogoProps {
  width?: number;
  color?: string;
  accentColor?: string;
  className?: string;
  variant?: 'horizontal' | 'horizontal-white' | 'vertical';
}

const RATIOS: Record<'horizontal' | 'horizontal-white' | 'vertical', number> = {
  horizontal: 0.252,
  'horizontal-white': 0.252,
  vertical: 0.365,
};

export function TrionPayLogo({
  width = 140,
  className = '',
  variant = 'horizontal',
}: TrionPayLogoProps) {
  const src =
    variant === 'vertical'
      ? '/brand/kiram-dikey-mavi.svg'
      : variant === 'horizontal-white'
        ? '/brand/kiram-yatay-beyaz.svg'
        : '/brand/kiram-yatay-mavi.svg';

  return (
    <Image
      src={src}
      alt="Kiram"
      width={width}
      height={Math.round(width * RATIOS[variant])}
      className={className}
      quality={100}
      priority
    />
  );
}
