# Hydrogen Interview Preparation Notes

## Core Mental Model

The Router is the orchestrator.

```text
User Action
    │
    ▼
Router
    ├── GET  ──► loader() ──► useLoaderData() ──► Component
    └── POST ─► action() ───────────────────────► Response
```

---

# 1. Route + Loader

## Route Module
A route file can contain:
- `loader()`
- `action()`
- React Component
- `ErrorBoundary`
- `meta()`

## Loader Responsibilities
- Runs on the **server**
- Executes **before** component rendering
- Fetches data
- Can access secrets, env vars, Shopify Storefront API
- Returns data to the route component

**Remember**

- Loader fetches.
- Component renders.

---

# 2. useLoaderData()

`useLoaderData()` **does not execute** the loader.

Lifecycle:

```text
Request
   ↓
loader()
   ↓
Return data
   ↓
React renders
   ↓
useLoaderData()
```

Responsibilities:

- Reads loader response
- No `useEffect()` required
- No client-side fetch for initial render

---

# 3. Navigation

Navigation APIs:
- `<Link>`
- `useNavigate()`

Both delegate navigation to the **Router**.

```text
Click Link / navigate()

↓

Router

↓

Match Route

↓

Execute loader()

↓

Render Component
```

Difference:

| `<a>` | `<Link>` |
|--------|----------|
| Full browser reload | Client-side navigation |

---

# 4. Forms & Actions

## GET

```text
GET

↓

loader()

↓

Read Data
```

## POST

```text
POST

↓

action()

↓

Mutation
```

Action responsibilities:

- Form submission
- Login
- Signup
- Cart updates
- Delete / Update

A route can have **both** a loader and an action.

---

# 5. useFetcher()

Purpose:
Perform background requests **without navigation**.

```text
fetcher.submit()

↓

Router

↓

action()

↓

Stay on current page
```

## fetcher.load()

```text
fetcher.load()

↓

Router

↓

loader()

↓

Stay on current page
```

Common use cases:
- Add to Cart
- Update Quantity
- Wishlist
- Apply Coupon
- Search Suggestions
- Infinite Scroll
- Quick View

Fetcher state:

- idle
- submitting
- loading

Useful for:
- Loading buttons
- Spinners
- Optimistic UI

---

# 6. Nested Routes

Parent Route

```text
Header
Sidebar

<Outlet />

Footer
```

Child route renders inside `<Outlet>`.

Example:

```text
/dashboard
    ├── orders
    ├── customers
```

Navigation:

```text
Orders

↓

Customers

Header remains
Sidebar remains
Only Outlet changes
```

## Parent Loader

Shared data:

- Logged-in user
- Sidebar
- Navigation
- Cart
- Theme

## Child Loader

Page-specific data:

- Orders
- Customers
- Products
- Reports

Rule:

> Parent = Shared Data

> Child = Page-specific Data

---

# 7. defer(), Await & Suspense

Problem:

```text
Wait Product

↓

Wait Reviews

↓

Wait Recommendations

↓

Render
```

Better:

```text
Product

↓

Render immediately

↓

Reviews later

↓

Recommendations later
```

Responsibilities:

## defer()

Returns critical data immediately while keeping promises unresolved.

## Await

Waits for one deferred promise.

## Suspense

Displays fallback UI while waiting.

Hydrogen Pattern:

```text
loader()

↓

Await Product

↓

defer(Recommendations)

↓

Render Page

↓

Recommendations appear later
```

---

# Interview Mental Models

## Reading Data

```text
Navigation

↓

Router

↓

loader()

↓

useLoaderData()

↓

Component
```

## Mutating Data

```text
Form

↓

Router

↓

action()

↓

Response
```

## Background Mutation

```text
fetcher.submit()

↓

Router

↓

action()

↓

No Navigation
```

## Streaming

```text
loader()

↓

Critical Data

↓

Render

↓

Deferred Promise

↓

Await

↓

UI Updates
```

---

# Frequently Asked Interview Questions

### What is a loader?

A server-side function executed by the router before rendering to fetch data required by the route.

### What is useLoaderData?

A hook that reads the data returned by the loader.

### Difference between loader and action?

- loader → Read (GET)
- action → Write (POST/PUT/PATCH/DELETE)

### Difference between Form and fetcher.Form?

- Form → Navigation
- fetcher.Form → Background submission

### Why Nested Routes?

Share layouts while keeping page-specific UI and loaders separate.

### Why defer()?

To stream non-critical data and improve perceived performance.

---

# Golden Rule

Everything revolves around the **Router**.

The router:

- Matches routes
- Executes loaders
- Executes actions
- Coordinates navigation
- Coordinates background requests
- Coordinates nested routes
- Coordinates streaming

If you remember one thing before the interview, remember this:

> **The Router is the orchestrator. Every API is simply another way of interacting with it.**
