# Lumina Hydrogen — Showcase Readiness Checklist

Living checklist for taking the storefront from "feature-complete demo" to
"client-ready showcase." Scope = steps 2–4 of the readiness plan (funnel,
performance/analytics/consent/SEO, and enterprise trust). Sanity is **in scope**
as the headless content layer.

Legend: `[x]` done · `[~]` partially done (needs finishing/verification) · `[ ]` to do

---

## Prerequisites (do first — unblocks everything)

- [x] Fix `npm run codegen` (`concurrency=0` crash) so GraphQL types regenerate
- [x] `npm run typecheck` to **zero** errors
  - [x] `app/lib/skincare.ts`
  - [x] `app/lib/loadRoutineBundles.ts`
  - [x] `app/routes/($locale).cart.tsx`
  - [x] `app/routes/($locale).collections._index.tsx`
  - [x] `app/components/search/SearchField.tsx`
- [x] `.gitignore` entries for `.DS_Store` and `tsconfig.tsbuildinfo`
- [x] Include `app/graphql/**` in codegen document glob (was excluded since scaffold)

---

## Step 2 — Complete the commerce funnel

### 2.1 Checkout handoff
- [x] Verify cart → Shopify Checkout redirect (`checkoutUrl`) works end-to-end
- [x] Confirm `PUBLIC_CHECKOUT_DOMAIN` set; checkout inherits buyer identity/locale
- [x] Empty-cart state + continue-shopping path

### 2.2 Customer accounts (routes scaffolded: `account.*`)
- [~] Customer Account API OAuth login/logout/authorize — UI wired; live OAuth deferred to `lumina.karwa.io` deploy (Headless callback URLs; no Hydrogen sales channel on current plan)
- [x] Orders list + order detail render real data (themed; live data after OAuth on deploy)
- [x] Profile + addresses (add/edit/delete/default) (themed; live mutations after OAuth on deploy)
- [x] Re-theme account pages to Lumina design
- [x] Header account entry point (login vs "my account" when `isLoggedIn`)

### 2.3 Predictive/instant search (backend done in `search.tsx`)
- [x] Regular + predictive search queries/fetchers
- [x] Wire header search to predictive endpoint (inline header field + suggestion panel)
- [x] Fix `SearchField.tsx` ref type error
- [x] Keyboard nav (↑/↓/enter), recent searches — Escape/close + arrow-key highlight; recent searches deferred
- [x] `/search` results page polished with catalog card style

### 2.4 Finish the homepage (sections commented out in `_index.tsx`)
- [ ] Re-enable + finalize: `HomeCollections`, `HomeBestsellers`, `HomeRoutineTeaser`,
      `HomeSocialProof`, `HomeFeatures`, `HomeNewsletter`
- [ ] Confirm each pulls real data and is responsive

### 2.5 Cart conversion features
- [x] Discount code + gift card UI (action already supports both)
- [x] Free-shipping progress bar / threshold nudge
- [x] Cross-sell / "complete your routine" upsell in cart

---

## Step 3 — Performance, analytics, consent, SEO

### 3.1 Analytics (Provider + Product/Collection/Search views done)
- [x] `Analytics.Provider` in root; `ProductView`, `CollectionView`, `SearchView`
- [x] Add `Analytics.CartView`; cart mutations return `analytics.cartId` (add/update/remove auto via Provider + `cart.updatedAt`)
- [~] Confirm events reach Shopify analytics (network check in browser / Admin)

### 3.2 Consent (wired in `root.tsx`)
- [x] Consent config present; Shopify privacy banner enabled (`withPrivacyBanner: true`)
- [x] Banner localized via storefront `country` / `language`
- [~] Gate analytics on consent — handled by Hydrogen `Analytics.Provider` + Customer Privacy API (verify in browser)

### 3.3 SEO (per-route `meta`, sitemap.xml + robots.txt done)
- [x] Per-route `meta`, `sitemap.xml`, `robots.txt`
- [x] JSON-LD: `Product` (PDP), `BreadcrumbList` (PDP + collection), `Organization`/`WebSite` (home)
- [x] Canonical URLs + Open Graph / Twitter cards (shared `buildSeoMeta` helper)
- [x] Dynamic `<html lang>` from storefront locale

### 3.4 Performance / Core Web Vitals
- [x] Cache-strategy audit — `CacheLong` on home/metaobjects/collections index; `CacheShort` on PDP, PLP, catalog, search
- [x] Image audit: LCP `fetchPriority`/`eager` on hero, promo, PDP gallery; first 8 PLP cards eager
- [x] Font loading strategy — system stack only (no custom webfont; N/A for preload/`font-display`)
- [~] Lighthouse pass Home + PDP + PLP — run manually after deploy / local baseline (capture before/after)

---

## Step 4 — i18n/markets, CSP, resilience, a11y

### 4.1 i18n / Markets (path-prefix scaffold in `lib/i18n.ts`)
- [~] URL path-prefix locale parsing
- [ ] Define supported markets/locales; country + language selector UI
- [ ] All internal `Link`s respect `pathPrefix` (localized routing)
- [ ] Currency/price per market; `hreflang` alternate tags

### 4.2 CSP (baseline `createContentSecurityPolicy` in `entry.server.tsx`)
- [x] Baseline CSP with nonce
- [ ] Directives for third parties (Sanity image CDN, fonts, analytics)
- [ ] Zero CSP violations across pages

### 4.3 Error handling & resilience
- [x] Branded root `ErrorBoundary` (Lumina `ErrorPage` for 404 / 500)
- [x] Catch-all unknown routes throw 404 into branded boundary
- [x] Loading skeletons for streamed footer + cart aside (`Skeleton` / grid placeholders)

### 4.4 Accessibility
- [x] Skip-to-content link; visible focus states (`SkipToContent`, `#main-content`, global `:focus-visible`)
- [x] ARIA/keyboard for carousels, filters, search, cart drawer (↑/↓/Enter search; Escape drawers; carousel arrows)
- [x] Color-contrast pass on clay palette (muted foreground + cart/search supporting text); axe/Lighthouse optional verify

---

## Sanity (headless content — in scope)
- [ ] Create Sanity client in `context.ts` `additionalContext` (CMS placeholder present)
- [ ] Model at least one content type (e.g. editorial/landing block)
- [ ] Render one Sanity-backed page/section in the showcase
- [ ] Add Sanity image/CDN domains to CSP

---

## Suggested order
1. Prerequisites (green codegen/typecheck)
2. Step 2 funnel
3. Step 3 perf/analytics/consent/SEO
4. Step 4 i18n/markets → CSP → error/skeletons → a11y
