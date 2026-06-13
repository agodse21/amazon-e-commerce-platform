import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// DATABASE_URL lives in repo-root .env (see backend/package.json prisma scripts)
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const prisma = new PrismaClient();

const DUMMYJSON_BASE = 'https://dummyjson.com';
const INR_RATE = 83; // USD → approximate INR for display

// ─── DummyJSON API types ─────────────────────────────────────────────────────

interface DummyJsonCategory {
  slug: string;
  name: string;
  url: string;
}

interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: { width: number; height: number; depth: number };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  tags?: string[];
  thumbnail: string;
  images: string[];
  reviews?: { rating: number }[];
}

interface DummyJsonProductsResponse {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);

const productSlug = (p: DummyJsonProduct) => `dj-${p.id}-${slugify(p.title)}`;

const toInr = (usd: number) => Math.round(usd * INR_RATE);

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`DummyJSON request failed (${res.status}): ${url}`);
  }
  return res.json() as Promise<T>;
};

const fetchAllProducts = async (): Promise<DummyJsonProduct[]> => {
  const first = await fetchJson<DummyJsonProductsResponse>(
    `${DUMMYJSON_BASE}/products?limit=100&skip=0`
  );
  const all = [...first.products];

  if (first.total > first.products.length) {
    const second = await fetchJson<DummyJsonProductsResponse>(
      `${DUMMYJSON_BASE}/products?limit=100&skip=100`
    );
    all.push(...second.products);
  }

  return all.slice(0, first.total);
};

const buildSpecs = (p: DummyJsonProduct) => {
  const specs: { key: string; value: string }[] = [];

  if (p.brand) specs.push({ key: 'Brand', value: p.brand });
  if (p.sku) specs.push({ key: 'SKU', value: p.sku });
  if (p.weight != null) specs.push({ key: 'Weight', value: `${p.weight} g` });
  if (p.dimensions) {
    const { width, height, depth } = p.dimensions;
    specs.push({ key: 'Dimensions', value: `${width} × ${height} × ${depth} cm` });
  }
  if (p.warrantyInformation) specs.push({ key: 'Warranty', value: p.warrantyInformation });
  if (p.shippingInformation) specs.push({ key: 'Shipping', value: p.shippingInformation });
  if (p.availabilityStatus) specs.push({ key: 'Availability', value: p.availabilityStatus });
  if (p.tags?.length) specs.push({ key: 'Tags', value: p.tags.join(', ') });

  return specs;
};

const uniqueImages = (p: DummyJsonProduct): string[] => {
  const urls = [...(p.images ?? []), p.thumbnail].filter(Boolean);
  return [...new Set(urls)];
};

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱  Seeding from DummyJSON API…\n');

  const [categories, products] = await Promise.all([
    fetchJson<DummyJsonCategory[]>(`${DUMMYJSON_BASE}/products/categories`),
    fetchAllProducts(),
  ]);

  console.log(`   Fetched ${categories.length} categories, ${products.length} products\n`);

  // Pick a representative thumbnail per category for category hero images
  const categoryThumbnails = new Map<string, string>();
  for (const p of products) {
    if (!categoryThumbnails.has(p.category) && p.thumbnail) {
      categoryThumbnails.set(p.category, p.thumbnail);
    }
  }

  // Clear transactional data that references products (dev seed refresh)
  console.log('   Clearing carts, orders, and old catalog…');
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // ─── Categories (all 24 DummyJSON categories) ─────────────────────────────
  const categoryIdBySlug = new Map<string, number>();

  for (const cat of categories) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        imageUrl: categoryThumbnails.get(cat.slug) ?? null,
      },
    });
    categoryIdBySlug.set(cat.slug, created.id);
    console.log(`   ✓ Category: ${cat.name}`);
  }

  // ─── Products ─────────────────────────────────────────────────────────────
  let created = 0;

  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.category);
    if (!categoryId) {
      console.warn(`   ⚠ Skipping product ${p.id} — unknown category "${p.category}"`);
      continue;
    }

    const priceInr = toInr(p.price);
    const originalPriceInr =
      p.discountPercentage > 0
        ? toInr(p.price / (1 - p.discountPercentage / 100))
        : undefined;

    const reviewCount = Math.max(
      (p.reviews?.length ?? 0) * 847 + p.id * 13,
      12
    );

    const images = uniqueImages(p);
    const specs = buildSpecs(p);
    const slug = productSlug(p);

    await prisma.product.create({
      data: {
        name: p.title,
        slug,
        description: p.description,
        price: priceInr,
        originalPrice: originalPriceInr,
        stock: p.stock,
        ratingAvg: Math.min(5, Math.max(0, Math.round(p.rating * 10) / 10)),
        ratingCount: reviewCount,
        categoryId,
        images: {
          create: images.map((url, i) => ({
            url,
            isPrimary: i === 0,
            displayOrder: i,
          })),
        },
        specifications: { create: specs },
      },
    });

    created++;
  }

  console.log(`\n✅  Seeding complete!`);
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Products:   ${created}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
