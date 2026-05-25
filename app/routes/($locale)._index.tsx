import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale)._index';
import {HomeHero} from '~/components/home/HomeHero';
import {HomePromoCarousel} from '~/components/home/HomePromoCarousel';
import {HomeShopBy} from '~/components/home/HomeShopBy';
import {HomeFeatures} from '~/components/home/HomeFeatures';
import {HomeNewsletter} from '~/components/home/HomeNewsletter';
import {HomeCollections} from '~/components/home/HomeCollections';
import {HomeBestsellers} from '~/components/home/HomeBestsellers';
import {HomeNewArrivals} from '~/components/home/HomeNewArrivals';
import {HomeRoutineTeaser} from '~/components/home/HomeRoutineTeaser';
import {HomeSocialProof} from '~/components/home/HomeSocialProof';
import type {CollectionCardCollection} from '~/lib/collectionCoverImage';
import {loadHomepageData} from '~/lib/homepageLoader';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Lumina | Premium Skincare'},
    {
      name: 'description',
      content:
        'Clinical-grade skincare with clean ingredients. Shop serums, moisturizers, and curated collections.',
    },
  ];
};

export async function loader({context}: Route.LoaderArgs) {
  return loadHomepageData(context.storefront);
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="home">
      <HomeHero hero={data.hero} />
      <HomePromoCarousel slides={data.promoSlides} />
      <HomeShopBy />
      <HomeBestsellers products={data.bestsellers} />
      <HomeRoutineTeaser />
      <HomeCollections
        collections={data.curatedCollections as CollectionCardCollection[]}
      />
      <HomeNewArrivals products={data.newArrivals} />
      <HomeSocialProof />
      <HomeFeatures />
      <HomeNewsletter />
    </main>
  );
}
