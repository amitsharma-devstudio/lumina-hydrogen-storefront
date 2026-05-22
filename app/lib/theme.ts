/**
 * Shared Tailwind class strings wired to theme tokens in app/styles/theme.css.
 * Prefer these for buttons/CTAs so a retheme is one file change.
 */

export const focusRingClass =
  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';

/** Primary CTA — Add to bag, checkout, hero main action */
export const btnPrimaryClass = [
  'inline-flex items-center justify-center',
  'bg-primary text-primary-foreground',
  'transition-opacity hover:bg-primary-hover',
  focusRingClass,
  'disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:opacity-100',
].join(' ');

/** PDP / compact uppercase CTA */
export const btnPrimaryCompactClass = [
  'h-12 min-h-12 flex-1 rounded-sm',
  'bg-primary px-6 text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground',
  'transition-opacity hover:bg-primary-hover',
  focusRingClass,
  'disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:opacity-100',
].join(' ');

/** Secondary outline */
export const btnSecondaryClass = [
  'inline-flex items-center justify-center',
  'border border-primary bg-background text-foreground',
  'transition-colors hover:bg-primary-muted',
  focusRingClass,
].join(' ');

/** Selected variant / chip */
export const chipSelectedClass = 'border-primary bg-primary text-primary-foreground';

/** Unselected chip hover */
export const chipHoverClass = 'hover:border-primary';
