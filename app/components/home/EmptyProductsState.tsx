export function EmptyProductsState({message}: {message: string}) {
  return (
    <p className="text-sm text-neutral-500" role="status">
      {message}
    </p>
  );
}
