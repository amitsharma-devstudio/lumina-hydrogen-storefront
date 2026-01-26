import { CollectionCard } from "../collection/CollectionCard";

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
          <CollectionCard
            key={collection.id}
            title={collection.title}
            image={collection.image}  
          />
        ))}
      </div>
    </section>
  );
}
