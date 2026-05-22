import {redirect} from 'react-router';
import type {Route} from './+types/($locale).products._index';

/** Canonical product catalog lives at Shopify's /collections/all. */
export async function loader(_args: Route.LoaderArgs) {
  throw redirect('/collections/all');
}

export default function ProductsIndex() {
  return null;
}
