import type {Route} from './+types/($locale).$';

/**
 * Unknown paths throw 404 so the root ErrorBoundary can render the branded
 * not-found page (and return the correct status code).
 */
export async function loader({request}: Route.LoaderArgs) {
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

export default function CatchAllPage() {
  return null;
}
