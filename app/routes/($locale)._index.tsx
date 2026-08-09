import {useLoaderData} from 'react-router';
import type {Route} from './+types/($locale)._index';
import {HomeHero} from '~/components/home/HomeHero';
import {HomePromoCarousel} from '~/components/home/HomePromoCarousel';
import {HomeFeatures} from '~/components/home/HomeFeatures';
import {HomeNewsletter} from '~/components/home/HomeNewsletter';
import {HomeCollections} from '~/components/home/HomeCollections';
import {HomeBestsellers} from '~/components/home/HomeBestsellers';
import {HomeRoutineTeaser} from '~/components/home/HomeRoutineTeaser';
import {HomeSocialProof} from '~/components/home/HomeSocialProof';
import {
  loadHomepageCriticalData,
  loadHomepageDeferredData,
} from '~/lib/homepageLoader';
import {buildSeoMeta, getRequestOrigin} from '~/lib/seo';
import {
  JsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from '~/components/seo/JsonLd';

const HOME_DESCRIPTION =
  'Clinical-grade skincare with clean ingredients. Shop serums, moisturizers, and curated collections.';

export const meta: Route.MetaFunction = ({data}) => {
  const heroImage = data?.hero?.image;
  return buildSeoMeta({
    title: 'Lumina | Premium Skincare',
    description: HOME_DESCRIPTION,
    url: '/',
    origin: data?.seoOrigin,
    image: heroImage?.url
      ? {
          url: heroImage.url,
          altText: heroImage.altText,
          width: heroImage.width,
          height: heroImage.height,
        }
      : null,
    type: 'website',
  });
};

export async function loader(args: Route.LoaderArgs) {
  const {storefront} = args.context;

  // Start below-the-fold fetches without blocking time to first byte
  const deferredData = loadHomepageDeferredData(storefront);

  // Await hero + promo required for above-the-fold paint and SEO meta
  const criticalData = await loadHomepageCriticalData(storefront);

  return {
    ...deferredData,
    ...criticalData,
    seoOrigin: getRequestOrigin(args.request),
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <main className="home">
      {data.hero ? <HomeHero hero={data.hero} /> : null}
      <HomePromoCarousel slides={data.promoSlides} />
      <HomeRoutineTeaser />
      <HomeCollections collections={data.curatedCollections} />
      <HomeBestsellers products={data.bestsellers} />
      <HomeSocialProof />
      <HomeFeatures />
      <HomeNewsletter />
      <JsonLd data={buildOrganizationJsonLd(data.seoOrigin)} />
      <JsonLd data={buildWebSiteJsonLd(data.seoOrigin)} />
    </main>
  );
}
