import type {Route} from './+types/($locale).sitemap.$type.$page[.xml]';
import {getSitemap} from '@shopify/hydrogen';

export async function loader({
  request,
  params,
  context: {storefront},
}: Route.LoaderArgs) {
  const response = await getSitemap({
    storefront,
    request,
    params,
    locales: ['EN-US', 'EN-CA', 'FR-CA'],
    getLink: ({type, baseUrl, handle, locale}) => {
      const path = `${type}/${handle}`;
      // Default market (EN-US) has no path prefix
      if (!locale || locale.toUpperCase() === 'EN-US') {
        return `${baseUrl}/${path}`;
      }
      return `${baseUrl}/${locale}/${path}`;
    },
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}
