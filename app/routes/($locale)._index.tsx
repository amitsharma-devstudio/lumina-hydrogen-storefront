import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale)._index';
import {HomeHero} from '~/components/home/HomeHero';
import {HomeFeatures} from '~/components/home/HomeFeatures';
import {HomeNewsletter} from '~/components/home/HomeNewsletter';
import {HomeCollections} from '~/components/home/HomeCollections';
import {HomeBestsellers} from '~/components/home/HomeBestsellers';
import {HomeNewArrivals} from '~/components/home/HomeNewArrivals';
import {loadHomepageData} from '~/lib/homepageLoader';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader({context}: Route.LoaderArgs) {
  return loadHomepageData(context.storefront);
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="home">
      <HomeHero hero={data.hero} />
      <HomeBestsellers products={data.bestsellers} />
      <HomeCollections collections={data.curatedCollections} />
      <HomeNewArrivals products={data.newArrivals} />
      <HomeFeatures />
      <HomeNewsletter />
    </main>
  );
}
