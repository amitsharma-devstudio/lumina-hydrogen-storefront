# Global theme

Design tokens live in **`app/styles/theme.css`**. Tailwind utilities (`bg-primary`, `text-foreground`, etc.) are generated from the `@theme` block.

## Quick changes

| Goal | Edit |
|------|------|
| Brand orange | `--color-brand-500`, `--color-brand-600` |
| Text color | `--color-foreground` |
| Page background | `--color-background` |
| Font stack | `--font-sans`, `--font-display` |

## Buttons in code

Prefer helpers from **`app/lib/theme.ts`**:

- `btnPrimaryClass` — standard CTA
- `btnPrimaryCompactClass` — PDP “Add to bag”
- `btnSecondaryClass` — outline
- `chipSelectedClass` / `chipHoverClass` — variant pills

## Legacy CSS

`app/styles/app.css` uses `:root` variables (`--color-dark`, `--color-light`) mapped to the theme for aside/cart styles.
