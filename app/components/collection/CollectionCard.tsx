import {Image} from '~/components/ui/Image';

type CollectionCardProps = {
  title: string;
  image?: string;
};

export function CollectionCard({title, image}: CollectionCardProps) {
  return (
    <div className="group relative aspect-[4/5] bg-neutral-200 overflow-hidden">
      {image && (
        <Image
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-neutral-900/20" />

      <span className="absolute bottom-6 left-6 text-xl font-medium text-white">
        {title}
      </span>
    </div>
  );
}
