import type {ReactNode} from 'react';
import {formLabelClass} from '~/lib/theme';

export function FormField({
  label,
  htmlFor,
  children,
  className = '',
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={formLabelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}
