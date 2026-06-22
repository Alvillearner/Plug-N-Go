/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-gray-900 border border-gray-800">
        <span className="text-sm text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Prime Stage View */}
      <div 
        className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#12121A] border border-gray-800"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={images[activeIndex]}
          alt={`${productName} - Image ${activeIndex + 1}`}
          className={`h-full w-full object-contain transition-transform duration-100 ${
            zoomed ? 'scale-180' : 'scale-100'
          }`}
          style={
            zoomed
              ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
              : undefined
          }
          referrerPolicy="no-referrer"
        />

        {/* Carousel buttons details (Only render if more than 1 image) */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Zoom indicator overlay */}
        <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded bg-black/70 text-gray-400 pointer-events-none">
          <ZoomIn className="h-4 w-4" />
        </div>
      </div>

      {/* Thumbnails Navigation Row */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square w-16 overflow-hidden rounded-lg border bg-[#161622] transition cursor-pointer ${
                activeIndex === i 
                  ? 'border-[#0066FF] ring-1 ring-[#0066FF]' 
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
