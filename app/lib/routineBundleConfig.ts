/** Homepage copy + collection handles (no metaobjects required). */
export const ROUTINE_BUNDLE_CONFIG = [
  {
    bundleKey: 'glow',
    collectionHandle: 'morning-glow-routine',
    goal: 'Glow',
    eyebrow: 'Morning edit',
    title: 'Morning Glow Routine',
    description:
      'A brightening three-step ritual for skin that looks rested before your first meeting.',
    bestFor: 'Dullness, uneven tone, city mornings',
    result: 'Fresh, luminous, hydrated skin',
    price: 'From $128',
    ctaLabel: 'Shop routine',
    sortOrder: 1,
  },
  {
    bundleKey: 'barrier',
    collectionHandle: 'barrier-repair-routine',
    goal: 'Barrier',
    eyebrow: 'Recovery edit',
    title: 'Barrier Repair Routine',
    description:
      'A calmer routine for skin that feels tight, reactive, or under-rested.',
    bestFor: 'Dryness, sensitivity, compromised barrier',
    result: 'Cushioned, comfortable, resilient skin',
    price: 'From $142',
    ctaLabel: 'Shop routine',
    sortOrder: 2,
  },
  {
    bundleKey: 'clarity',
    collectionHandle: 'clarity-routine',
    goal: 'Clarity',
    eyebrow: 'Reset edit',
    title: 'Clarity Routine',
    description:
      'A balanced approach to congestion and texture without punishing skin.',
    bestFor: 'Breakouts, congestion, visible pores',
    result: 'Clearer-looking, smoother-feeling skin',
    price: 'From $118',
    ctaLabel: 'Shop routine',
    sortOrder: 3,
  },
  {
    bundleKey: 'renewal',
    collectionHandle: 'night-renewal-routine',
    goal: 'Renewal',
    eyebrow: 'Night edit',
    title: 'Night Renewal Routine',
    description:
      'An evening routine for texture, tone, and a smoother morning complexion.',
    bestFor: 'Texture, early lines, uneven tone',
    result: 'Polished, rested, more refined skin',
    price: 'From $156',
    ctaLabel: 'Shop routine',
    sortOrder: 4,
  },
] as const;
