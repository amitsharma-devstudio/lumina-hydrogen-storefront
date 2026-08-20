# React Router 7 / Hydrogen Routing & Layout Mental Model

# Goal

This document summarizes the routing and layout discussion to avoid future confusion.

---

# 1. Two Entry Points

There are two different entry points in a Hydrogen application.

## Server entry

`server.ts`

Responsibilities:

- Receives the HTTP request.
- Creates the request context.
- Hands the request to React Router.

Think of it as:

```text
Browser Request
        │
        ▼
    server.ts
        │
        ▼
 React Router
```

---

## UI entry

`app/root.tsx`

Responsibilities:

- Starts rendering the React application.
- Loads global data.
- Renders the application shell.

Think of it as:

```text
server.ts
     │
     ▼
React Router
     │
     ▼
root.tsx
```

---

# 2. Route Matching

React Router does NOT execute a single route.

It matches a hierarchy (tree) of routes.

Example:

URL

```
/
```

Matched hierarchy:

```text
root.tsx
    │
    ▼
($locale).tsx
    │
    ▼
($locale)._index.tsx
```

Example:

```
/search
```

Matched hierarchy:

```text
root.tsx
    │
    ▼
($locale).tsx
    │
    ▼
($locale).search.tsx
```

Example:

```
/products/tee-shirt
```

Matched hierarchy:

```text
root.tsx
    │
    ▼
($locale).tsx
    │
    ▼
($locale).products.$handle.tsx
```

Every matched route can contribute:

- loader()
- action()
- Component
- ErrorBoundary

---

# 3. Current Hydrogen Architecture

The project currently uses a shared React component for layout.

```text
root.tsx
    │
    ▼
PageLayout
    │
    ▼
Outlet
```

Inside `PageLayout`:

```text
Header

Main
   │
   ▼
children (Outlet)

Footer
```

So every page automatically becomes:

```text
Header

Current Page

Footer
```

`PageLayout` is simply a normal React component.

React Router has no special knowledge about it.

---

# 4. Route-based Layout

React Router also supports using a parent route module as the wrapper.

Example:

```tsx
export default function PublicRoute() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
```

Important:

`PublicRoute` is NOT a special layout file.

It is simply another route module that happens to render shared UI around an `<Outlet />`.

Its child routes render inside that outlet.

Example child route:

```tsx
export default function Products() {
  return <ProductsPage />;
}
```

Notice:

The Products route knows nothing about the Header or Footer.

Those are rendered by its parent route.

---

# 5. Is there an architectural difference?

For the UI:

Practically no.

Both approaches render:

```text
Header

Current Page

Footer
```

The difference is ownership.

Current project:

```text
root.tsx
      │
      ▼
PageLayout (React component)
```

Alternative:

```text
root.tsx
      │
      ▼
Parent Route Module
```

In both cases the wrapper is responsible for rendering shared UI.

The parent route version participates in routing and therefore can also have its own loader, action, metadata, etc.

---

# 6. Current Project Mental Model

```text
Browser Request
        │
        ▼
server.ts
        │
        ▼
React Router
        │
        ▼
root.tsx
        │
        ▼
PageLayout
        │
        ▼
Outlet
        │
        ▼
Matched Route
```

---

# 7. Loader Flow

For:

```
/products/tee-shirt
```

Conceptually:

```text
root.loader()

↓

($locale).loader()

↓

products.$handle.loader()
```

Then React Router renders:

```text
PageLayout

↓

Matched Page
```

---

# 8. Important Clarifications

## `root.tsx`

- Not inside `routes/`
- Special root route
- Starts UI rendering

## `($locale).tsx`

In this project it:

- validates locale
- has a loader
- contributes no UI

It is NOT acting as a layout.

## `PageLayout`

- Ordinary React component.
- Wraps every page.
- Renders Header, Outlet, Footer.

---

# 9. Key Takeaways

1. React Router 7 (Framework Mode) uses file-based routing.

2. A URL maps to a hierarchy of matched routes, not a single route.

3. `root.tsx` is the root of the UI tree.

4. The current project uses `PageLayout` as the application shell.

5. `PageLayout` is a normal React component.

6. A route module can also wrap child routes with shared UI by rendering an `<Outlet />`. This is commonly called a layout route, but it is still just a route module.

7. From a rendering perspective, `PageLayout` and a parent route module can serve the same purpose. The primary distinction is whether the wrapper is a regular React component or a route module participating in routing.

