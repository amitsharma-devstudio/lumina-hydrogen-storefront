import type {Route} from './+types/($locale).our-story';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Our Story'}];
};

export default function OurStoryPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-3 text-xs uppercase tracking-[0.15em] text-neutral-500">
          Our Story
        </div>
        <h1 className="text-4xl font-light tracking-tight text-black md:text-5xl">
          Skincare that respects your barrier.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-neutral-600">
          This page is a placeholder while we decide where long-form brand content
          should live (Shopify pages, metaobjects, or a dedicated content
          system). For now, it proves routing and layout while keeping the
          homepage focused on shopping.
        </p>
      </div>
    </main>
  );
}

