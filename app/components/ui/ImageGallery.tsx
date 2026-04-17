import { Image } from '@shopify/hydrogen';

type GalleryImage = {url?: string; altText?: string} & Record<string, unknown>;

export const ImageGallery = ({
  images,
  selectedImage,
  onImageSelect,
}: {
  images: GalleryImage[];
  selectedImage: GalleryImage;
  onImageSelect: (image: GalleryImage) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container: Controls exact dimensions */}
      <div className="relative w-full max-w-[500px] overflow-hidden rounded-2xl bg-gray-100">
        <div className="aspect-[3/4]"> 
          <Image
            data={selectedImage}
            // aspectRatio ensures the CDN crops it perfectly to these dimensions
            aspectRatio="3/4" 
            sizes="(min-width: 45em) 500px, 100vw"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Thumbnails: Controls exact small dimensions */}
      <div className="flex gap-3 justify-center sm:justify-start flex-wrap pb-2">
        {images.map((image: GalleryImage, index: number) => (
          <button
            key={image.url || index}
            onClick={() => onImageSelect(image)}
            className={`h-40 w-40 aspect-[4/5] bg-gray-50 mb-6 overflow-hidden flex-shrink-0 overflow-hidden rounded-lg border-2 ${
              selectedImage?.url === image.url ? 'border-black' : 'border-transparent hover:border-black'
            }`}
          >
            <Image
              data={image}
              aspectRatio="1/1"
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};