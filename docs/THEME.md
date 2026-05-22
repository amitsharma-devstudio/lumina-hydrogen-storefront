# Global theme

Design tokens live in **`app/styles/theme.css`**. Tailwind utilities (`bg-primary`, `text-foreground`, etc.) are generated from the `@theme` block.

## Quick changes

| Goal | Edit |
|------|------|
| Brand orange | `--color-brand-500`, `--color-brand-600` |
| Text color | `--color-foreground` |
| Page background | `--color-background` |
| Font stack | `--font-sans`, `--font-display` |

## UI components (preferred)

Use **`app/components/ui/`** so controls stay aligned and themed:

| Component | Use for |
|-----------|---------|
| `Button` | `primary`, `secondary`, `apply`, `link` variants |
| `PrimaryLink` | Checkout / external primary CTAs |
| `Input` | Text, email, etc. (`h-11`) |
| `Select` | Dropdowns |
| `Textarea` | Multi-line text |
| `FormField` | Label + control |
| `InputGroup` | Input + button row (`items-stretch`) |

Low-level class strings live in **`app/lib/theme.ts`** when you need one-off composition.
- `chipSelectedClass` / `chipHoverClass` — variant pills

## Legacy CSS

`app/styles/app.css` uses `:root` variables (`--color-dark`, `--color-light`) mapped to the theme for aside/cart styles.
