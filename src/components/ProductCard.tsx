/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { Heart, Star, Phone, Check, RefreshCw } from 'lucide-react';
import { formatBDT, getWhatsAppUrl, buildSingleProductMessage } from '../utils';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onNavigate: (tab: string, slug?: string) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  onAddToCart: (productId: string) => void;
  whatsappNumber: string;
}

export default function ProductCard({
  product,
  onNavigate,
  onToggleWishlist,
  isWishlisted,
  onAddToCart,
  whatsappNumber
}: ProductCardProps) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = buildSingleProductMessage(product, 1);
    const url = getWhatsAppUrl(whatsappNumber, msg);
    window.open(url, '_blank', 'noreferrer,noopener');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.id);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div 
      onClick={() => onNavigate('product', product.slug)}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-[#0E0E15] transition-all duration-300 hover:border-gray-700 hover:shadow-[0_0_20px_rgba(0,102,255,0.15)] cursor-pointer"
    >
      {/* Badges Overlay */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
        {product.inFlashSale && (
          <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            Flash Sale
          </span>
        )}
        {product.isNewArrival && (
          <span className="rounded bg-[#0066FF] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            New
          </span>
        )}
        {product.isBestSeller && (
          <span className="rounded bg-gradient-to-r from-amber-500 to-[#FF6B00] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            Hot
          </span>
        )}
        {discountPercent > 0 && (
          <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
            -{discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Wishlist Heart Overlay */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product.id);
        }}
        className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#12121A]/70 text-gray-300 backdrop-blur-sm transition hover:bg-gray-900 hover:text-rose-500 cursor-pointer"
      >
        <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Product Image Stage */}
      <div className="relative aspect-square overflow-hidden bg-[#161622]">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600'}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-[2px]">
            <span className="rounded border border-red-600 bg-red-950/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-500">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="flex flex-1 flex-col p-3">
        {/* Rating Line */}
        <div className="flex items-center space-x-1 mb-1">
          <div className="flex text-amber-500">
            <Star className="h-3 w-3 fill-amber-500" />
          </div>
          <span className="text-[10px] font-medium text-gray-400">{product.rating}</span>
          <span className="text-[9px] text-gray-600">({product.reviewsCount})</span>
        </div>

        {/* Product Heading */}
        <h3 className="line-clamp-2 h-9 font-sans text-xs font-semibold text-gray-100 group-hover:text-[#0066FF] sm:text-sm">
          {product.name}
        </h3>

        {/* Pricing Segment */}
        <div className="mt-2 flex flex-wrap items-baseline gap-1">
          <span className="font-display text-sm font-bold text-white sm:text-base">
            {formatBDT(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] text-gray-500 line-through sm:text-xs">
              {formatBDT(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center">
          {isOutOfStock ? (
            <span className="inline-flex items-center text-[10px] text-red-500">
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
              Out of stock
            </span>
          ) : (
            <span className="inline-flex items-center text-[10px] text-emerald-500">
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {product.stock <= 4 ? `Only ${product.stock} left!` : 'In Stock'}
            </span>
          )}
        </div>

        {/* Action Triggers Grid */}
        <div className="mt-3 grid grid-cols-5 gap-1.5 pt-1">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="col-span-2 flex h-9 items-center justify-center rounded-lg bg-gray-900 border border-gray-800 text-gray-300 font-medium text-xs transition hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Add to cart"
          >
            + Cart
          </button>
          
          <button
            onClick={handleWhatsAppClick}
            className="col-span-3 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-[11px] uppercase tracking-wider transition duration-300 hover:from-emerald-500 hover:to-teal-400 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            title="Direct Order via WhatsApp"
          >
            <Phone className="h-3 w-3 fill-white" />
            <span>Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
