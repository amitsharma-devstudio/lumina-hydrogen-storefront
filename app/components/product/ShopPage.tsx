
import { useState } from 'react';
import { ProductCard } from './ProductCard';

// ==================== CONSTANTS ====================
const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'Cleanser', label: 'Cleansers' },
  { id: 'Serum', label: 'Serums' },
  { id: 'Moisturizer', label: 'Moisturizers' },
  { id: 'Mask', label: 'Masks' }
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A-Z' }
];

// Sample products data
const ALL_PRODUCTS = [
  { id: 1, name: 'Hyaluronic Acid Serum', category: 'Serum', price: 68, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', badge: 'BESTSELLER', rating: 4.8, reviews: 234 },
  { id: 2, name: 'Gentle Foaming Cleanser', category: 'Cleanser', price: 45, image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600', rating: 4.7, reviews: 189 },
  { id: 3, name: 'Retinol Night Cream', category: 'Moisturizer', price: 98, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', badge: 'NEW', rating: 4.9, reviews: 312 },
  { id: 4, name: 'Vitamin C Brightening Serum', category: 'Serum', price: 75, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600', rating: 4.6, reviews: 156 },
  { id: 5, name: 'Hydrating Clay Mask', category: 'Mask', price: 52, image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600', rating: 4.5, reviews: 203 },
  { id: 6, name: 'Niacinamide Serum', category: 'Serum', price: 58, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', badge: 'BESTSELLER', rating: 4.8, reviews: 267 },
  { id: 7, name: 'Daily SPF Moisturizer', category: 'Moisturizer', price: 48, image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600', rating: 4.7, reviews: 178 },
  { id: 8, name: 'Peptide Eye Cream', category: 'Moisturizer', price: 89, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', rating: 4.9, reviews: 145 },
  { id: 9, name: 'Exfoliating Toner', category: 'Cleanser', price: 42, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600', rating: 4.6, reviews: 221 },
  { id: 10, name: 'Soothing Sheet Mask', category: 'Mask', price: 38, image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600', rating: 4.5, reviews: 192 },
  { id: 11, name: 'Rich Night Moisturizer', category: 'Moisturizer', price: 82, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', rating: 4.8, reviews: 234 },
  { id: 12, name: 'Purifying Charcoal Mask', category: 'Mask', price: 46, image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600', rating: 4.7, reviews: 167 }
];

// ==================== SUB-COMPONENTS ====================

// Page Header Component
const PageHeader = () => (
  <header className="mb-8">
    <div className="mb-2 text-xs uppercase tracking-[0.15em] text-gray-500">
      SHOP ALL
    </div>
    <h1 className="text-5xl font-light tracking-tight text-black">
      All Products
    </h1>
  </header>
);

// Filter Button Component
const FilterButton = ({ category, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-full border px-6 py-3 text-sm font-normal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
      isActive
        ? 'border-black bg-black text-white'
        : 'border-gray-300 bg-white text-black hover:border-black hover:bg-black hover:text-white'
    }`}
    aria-pressed={isActive}
    aria-label={`Filter by ${category.label}`}
  >
    {category.label}
  </button>
);

// Sort Select Component
const SortSelect = ({ value, onChange }) => (
  <div className="relative">
    <label htmlFor="sort-select" className="sr-only">
      Sort products
    </label>
    <select
      id="sort-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none rounded-full border border-gray-300 bg-white px-6 py-3 pr-10 text-sm font-normal focus:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      aria-label="Sort products by"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
      <svg
        className="h-4 w-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

// Results Count Component
const ResultsCount = ({ count }) => (
  <span className="ml-auto text-sm text-gray-500" aria-live="polite" aria-atomic="true">
    {count} {count === 1 ? 'product' : 'products'}
  </span>
);

// Filters Bar Component
const FiltersBar = ({ 
  activeCategory, 
  onCategoryChange, 
  sortValue, 
  onSortChange, 
  resultsCount 
}) => (
  <div 
    className="mb-8 flex flex-wrap items-center gap-4"
    role="toolbar"
    aria-label="Product filters and sorting"
  >
    {/* Category Filters */}
    <div className="flex flex-wrap gap-4" role="group" aria-label="Category filters">
      {CATEGORIES.map((category) => (
        <FilterButton
          key={category.id}
          category={category}
          isActive={activeCategory === category.id}
          onClick={() => onCategoryChange(category.id)}
        />
      ))}
    </div>

    {/* Sort Dropdown */}
    <SortSelect value={sortValue} onChange={onSortChange} />

    {/* Results Count */}
    <ResultsCount count={resultsCount} />
  </div>
);

// Product Grid Component
const ProductGrid = ({ products, onQuickAdd }) => (
  <div 
    className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    role="list"
    aria-label="Product list"
  >
    {products.map((product) => (
      <div key={product.id} role="listitem">
        <ProductCard product={product} onQuickAdd={onQuickAdd} />
      </div>
    ))}
  </div>
);

// Empty State Component
const EmptyState = ({ onReset }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="mb-6 text-6xl opacity-30" aria-hidden="true">
      🛍️
    </div>
    <h2 className="mb-4 text-3xl font-light text-black">
      No products found
    </h2>
    <p className="mb-8 text-gray-500">
      Try adjusting your filters to find what you're looking for
    </p>
    <button
      onClick={onReset}
      className="rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    >
      Reset Filters
    </button>
  </div>
);

// ==================== MAIN SHOP PAGE COMPONENT ====================

export const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortValue, setSortValue] = useState('featured');

  // Filter products by category
  const getFilteredProducts = () => {
    if (activeCategory === 'all') {
      return ALL_PRODUCTS;
    }
    return ALL_PRODUCTS.filter((product) => product.category === activeCategory);
  };

  // Sort products
  const getSortedProducts = () => {
    const filtered = [...getFilteredProducts()];

    switch (sortValue) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
      default:
        return filtered;
    }
  };

  const displayedProducts = getSortedProducts();

  const handleQuickAdd = (product) => {
    alert(`Added ${product.name} to cart!`);
    console.log('Quick add:', product);
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSortValue('featured');
  };

  return (
    <main className="min-h-screen bg-white py-20">
      <section className="mx-auto max-w-7xl px-6">
        <PageHeader />

        <FiltersBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          sortValue={sortValue}
          onSortChange={setSortValue}
          resultsCount={displayedProducts.length}
        />

        {displayedProducts.length > 0 ? (
          <ProductGrid products={displayedProducts} onQuickAdd={handleQuickAdd} />
        ) : (
          <EmptyState onReset={handleResetFilters} />
        )}
      </section>
    </main>
  );
};

export default ShopPage;