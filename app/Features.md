// What's needed to showcase architect skills:

// 1. Shopify Storefront API Integration
- GraphQL query examples
- Product, Collection, Cart mutations
- Checkout flow integration
- Customer authentication

// 2. Advanced Architecture
- Next.js/Nuxt/Remix framework usage
- Server-side rendering (SSR)
- Static site generation (SSG)
- Edge functions for personalization
- CDN strategy

// 3. Data Management
- Apollo Client / URQL
- Optimistic UI updates
- Cache invalidation strategies
- Real-time inventory sync

// 4. Advanced Features
- Product recommendations engine
- Dynamic pricing
- Multi-currency support
- Internationalization (i18n)
- A/B testing framework
- Analytics integration

// 5. Performance
- Image optimization (Next/Image, Cloudinary)
- Lazy loading strategies
- Code splitting
- Web Vitals tracking

// Custom Shopify Functions for:
1. Cart validation (conflict detection)
2. Product recommendations (compatibility-based)
3. Dynamic bundling (routine sets)

// Define in Shopify Admin or via API:

Product Metafields:
├─ luxe.hero_claim (single_line_text_field)
├─ luxe.routine_step (single_line_text_field)  
├─ luxe.compatibility_good (list.single_line_text_field)
├─ luxe.compatibility_bad (list.single_line_text_field)
├─ luxe.routine_am (list.single_line_text_field)
├─ luxe.routine_pm (list.single_line_text_field)
└─ luxe.conflict_ingredients (list.single_line_text_field)


WOW Factor
AI-powered skin analysis (via API)
Real-time inventory sync visualization
Progressive quiz builder (product recommendations)
Virtual try-on integration
Subscription management flow

Midnight Reset Retinol

    SEO Title: Midnight Reset Retinol | Overnight Resurfacing Treatment | Lumina

    Description (HTML): ```html <p>An overnight <strong>architectural treatment</strong> designed to accelerate cellular turnover. This 1% Retinol formula resurfaces texture while you sleep, fading fine lines and hyperpigmentation.</p> <ul> <li>Reduces the appearance of pores</li> <li>Stimulates collagen production</li> </ul>

    Metafield: Usage Window: PM

    Metafield: Requires SPF: True

    Metafield: Step Order: 3

    Metafield: Hero Ingredients: Link to Metaobject: Retinol

    Metafield: Conflicts: Link to Product: Morning Glow Vitamin C

2. Morning Glow Vitamin C

    SEO Title: Morning Glow Vitamin C | 15% Antioxidant Brightening Serum | Lumina

    Description (HTML): ```html <p>Wake up your complexion with a <strong>potent antioxidant shield</strong>. This 15% L-Ascorbic Acid serum neutralizes free radicals and brightens dark spots for an instant, lit-from-within radiance.</p>

    Metafield: Usage Window: AM

    Metafield: Requires SPF: True

    Metafield: Step Order: 3

    Metafield: Hero Ingredients: Link to Metaobject: Vitamin C

    Metafield: Conflicts: Link to Product: Midnight Reset Retinol

3. Cloud Drench Moisturizer

    SEO Title: Cloud Drench Moisturizer | Deep Hyaluronic Hydration | Lumina

    Description (HTML): ```html <p>A moisture-locking cream with a <strong>weightless, whipped texture</strong>. Formulated with three molecular weights of Hyaluronic Acid to hydrate deep layers of the skin without feeling heavy.</p>

    Metafield: Usage Window: Both

    Metafield: Requires SPF: False

    Metafield: Step Order: 4

    Metafield: Hero Ingredients: Link to Metaobject: Hyaluronic Acid

    Metafield: Conflicts: Leave Empty

4. pH Balance Milky Cleanser

    SEO Title: pH Balance Milky Cleanser | Gentle Barrier-Safe Wash | Lumina

    Description (HTML): ```html <p>Gently remove impurities while keeping the skin barrier <strong>perfectly intact</strong>. This non-foaming milk cleanser uses botanical lipids to dissolve makeup and SPF without stripping natural oils.</p>

    Metafield: Usage Window: Both

    Metafield: Requires SPF: False

    Metafield: Step Order: 1

    Metafield: Hero Ingredients: Link to Metaobject: Glycerin

    Metafield: Conflicts: Leave Empty

5. Mineral Shield SPF 50

    SEO Title: Mineral Shield SPF 50 | Invisible Mineral Protection | Lumina

    Description (HTML): ```html <p>Your daily <strong>invisible armor</strong>. A 100% mineral sunscreen that leaves zero white cast. It protects against UVA/UVB rays and blue light while providing a satin, primer-like finish.</p>

    Metafield: Usage Window: AM

    Metafield: Requires SPF: False

    Metafield: Step Order: 5

    Metafield: Hero Ingredients: Link to Metaobject: Zinc Oxide

    Metafield: Conflicts: Leave Empty