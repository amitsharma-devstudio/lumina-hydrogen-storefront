/**
 * First focusable control — jumps keyboard users past chrome into main content.
 */
export function SkipToContent({
  targetId = 'main-content',
}: {
  targetId?: string;
}) {
  return (
    <a href={`#${targetId}`} className="skip-to-content">
      Skip to content
    </a>
  );
}
