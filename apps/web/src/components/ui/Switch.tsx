'use client';

import { useId } from 'react';

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  id?: string;
};

export function Switch({
  checked,
  onCheckedChange,
  label,
  description,
  disabled,
  id: idProp,
}: SwitchProps) {
  const uid = useId();
  const id = idProp ?? `switch-${uid}`;

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-elevated p-4">
      <div className="min-w-0 pr-2">
        <label htmlFor={id} className="text-sm font-semibold text-text-primary">
          {label}
        </label>
        {description ? (
          <p id={`${id}-desc`} className="mt-1 text-xs leading-snug text-text-tertiary">
            {description}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? `${id}-desc` : undefined}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={`
          relative h-8 w-14 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
          ${checked ? 'bg-accent' : 'bg-border'}
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-0'}
          `}
          aria-hidden
        />
      </button>
    </div>
  );
}
