export function SearchSectionHeader({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
}) {
  return (
    <header className="mb-10 md:mb-12">
      <div className="mb-2 text-xs uppercase tracking-[0.15em] text-neutral-500">
        {eyebrow}
      </div>
      <h2
        id={id}
        className="text-3xl font-light tracking-tight text-black md:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-600">
          {description}
        </p>
      ) : null}
    </header>
  );
}
