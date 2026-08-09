import {useEffect} from 'react';
import {useLocation, useNavigation} from 'react-router';

type HistoryIndexState = {
  idx?: number;
};

/**
 * Scroll to top as soon as a forward navigation to a new path starts.
 * React Router's <ScrollRestoration> waits until loaders finish, which leaves
 * the viewport mid-page until the next screen is ready.
 *
 * Back/forward (history idx going down) is left to ScrollRestoration.
 * Same-path search/hash updates (filters, sort) are ignored.
 */
export function ScrollToTopOnNavigate() {
  const location = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state !== 'loading' || !navigation.location) return;

    const nextPath = navigation.location.pathname;
    if (nextPath === location.pathname) return;

    const currentIdx = (location.state as HistoryIndexState | null)?.idx;
    const nextIdx = (navigation.location.state as HistoryIndexState | null)?.idx;
    if (
      typeof currentIdx === 'number' &&
      typeof nextIdx === 'number' &&
      nextIdx < currentIdx
    ) {
      return;
    }

    window.scrollTo({top: 0, left: 0, behavior: 'auto'});
  }, [navigation.state, navigation.location, location.pathname, location.state]);

  return null;
}
