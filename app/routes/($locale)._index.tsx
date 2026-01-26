import { Hero } from '~/components/home/Hero';
import { FeaturedCollections } from '~/components/home/FeaturedCollections';
import { FeaturedProducts } from '~/components/home/FeaturedProducts';
import { PromoBanner } from '~/components/home/PromoBanner';
import { Newsletter } from '~/components/home/Newsletter';

export default function Home() {
  return (
    <main className="flex flex-col gap-24">
      <Hero />
      <FeaturedCollections />
      <FeaturedProducts />
      <PromoBanner />
      <Newsletter />
    </main>
  );
}
