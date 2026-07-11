import type {Route} from './+types/($locale)';
import {localeMatchesPrefix} from '~/lib/i18n';

export async function loader({params}: Route.LoaderArgs) {
  if (params.locale && !localeMatchesPrefix(params.locale)) {
    throw new Response(null, {status: 404});
  }

  return null;
}
