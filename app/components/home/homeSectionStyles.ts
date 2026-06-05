/** Base section — padding applied in theme.css (wins over main.home section reset) */
export const HOME_SECTION = 'home-section';

/**
 * Homepage odd/even stripes (1-indexed):
 * 1 Hero — muted | 2 Promo — surface | 3 Routine — muted | 4 Collections — surface …
 */
export const HOME_SECTION_SURFACE = 'home-section home-section--surface';
export const HOME_SECTION_MUTED = 'home-section home-section--muted';
/** Muted stripe, no block padding (hero) */
export const HOME_SECTION_MUTED_FLUSH =
  'home-section home-section--muted home-section--flush';
/** White band, no block padding (promo carousel) */
export const HOME_SECTION_SURFACE_FLUSH =
  'home-section home-section--surface home-section--flush';

/** Primary CTA: <Link className={HOME_BTN_PRIMARY}> — resets anchor styles */
export const HOME_BTN_PRIMARY = 'home-btn-primary';

/** Secondary outline CTA */
export const HOME_BTN_SECONDARY = 'home-btn-secondary';

/** Shared homepage section header grid */
export const HOME_SECTION_HEADER =
  'mb-14 grid gap-6 md:grid-cols-[1fr_0.75fr] md:items-end';

export const HOME_SECTION_EYEBROW =
  'mb-2 text-xs uppercase tracking-[0.15em] text-primary';

export const HOME_SECTION_TITLE =
  'max-w-2xl text-4xl font-light text-neutral-950 md:text-5xl';

export const HOME_SECTION_LEDE =
  'max-w-md text-sm leading-relaxed text-neutral-600 md:justify-self-end';
