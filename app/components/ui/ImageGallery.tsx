import {Image} from '@shopify/hydrogen';

type GalleryImage = {url?: string; altText?: string} & Record<string, unknown>;

const thumbButtonClass = (isSelected: boolean) =>
  `relative shrink-0 overflow-hidden rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 ${
    isSelected
      ? 'border-primary shadow-[0_8px_18px_rgba(111,69,48,0.12)]'
      : 'border-[var(--color-home-border)] hover:border-primary'
  }`;

function Thumbnail({
  image,
  index,
  isSelected,
  onSelect,
  className,
}: {
  image: GalleryImage;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`View image ${index + 1}`}
      aria-current={isSelected ? 'true' : undefined}
      className={`${thumbButtonClass(isSelected)} bg-white ${className}`}
    >
      <Image
        data={image}
        aspectRatio="1/1"
        sizes="64px"
        loading="lazy"
        className="h-full w-full object-contain"
      />
    </button>
  );
}

export function ImageGallery({
  images,
  selectedImage,
  onImageSelect,
}: {
  images: GalleryImage[];
  selectedImage: GalleryImage;
  onImageSelect: (image: GalleryImage) => void;
}) {
  if (!images.length) {
    return (
      <div
        className="flex aspect-[4/5] max-h-[min(360px,50vh)] w-full items-center justify-center rounded-xl bg-[var(--color-home-muted)] text-sm text-neutral-500"
        aria-hidden="true"
      >
        No images
      </div>
    );
  }

  const selectedUrl = selectedImage?.url;

  return (
    <div className="w-full">
      <div className="flex gap-3">
        {/* Desktop: vertical thumbnails on the left */}
        <div
          className="hidden max-h-[min(420px,55vh)] shrink-0 flex-col gap-2 overflow-y-auto overscroll-contain pr-0.5 lg:flex"
          role="list"
          aria-label="Product image thumbnails"
        >
          {images.map((image, index) => (
            <Thumbnail
              key={image.url || index}
              image={image}
              index={index}
              isSelected={selectedUrl === image.url}
              onSelect={() => onImageSelect(image)}
              className="h-14 w-14"
            />
          ))}
        </div>

        {/* Main image */}
        <div className="min-w-0 flex-1">
          <div className="relative overflow-hidden rounded-xl border border-[var(--color-home-border)] bg-[var(--color-home-muted)] shadow-[0_18px_46px_rgba(24,21,18,0.07)]">
            <div className="flex aspect-[4/5] max-h-[min(360px,50vh)] w-full items-center justify-center lg:max-h-[min(420px,55vh)]">
              <Image
                data={selectedImage}
                aspectRatio="4/5"
                sizes="(min-width: 1024px) 420px, 100vw"
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: horizontal scroll below main image */}
      <div
        className="mt-3 flex gap-2 overflow-x-auto overscroll-x-contain pb-1 lg:hidden"
        role="list"
        aria-label="Product image thumbnails"
      >
        {images.map((image, index) => (
          <Thumbnail
            key={image.url || index}
            image={image}
            index={index}
            isSelected={selectedUrl === image.url}
            onSelect={() => onImageSelect(image)}
            className="h-12 w-12"
          />
        ))}
      </div>
    </div>
  );
}
