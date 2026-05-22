import {forwardRef, type TextareaHTMLAttributes} from 'react';
import {textareaFieldClass} from '~/lib/theme';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

function mergeClass(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({className = '', ...props}, ref) {
    return (
      <textarea
        ref={ref}
        {...props}
        className={mergeClass(textareaFieldClass, className)}
      />
    );
  },
);
