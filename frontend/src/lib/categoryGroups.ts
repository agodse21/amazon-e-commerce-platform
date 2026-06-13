/**
 * Top-level nav groups → DummyJSON category slugs.
 * Keep in sync with `backend/prisma/seed.ts` (DummyJSON categories).
 */
export const CATEGORY_GROUPS = [
  {
    label: 'Electronics',
    slugs: ['laptops', 'smartphones', 'tablets', 'mobile-accessories'],
  },
  {
    label: "Men's",
    slugs: ['mens-shirts', 'mens-shoes', 'mens-watches'],
  },
  {
    label: "Women's",
    slugs: [
      'womens-bags',
      'womens-dresses',
      'womens-jewellery',
      'womens-shoes',
      'womens-watches',
      'tops',
    ],
  },
  {
    label: 'Beauty',
    slugs: ['beauty', 'skin-care', 'fragrances'],
  },
  {
    label: 'Home & Kitchen',
    slugs: ['furniture', 'home-decoration', 'kitchen-accessories', 'groceries'],
  },
  {
    label: 'Sports',
    slugs: ['sports-accessories', 'sunglasses'],
  },
  {
    label: 'Automotive',
    slugs: ['motorcycle', 'vehicle'],
  },
] as const;

export type CategoryGroupLabel = (typeof CATEGORY_GROUPS)[number]['label'];
