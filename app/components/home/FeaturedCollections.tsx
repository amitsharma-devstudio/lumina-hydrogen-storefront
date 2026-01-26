const collections = [
  {id: 1, title: 'Men', image: '/placeholder.jpg'},
  {id: 2, title: 'Women', image: '/placeholder.jpg'},
  {id: 3, title: 'Accessories', image: '/placeholder.jpg'},
];

export function FeaturedCollections() {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <h2 className="text-3xl font-semibold mb-10">
        Shop by Collection
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="group relative aspect-[4/5] bg-neutral-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-neutral-900/20" />
            <span className="absolute bottom-6 left-6 text-xl font-medium text-white">
              {collection.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
