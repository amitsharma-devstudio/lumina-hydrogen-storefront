import { ProductCard } from "~/components/product/ProductCard";

// Sample product data
const products = [
  { id: 1, name: 'Hyaluronic Acid Serum', category: 'Serum', price: 68, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', badge: 'BESTSELLER', rating: 4.8, reviews: 234 },
  { id: 2, name: 'Gentle Foaming Cleanser', category: 'Cleanser', price: 45, image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600', rating: 4.7, reviews: 189 },
  { id: 3, name: 'Retinol Night Cream', category: 'Moisturizer', price: 98, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', badge: 'NEW', rating: 4.9, reviews: 312 },
  { id: 4, name: 'Vitamin C Brightening Serum', category: 'Serum', price: 75, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600', rating: 4.6, reviews: 156 },
  { id: 5, name: 'Hydrating Clay Mask', category: 'Mask', price: 52, image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600', rating: 4.5, reviews: 203 },
  { id: 6, name: 'Niacinamide Serum', category: 'Serum', price: 58, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', badge: 'BESTSELLER', rating: 4.8, reviews: 267 }
];

// FeaturedProducts Section Component
export function FeaturedCollections() {
  const handleQuickAdd = (product) => {
    alert(`Added ${product.name} to cart!`);
    console.log('Quick add:', product);
  };

  return (
    <section className="bg-gray-50 py-20" aria-labelledby="featured-heading">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <header className="mb-16">
          <div className="mb-2 text-xs uppercase tracking-[0.15em] text-gray-500">
            BESTSELLERS
          </div>
          <h2
            id="featured-heading"
            className="text-5xl font-light tracking-tight text-black"
          >
            Our Signature Collection
          </h2>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </div>
      </div>
    </section>
  );
};