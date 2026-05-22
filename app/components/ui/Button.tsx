import {forwardRef, type ButtonHTMLAttributes} from 'react';
import {
  btnApplyClass,
  btnLinkClass,
  btnPrimaryClass,
  btnPrimaryLinkClass,
  btnSecondaryClass,
} from '~/lib/theme';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'apply'
  | 'link'
  | 'primaryLink';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  className?: string;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: btnPrimaryClass,
  secondary: btnSecondaryClass,
  apply: btnApplyClass,
  link: btnLinkClass,
  primaryLink: btnPrimaryLinkClass,
};

function mergeClass(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {variant = 'primary', className = '', type = 'button', ...props},
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      {...props}
      className={mergeClass(variantClass[variant], className)}
    />
  );
});

type PrimaryLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string;
};

/** Primary CTA rendered as an anchor (checkout, external links). */
export function PrimaryLink({className = '', ...props}: PrimaryLinkProps) {
  return (
    <a
      {...props}
      className={mergeClass(btnPrimaryLinkClass, 'w-full rounded-xl', className)}
    />
  );
}
