import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImage as ProductImageEl } from '@/components/ui/product-image';
import type { ProductImage } from '@/types';

interface ImageCarouselProps {
  images: ProductImage[];
  productName: string;
}

export default function ImageCarousel({ images, productName }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center rounded">
        <span className="text-gray-400">No image</span>
      </div>
    );
  }

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      {/* Main image */}
      <div className="flex-1 relative group order-1 md:order-2 min-w-0">
        <div className="aspect-square border border-gray-100 rounded overflow-hidden flex items-center justify-center">
          <ProductImageEl
            src={images[activeIndex]?.url}
            alt={`${productName} — image ${activeIndex + 1}`}
            className="max-h-full max-w-full object-contain transition-opacity duration-200"
          />
        </div>

        {/* Navigation arrows — always visible on touch, hover on desktop */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-1.5 opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-gray-50"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-1.5 opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-gray-50"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2 md:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === activeIndex ? 'bg-amazon-orange' : 'bg-gray-300'
                }`}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip — horizontal on mobile, vertical on tablet+ */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 order-2 md:order-1 flex-shrink-0 overflow-x-auto md:overflow-x-visible md:overflow-y-auto md:max-h-[32rem] scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`border-2 rounded overflow-hidden aspect-square w-14 h-14 md:w-16 md:h-16 flex-shrink-0 transition-all ${
                i === activeIndex ? 'border-amazon-orange' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <ProductImageEl
                src={img.url}
                alt={`${productName} ${i + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
