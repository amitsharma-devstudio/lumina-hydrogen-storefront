import {forwardRef, type InputHTMLAttributes} from 'react';
import {inputFieldClass} from '~/lib/theme';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

function mergeClass(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {className = '', ...props},
  ref,
) {
  return (
    <input
      ref={ref}
      {...props}
      className={mergeClass(inputFieldClass, className)}
    />
  );
});
