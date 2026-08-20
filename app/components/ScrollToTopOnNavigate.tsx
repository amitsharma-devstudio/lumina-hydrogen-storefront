import {useEffect, useRef} from 'react';
import {useLocation, useNavigationType} from 'react-router';

/**
 * Scroll to top after a forward navigation commits (new page is on screen).
 * Does not scroll during "loading" so the current page does not jump first.
 * Back/forward (POP) is left to <ScrollRestoration>.
 * Same-path search/hash updates (filters, sort) are ignored.
 */
export function ScrollToTopOnNavigate() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === prevPathRef.current) return;
    prevPathRef.current = location.pathname;

    if (navigationType === 'POP') return;

    window.scrollTo({top: 0, left: 0, behavior: 'auto'});
  }, [location.pathname, navigationType]);

  return null;
}
