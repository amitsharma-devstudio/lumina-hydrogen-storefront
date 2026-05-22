const CheckIcon = () => (
  <svg
    className="h-5 w-5 flex-shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export function ProductBenefitsList({benefits}: {benefits: string[]}) {
  if (!benefits.length) return null;

  return (
    <ul className="flex flex-col gap-3" role="list">
      {benefits.map((text) => (
        <li key={text} className="flex items-center gap-3 text-sm text-gray-600">
          <CheckIcon />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
