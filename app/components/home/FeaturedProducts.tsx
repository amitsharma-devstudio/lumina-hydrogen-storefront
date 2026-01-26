const products = [
  {id: 1, title: 'Essential Hoodie', price: '$89'},
  {id: 2, title: 'Classic Jacket', price: '$129'},
  {id: 3, title: 'Minimal Sneakers', price: '$149'},
  {id: 4, title: 'Everyday Tee', price: '$39'},
];

export function FeaturedProducts() {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <h2 className="text-3xl font-semibold mb-10">
        Featured Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl p-4 hover:shadow-lg transition"
          >
            <div className="aspect-square bg-neutral-200 mb-4" />
            <h3 className="font-medium">{product.title}</h3>
            <p className="text-neutral-600">{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
