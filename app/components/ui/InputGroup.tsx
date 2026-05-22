import type {ReactNode} from 'react';
import {inputGroupClass} from '~/lib/theme';

export function InputGroup({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${inputGroupClass} ${className}`.trim()}>{children}</div>
  );
}
