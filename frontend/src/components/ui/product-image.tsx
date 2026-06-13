import { getPrimaryImage, handleProductImageError, PRODUCT_IMAGE_PLACEHOLDER } from '@/lib/utils';

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Direct image URL */
  src?: string;
  /** Product image list — used when `src` is omitted */
  images?: { url: string; isPrimary: boolean }[];
  alt: string;
}

export function ProductImage({ src, images, alt, loading = 'lazy', ...props }: ProductImageProps) {
  const resolvedSrc =
    src ?? (images && images.length > 0 ? getPrimaryImage(images) : PRODUCT_IMAGE_PLACEHOLDER);

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading={loading}
      onError={handleProductImageError}
      {...props}
    />
  );
}
