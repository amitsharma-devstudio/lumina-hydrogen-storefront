import {forwardRef, type SelectHTMLAttributes} from 'react';
import {selectFieldClass} from '~/lib/theme';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string;
};

function mergeClass(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {className = '', children, ...props},
  ref,
) {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        {...props}
        className={mergeClass(selectFieldClass, className)}
      >
        {children}
      </select>
      <span
        className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-500"
        aria-hidden="true"
      >
        ▾
      </span>
    </div>
  );
});
