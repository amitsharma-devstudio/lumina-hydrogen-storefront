import {useCallback, useEffect, useState} from 'react';

type UseCarouselOptions = {
  /** Auto-advance interval in ms. */
  intervalMs?: number;
  /** Disable auto-advance entirely (still allows manual navigation). */
  autoAdvance?: boolean;
};

/**
 * Headless carousel state shared across carousels (promo banner, hero products).
 * Owns the active index + auto-advance loop; each carousel renders its own markup.
 * Auto-advance pauses on hover/focus (via `setPaused`) and respects
 * `prefers-reduced-motion`.
 */
export function useCarousel(
  count: number,
  {intervalMs = 6000, autoAdvance = true}: UseCarouselOptions = {},
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const canLoop = count > 1;

  const goTo = useCallback(
    (index: number) => {
      if (!count) return;
      setActiveIndex((index + count) % count);
    },
    [count],
  );

  const next = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
  const prev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

  // Keep the index valid if the slide count shrinks.
  useEffect(() => {
    setActiveIndex((index) => (count ? index % count : 0));
  }, [count]);

  useEffect(() => {
    if (!autoAdvance || !canLoop || paused) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % count);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [autoAdvance, canLoop, count, intervalMs, paused]);

  return {
    activeIndex,
    setActiveIndex,
    goTo,
    next,
    prev,
    paused,
    setPaused,
    canLoop,
  };
}
