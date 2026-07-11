import {useLocation} from 'react-router';
import {buildHreflangHrefs} from '~/lib/i18n';

/**
 * Renders alternate hreflang link tags for supported markets.
 */
export function HreflangLinks({origin}: {origin: string}) {
  const {pathname} = useLocation();
  const links = buildHreflangHrefs(pathname, origin);

  return (
    <>
      {links.map((link) => (
        <link
          key={link.hrefLang}
          rel="alternate"
          hrefLang={link.hrefLang}
          href={link.href}
        />
      ))}
    </>
  );
}
