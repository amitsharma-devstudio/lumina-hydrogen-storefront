import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export function Input({className = '', ...props}: InputProps) {
  return (
    <input
      {...props}
      className={`px-6 py-3 border rounded-full ${className}`}
    />
  );
}
