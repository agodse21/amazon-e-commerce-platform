import { type ClassValue, clsx } from 'clsx';
import type { SyntheticEvent } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: string | number): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDiscount = (
  price: string | number,
  originalPrice: string | number
): number => {
  const p = typeof price === 'string' ? parseFloat(price) : price;
  const o = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;
  if (o <= p) return 0;
  return Math.round(((o - p) / o) * 100);
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
};

/** Inline SVG — never fails to load (avoids onError infinite loops). */
export const PRODUCT_IMAGE_PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">' +
      '<rect fill="#f3f4f6" width="400" height="400"/>' +
      '<text x="200" y="200" text-anchor="middle" dominant-baseline="middle" fill="#9ca3af" font-family="system-ui,sans-serif" font-size="16">No image</text>' +
      '</svg>'
  );

export const getPrimaryImage = (images: { url: string; isPrimary: boolean }[]): string => {
  const primary = images.find((i) => i.isPrimary);
  return primary?.url ?? images[0]?.url ?? PRODUCT_IMAGE_PLACEHOLDER;
};

/** Set once — prevents onError → broken fallback → onError loops. */
export const handleProductImageError = (e: SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.dataset.fallback === 'true') return;
  img.dataset.fallback = 'true';
  img.onerror = null;
  img.src = PRODUCT_IMAGE_PLACEHOLDER;
};

export const renderStars = (rating: string | number): string => {
  const r = typeof rating === 'string' ? parseFloat(rating) : rating;
  const full = Math.floor(r);
  const half = r % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
};
