/**
 * Shared Tailwind class strings wired to theme tokens in app/styles/theme.css.
 * Prefer UI components in app/components/ui/ for forms and CTAs.
 */

export const focusRingClass =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2';

/** Shared control height for inputs, selects, and inline buttons */
export const controlHeightClass = 'h-12 min-h-12';

/** Primary CTA — buttons */
export const btnPrimaryClass = [
  'lumina-btn-primary inline-flex items-center justify-center',
  controlHeightClass,
  'rounded-full px-7 text-sm font-medium',
  'shadow-[0_10px_24px_rgba(111,69,48,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(111,69,48,0.2)]',
  focusRingClass,
  'disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:opacity-100',
].join(' ');

/** PDP / compact uppercase CTA */
export const btnPrimaryCompactClass = [
  'lumina-btn-primary inline-flex items-center justify-center',
  'h-12 min-h-12 flex-1 rounded-full',
  'px-6 text-[11px] font-medium uppercase tracking-[0.18em]',
  'shadow-[0_10px_24px_rgba(111,69,48,0.14)] transition-all duration-200 hover:-translate-y-0.5',
  focusRingClass,
  'disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:opacity-100',
].join(' ');

/** Secondary outline */
export const btnSecondaryClass = [
  'lumina-btn-secondary inline-flex items-center justify-center',
  controlHeightClass,
  'rounded-full px-7 text-sm font-medium',
  'transition-all duration-200 hover:-translate-y-0.5',
  focusRingClass,
].join(' ');

/** Apply / outline accent (forms) */
export const btnApplyClass = [
  'lumina-btn-secondary inline-flex shrink-0 items-center justify-center',
  controlHeightClass,
  'rounded-full px-5',
  'text-[11px] font-medium uppercase tracking-[0.14em]',
  'transition-all duration-200',
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
  'rounded-full border border-border bg-white px-5',
  'text-sm text-foreground placeholder:text-neutral-400',
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15',
  'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-60',
].join(' ');

export const selectFieldClass = [
  'w-full min-w-0 appearance-none',
  controlHeightClass,
  'rounded-full border border-border bg-white px-5 pr-10',
  'text-sm text-foreground',
  'transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15',
  'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-60',
].join(' ');

/** Catalog PLP sort control (pairs with .catalog-select in theme.css) */
export const catalogSelectClass = [
  'catalog-select w-full min-w-0 appearance-none',
  controlHeightClass,
  'rounded-full border border-border bg-white px-5 pr-12',
  'text-sm text-foreground',
  'transition-colors hover:border-border-strong',
  'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15',
  'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-60',
].join(' ');

export const textareaFieldClass = [
  'w-full min-w-0',
  'min-h-[6rem] rounded-xl border border-border bg-white px-5 py-3.5',
  'text-sm text-foreground placeholder:text-neutral-400',
  'transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15',
  'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-60',
].join(' ');

export const formLabelClass =
  'mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500';

export const inputGroupClass = 'flex items-stretch gap-2';

/** Selected variant / chip */
export const chipSelectedClass =
  'border-primary bg-primary text-primary-foreground';

export const chipHoverClass = 'hover:border-primary';
