'use client';

import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';

/** `prefix` HTML'de string; bizim önek slot'u için çakışmayı kaldırıyoruz. */
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, prefix, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-text-secondary">
            {label}
          </label>
        )}
        <div className={`
          flex items-center gap-2
          bg-elevated border rounded-2xl px-4 h-14
          transition-colors
          ${error ? 'border-error' : 'border-border focus-within:border-accent'}
        `}>
          {prefix && <span className="text-text-secondary flex-shrink-0">{prefix}</span>}
          <input
            ref={ref}
            className={`
              flex-1 bg-transparent outline-none
              text-base text-text-primary placeholder:text-text-tertiary
              ${className}
            `}
            {...props}
          />
        </div>
        {(hint || error) && (
          <p className={`text-xs ${error ? 'text-error' : 'text-text-tertiary'}`}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
