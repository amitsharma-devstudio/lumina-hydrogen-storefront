import type {ReactNode} from 'react';
import {btnPrimaryClass, btnSecondaryClass} from '~/lib/theme';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export function Button({children, variant, className}: ButtonProps) {
  const variants = {
    primary: `${btnPrimaryClass} rounded-full px-8 py-4`,
    secondary: `${btnSecondaryClass} rounded-full px-8 py-4`,
  };

  return (
    <button className={`${variants[variant || 'primary']} ${className ?? ''}`}>
      {children}
    </button>
  );
}
