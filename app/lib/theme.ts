/**
 * Shared Tailwind class strings wired to theme tokens in app/styles/theme.css.
 * Prefer UI components in app/components/ui/ for forms and CTAs.
 */

export const focusRingClass =
  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';

/** Shared control height for inputs, selects, and inline buttons */
export const controlHeightClass = 'h-11 min-h-11';

/** Primary CTA — buttons */
export const btnPrimaryClass = [
  'inline-flex items-center justify-center',
  controlHeightClass,
  'bg-primary px-6 text-sm font-medium text-primary-foreground',
  'transition-colors hover:bg-primary-hover',
  focusRingClass,
  'disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:opacity-100',
].join(' ');

/** PDP / compact uppercase CTA */
export const btnPrimaryCompactClass = [
  'inline-flex items-center justify-center',
  'h-12 min-h-12 flex-1 rounded-sm',
  'bg-primary px-6 text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground',
  'transition-colors hover:bg-primary-hover',
  focusRingClass,
  'disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:opacity-100',
].join(' ');

/** Secondary outline */
export const btnSecondaryClass = [
  'inline-flex items-center justify-center',
  controlHeightClass,
  'border border-primary bg-background px-6 text-sm font-medium text-foreground',
  'transition-colors hover:bg-primary-muted',
  focusRingClass,
].join(' ');

/** Apply / outline accent (forms) */
export const btnApplyClass = [
  'inline-flex shrink-0 items-center justify-center',
  controlHeightClass,
  'rounded-sm border border-primary bg-white px-5',
  'text-[11px] font-medium uppercase tracking-[0.14em] text-primary',
  'transition-colors hover:bg-primary-muted',
  focusRingClass,
  'disabled:cursor-not-allowed disabled:opacity-50',
].join(' ');

/** Text link button */
export const btnLinkClass =
  'text-sm text-neutral-600 underline-offset-2 transition-colors hover:text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-40';

/** Primary CTA as `<a>` / `<Link>` */
export const btnPrimaryLinkClass = [
  btnPrimaryClass,
  'no-underline !text-primary-foreground visited:!text-primary-foreground',
  'active:!text-primary-foreground hover:!text-primary-foreground',
].join(' ');

export const inputFieldClass = [
  'w-full min-w-0',
  controlHeightClass,
  'rounded-sm border border-neutral-300 bg-white px-3',
  'text-sm text-foreground placeholder:text-neutral-400',
  'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
  'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-60',
].join(' ');

export const selectFieldClass = [
  'w-full min-w-0 appearance-none',
  controlHeightClass,
  'rounded-sm border border-neutral-300 bg-white px-3 pr-9',
  'text-sm text-foreground',
  'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
  'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-60',
].join(' ');

/** Catalog PLP sort control (pairs with .catalog-select in theme.css) */
export const catalogSelectClass = [
  'catalog-select w-full min-w-0 appearance-none',
  controlHeightClass,
  'rounded-full border border-neutral-200 bg-white px-5 pr-12',
  'text-sm text-foreground',
  'transition-colors hover:border-neutral-400',
  'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
  'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-60',
].join(' ');

export const textareaFieldClass = [
  'w-full min-w-0',
  'min-h-[6rem] rounded-sm border border-neutral-300 bg-white px-3 py-2.5',
  'text-sm text-foreground placeholder:text-neutral-400',
  'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
  'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-60',
].join(' ');

export const formLabelClass =
  'mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500';

export const inputGroupClass = 'flex items-stretch gap-2';

/** Selected variant / chip */
export const chipSelectedClass =
  'border-primary bg-primary text-primary-foreground';

export const chipHoverClass = 'hover:border-primary';
