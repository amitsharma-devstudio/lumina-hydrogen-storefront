export function ProductRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  if (rating <= 0 || reviewCount <= 0) return null;

  const filledStars = Math.min(5, Math.max(0, Math.round(rating)));

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({length: 5}, (_, index) => (
          <span
            key={index}
            className={
              index < filledStars ? 'text-black' : 'text-neutral-300'
            }
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-gray-600">
        {rating.toFixed(1)} ({reviewCount} reviews)
      </span>
      <span className="sr-only">
        Rated {rating} out of 5 stars based on {reviewCount} reviews
      </span>
    </div>
  );
}
