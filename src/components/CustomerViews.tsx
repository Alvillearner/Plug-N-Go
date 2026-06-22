/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Star, 
  Trash2, 
  Plus, 
  Minus, 
  Heart, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Check, 
  ShoppingBag, 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Gift, 
  Smartphone, 
  Laptop, 
  Tv, 
  Gamepad2, 
  Home as HomeIcon,
  Search,
  Filter
} from 'lucide-react';
import { Product, Category, Brand, CartItem, Review, AdminSettings, WhatsAppOrder } from '../types';
import { 
  formatBDT, 
  getWhatsAppUrl, 
  buildSingleProductMessage, 
  buildCartOrderMessage 
} from '../utils';
import ProductGallery from './ProductGallery';
import ProductCard from './ProductCard';
import { StockProgressBar } from './FlashSale';

/* ============================================================================
   1. SHOP PAGE (WITH DISCOVER FILTERS)
   ============================================================================ */
interface ShopViewProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  selectedCategorySlug?: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onNavigate: (tab: string, arg?: string) => void;
  onToggleWishlist: (pId: string) => void;
  wishlistIds: string[];
  onAddToCart: (pId: string) => void;
  whatsappNumber: string;
}

export function ShopView({
  products,
  categories,
  brands,
  selectedCategorySlug,
  searchQuery,
  setSearchQuery,
  onNavigate,
  onToggleWishlist,
  wishlistIds,
  onAddToCart,
  whatsappNumber
}: ShopViewProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    selectedCategorySlug 
      ? (categories.find(c => c.slug === selectedCategorySlug)?.id || 'all') 
      : 'all'
  );
  const [activeBrandId, setActiveBrandId] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low' | 'rating'>('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchSearch = searchQuery
        ? prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      const matchCategory = activeCategoryId === 'all' ? true : prod.categoryId === activeCategoryId;
      const matchBrand = activeBrandId === 'all' ? true : prod.brandId === activeBrandId;
      const matchPrice = prod.price >= minPrice && prod.price <= maxPrice;

      return matchSearch && matchCategory && matchBrand && matchPrice;
    }).sort((a, b) => {
      if (sortBy === 'low-high') return a.price - b.price;
      if (sortBy === 'high-low') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // Default Featured
    });
  }, [products, searchQuery, activeCategoryId, activeBrandId, minPrice, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setActiveCategoryId('all');
    setActiveBrandId('all');
    setMinPrice(0);
    setMaxPrice(150000);
    setSortBy('featured');
    setSearchQuery('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Dynamic Header Banner info */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#0F0F1A] to-[#0A0A0F] p-6 border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-white sm:text-3xl">
            Plug In. Power Up. <span className="text-[#0066FF]">Go!</span>
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Configure filters and discover authentic premium gadgets for your setup.
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex h-10 items-center justify-center gap-2 rounded-lg bg-[#12121A] px-4 py-2 border border-gray-800 text-sm font-semibold text-gray-200 hover:bg-gray-900 cursor-pointer"
        >
          <Filter className="h-4 w-4" />
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        
        {/* FILTERS SIDEBAR */}
        <div className={`space-y-6 ${showFilters ? 'block' : 'hidden'} md:block lg:col-span-1`}>
          
          <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-5">
            <div className="flex items-center justify-between border-b border-gray-900 pb-3 mb-4">
              <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wider">Parameters</h3>
              <button 
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-[#FF6B00] hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Category</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setActiveCategoryId('all')}
                  className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
                    activeCategoryId === 'all' 
                      ? 'bg-[#0066FF]/10 text-[#0066FF]' 
                      : 'text-gray-300 hover:bg-gray-900'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] text-gray-600">({products.length})</span>
                </button>
                {categories.map((cat) => {
                  const count = products.filter(p => p.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryId(cat.id)}
                      className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
                        activeCategoryId === cat.id 
                          ? 'bg-[#0066FF]/10 text-[#0066FF]' 
                          : 'text-gray-300 hover:bg-gray-900'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-gray-500">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brands */}
            <div className="mb-6 border-t border-gray-900 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Brands</h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setActiveBrandId('all')}
                  className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
                    activeBrandId === 'all' 
                      ? 'bg-[#0066FF]/10 text-[#0066FF]' 
                      : 'text-gray-300 hover:bg-gray-900'
                  }`}
                >
                  <span>All Brands</span>
                </button>
                {brands.map((b) => {
                  const count = products.filter(p => p.brandId === b.id).length;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setActiveBrandId(b.id)}
                      className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
                        activeBrandId === b.id 
                          ? 'bg-[#0066FF]/10 text-[#0066FF]' 
                          : 'text-gray-300 hover:bg-gray-900'
                      }`}
                    >
                      <span>{b.name}</span>
                      <span className="text-[10px] text-gray-500">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="mb-6 border-t border-gray-900 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Max Price Constraint</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="150000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#0066FF] cursor-pointer"
                />
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>৳ 0</span>
                  <span className="font-bold text-white">{formatBDT(maxPrice)}</span>
                </div>
              </div>
            </div>

            {/* Sorted Selection */}
            <div className="border-t border-gray-900 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Sorting</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full rounded border border-gray-800 bg-[#12121A] px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
              >
                <option value="featured">Featured Items</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="rating">Top Rated Devices</option>
              </select>
            </div>

          </div>

        </div>

        {/* PRODUCTS LIST GRID */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-800 bg-[#0E0E15] py-20 px-4 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-600 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No gadgets match your filters</h3>
              <p className="text-sm text-gray-500 max-w-sm mb-6">
                Try shortening your query keyword or dragging the price slider up for high-end options.
              </p>
              <button 
                onClick={handleResetFilters}
                className="rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 transition cursor-pointer"
              >
                Restore Defaults
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-500 font-medium">
                  Showing <strong className="text-gray-300">{filteredProducts.length}</strong> available results
                </span>
              </div>

              {/* Responsive columns matching the exact rule: exactly 2 grid items on mobile, 3 on desktop! */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onNavigate={onNavigate}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlistIds.includes(p.id)}
                    onAddToCart={onAddToCart}
                    whatsappNumber={whatsappNumber}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


/* ============================================================================
   2. PRODUCT DETAIL PAGE
   ============================================================================ */
interface ProductDetailViewProps {
  productSlug: string;
  products: Product[];
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
  onNavigate: (tab: string, arg?: string) => void;
  onAddToCartWithSpecs: (productId: string, qty: number, variantSpec?: string) => void;
  onToggleWishlist: (pId: string) => void;
  wishlistIds: string[];
  whatsappNumber: string;
}

export function ProductDetailView({
  productSlug,
  products,
  reviews,
  onAddReview,
  onNavigate,
  onAddToCartWithSpecs,
  onToggleWishlist,
  wishlistIds,
  whatsappNumber
}: ProductDetailViewProps) {
  const product = products.find((p) => p.slug === productSlug);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Device Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">The requested electronics product could not be identified.</p>
        <button 
          onClick={() => onNavigate('shop')}
          className="rounded-lg bg-[#0066FF] px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition cursor-pointer"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const [selectedVariant, setSelectedVariant] = useState(product.variants ? product.variants[0] : undefined);
  const [quantity, setQuantity] = useState(1);
  const [customerNote, setCustomerNote] = useState('');
  
  // Reviews fields
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Filter reviews
  const currentProductReviews = reviews.filter((r) => r.productId === product.id);

  const isOutOfStock = product.stock <= 0;

  const handleQtyIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleQtyDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCartWithSpecs(product.id, quantity, selectedVariant);
    alert('Added to Shopping Cart!');
  };

  const handleWhatsAppOrder = () => {
    const rawMsg = buildSingleProductMessage(product, quantity, selectedVariant, customerNote);
    const url = getWhatsAppUrl(whatsappNumber, rawMsg);
    
    // Attempt tracking order locally inside the admin panel
    try {
      const storedOrders = localStorage.getItem('png_orders');
      let orders: WhatsAppOrder[] = storedOrders ? JSON.parse(storedOrders) : [];
      const newOrder: WhatsAppOrder = {
        id: `PNG-ORDER-${Math.floor(1000 + Math.random() * 9000)}`,
        products: [{ name: product.name, qty: quantity, price: product.price, variant: selectedVariant }],
        totalPrice: product.price * quantity,
        orderDate: new Date().toLocaleDateString(),
        customerName: reviewerName || 'Direct Checkout',
        customerPhone: whatsappNumber,
        status: 'Pending'
      };
      localStorage.setItem('png_orders', JSON.stringify([newOrder, ...orders]));
    } catch {
      // safe bypass
    }

    window.open(url, '_blank', 'noreferrer,noopener');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    onAddReview({
      productId: product.id,
      userName: reviewerName,
      rating: reviewRating,
      comment: reviewComment
    });

    setReviewerName('');
    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  // Related products grid filter (same category, exclude current)
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button shortcut */}
      <button
        onClick={() => onNavigate('shop')}
        className="mb-6 flex items-center text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition cursor-pointer"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        <span>Return to Catalog</span>
      </button>

      {/* Main product setup card block */}
      <div className="rounded-2xl border border-gray-800 bg-[#0E0E15] p-4 sm:p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* LEFT: Multi Image Zoom gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* RIGHT: Detail information and Actions */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Badge tags and Heart Wishlist toggle */}
              <div className="flex items-center justify-between mb-3">
                <span className="rounded bg-[#0066FF]/10 text-[#0066FF] px-2.5 py-1 text-xs font-bold uppercase tracking-wider border border-[#0066FF]/30">
                  Genuine product
                </span>
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:text-rose-500 cursor-pointer"
                >
                  <Heart className={`h-5 w-5 ${wishlistIds.includes(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              <h1 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                {product.name}
              </h1>

              {/* Star line */}
              <div className="mt-3 flex items-center space-x-2">
                <div className="flex text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                </div>
                <span className="text-sm font-medium text-gray-100">{product.rating} / 5.0</span>
                <span className="text-xs text-gray-500">({currentProductReviews.length} User Reviews)</span>
              </div>

              {/* Pricing section */}
              <div className="mt-4 flex items-baseline space-x-3 border-y border-gray-900 py-3">
                <span className="font-display text-2xl font-black text-white sm:text-3xl">
                  {formatBDT(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="font-display text-base text-gray-500 line-through">
                    {formatBDT(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="rounded-full bg-emerald-950/40 border border-emerald-600 text-emerald-500 px-2 py-0.5 text-xs font-bold">
                    Save {formatBDT(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              {/* Description summary */}
              <p className="mt-4 text-sm text-gray-400 leading-relaxed font-sans">
                {product.description}
              </p>

              {/* Variant Selectors if any */}
              {product.variants && (
                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Available Specs / Variant</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariant(v)}
                        className={`rounded-lg px-3.5 py-1.5 text-xs font-medium border transition cursor-pointer ${
                          selectedVariant === v
                            ? 'border-[#0066FF] bg-[#0066FF]/10 text-white font-semibold'
                            : 'border-gray-800 text-gray-300 hover:border-gray-700'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Indicator Progress bar */}
              <div className="mt-6">
                {isOutOfStock ? (
                  <div className="rounded-lg bg-red-950/20 border border-red-800/40 p-3 text-red-400 text-xs">
                    This item is closed, currently Out of Stock in our JFP Outlet. Tap contact to request restock alert!
                  </div>
                ) : (
                  <div>
                    <StockProgressBar stock={product.stock} originalCount={20} />
                  </div>
                )}
              </div>

            </div>

            {/* DIRECT BOOKING ACTIONS CARD */}
            {!isOutOfStock && (
              <div className="mt-8 rounded-xl border border-gray-800 bg-[#12121A] p-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Configure Booking</span>
                  <span className="text-[10px] text-gray-500">Fast Express Delivery in Bangladesh</span>
                </div>

                {/* Counter & Direct note */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Items Quantity</label>
                    <div className="flex h-11 w-full max-w-[140px] items-center rounded-lg border border-gray-800 bg-gray-900">
                      <button
                        onClick={handleQtyDecrease}
                        className="flex h-full w-10 items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex-1 text-center text-sm font-semibold text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={handleQtyIncrease}
                        className="flex h-full w-10 items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Optional note</label>
                    <input
                      type="text"
                      placeholder="e.g. Wrap in bubble sheet"
                      value={customerNote}
                      onChange={(e) => setCustomerNote(e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-800 bg-gray-900 px-3 text-xs text-white placeholder-gray-500 focus:border-[#0066FF] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Primary WhatsApp order trigger action button */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="sm:col-span-1 flex h-12 items-center justify-center rounded-lg border border-gray-800 bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800 transition cursor-pointer"
                  >
                    + Shopping Cart
                  </button>
                  
                  <button
                    onClick={handleWhatsAppOrder}
                    className="sm:col-span-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-600/30 transition hover:scale-[1.01] cursor-pointer"
                  >
                    <Phone className="h-4 w-4 fill-white text-white" />
                    <span>Instant Order via WhatsApp</span>
                  </button>
                </div>

                {/* Order request schema representation */}
                <div className="mt-3 flex items-center justify-center space-x-1.5 text-[10px] text-gray-500">
                  <span className="inline-block h-1 w-1 rounded-full bg-emerald-500"></span>
                  <span>Clicking opens wa.me with automatic order parameters</span>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* Specifications list section */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="mt-8 rounded-2xl border border-gray-800 bg-[#0E0E15] p-6">
          <h2 className="font-display text-lg font-black text-white uppercase tracking-wider mb-4">
            Technical Specifications
          </h2>
          <div className="grid grid-cols-1 gap-px bg-gray-900 md:grid-cols-2">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="flex bg-[#0E0E15] py-3 px-4 text-xs">
                <span className="w-1/3 font-bold text-gray-500 uppercase tracking-widest">{key}</span>
                <span className="w-2/3 text-gray-200 font-medium">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Reviews tab */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* LEfT: ADD A REVIEW */}
        <div className="rounded-2xl border border-gray-800 bg-[#0E0E15] p-6 lg:col-span-1">
          <h3 className="font-display text-base font-bold text-white uppercase tracking-wider mb-2">Write Review</h3>
          <p className="text-xs text-gray-400 mb-4">Share your genuine opinion about your plug and adapters.</p>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. S.M. Farhan"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-[#12121A] px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#0066FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Rating</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="text-gray-600 transition hover:scale-110 cursor-pointer"
                  >
                    <Star className={`h-6 w-6 ${reviewRating >= star ? 'fill-amber-500 text-amber-500' : 'text-gray-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Comment</label>
              <textarea
                required
                rows={3}
                placeholder="Review details..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-[#12121A] px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#0066FF] focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#0066FF] py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition cursor-pointer"
            >
              Submit Review
            </button>
          </form>

          {reviewSuccess && (
            <div className="mt-4 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-400 p-2.5 text-center text-xs">
              Thank you for contributing your rating!
            </div>
          )}
        </div>

        {/* RIGHT: REVIEWS LIST */}
        <div className="rounded-2xl border border-gray-800 bg-[#0E0E15] p-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-900 pb-3 mb-4">
            <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">Customer Feeds</h3>
            <span className="text-xs text-gray-500 font-semibold">{currentProductReviews.length} verified ratings</span>
          </div>

          {currentProductReviews.length === 0 ? (
            <div className="py-12 text-center">
              <span className="text-xs text-gray-500">No reviews verified yet for this electronics model. Be the first!</span>
            </div>
          ) : (
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
              {currentProductReviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-gray-900 bg-[#12121A] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-200">{r.userName}</span>
                    <span className="text-[10px] text-gray-500">{r.date}</span>
                  </div>
                  <div className="flex items-center text-xs text-amber-500 mb-1.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    {r.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center space-x-2 border-b border-gray-900 pb-3 mb-6">
            <Sparkles className="h-4 w-4 text-[#FF6B00]" />
            <h2 className="font-display text-lg font-black uppercase text-white tracking-wider">
              Pair with Related gadgets
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigate={onNavigate}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(p.id)}
                onAddToCart={(id) => onAddToCartWithSpecs(id, 1)}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}


/* ============================================================================
   3. WISHLIST PAGE
   ============================================================================ */
interface WishlistViewProps {
  products: Product[];
  wishlistIds: string[];
  onRemoveWishlist: (pId: string) => void;
  onAddToCart: (pId: string) => void;
  onNavigate: (tab: string, arg?: string) => void;
  whatsappNumber: string;
}

export function WishlistView({
  products,
  wishlistIds,
  onRemoveWishlist,
  onAddToCart,
  onNavigate,
  whatsappNumber
}: WishlistViewProps) {
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex items-center space-x-2 border-b border-gray-900 pb-3 mb-8">
        <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
        <h1 className="font-display text-xl font-black text-white uppercase tracking-wider sm:text-2xl">
          Saved Favorites
        </h1>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-800 bg-[#0E0E15] py-20 px-4 text-center">
          <Heart className="h-12 w-12 text-gray-700 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Your saved catalog is vacant</h3>
          <p className="text-xs text-gray-500 max-w-sm mb-6">
            Tap the heart badge on active items to stockpile desired accessories here.
          </p>
          <button 
            onClick={() => onNavigate('shop')}
            className="rounded-lg bg-[#0066FF] px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition cursor-pointer"
          >
            Go To Electronic Shop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {wishlistedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onNavigate={onNavigate}
              onToggleWishlist={onRemoveWishlist}
              isWishlisted={true}
              onAddToCart={onAddToCart}
              whatsappNumber={whatsappNumber}
            />
          ))}
        </div>
      )}
    </div>
  );
}


/* ============================================================================
   4. SHOPPING CART VIEW & MULTI CHECKOUT
   ============================================================================ */
interface CartViewProps {
  cart: CartItem[];
  products: Product[];
  onUpdateQty: (cartId: string, quantity: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  onNavigate: (tab: string, arg?: string) => void;
  whatsappNumber: string;
}

export function CartView({
  cart,
  products,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onNavigate,
  whatsappNumber
}: CartViewProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNote, setOrderNote] = useState('');

  // Hydrate cart data with products
  const cartWithProducts = useMemo(() => {
    return cart.map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      return {
        ...item,
        product: prod!
      };
    }).filter((item) => !!item.product);
  }, [cart, products]);

  const totalBill = useMemo(() => {
    return cartWithProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartWithProducts]);

  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartWithProducts.length === 0) return;

    const finalNote = `Customer: ${customerName || 'PLUG N GO User'}\nPhone: ${customerPhone || 'N/A'}${orderNote ? `\nNote: ${orderNote}` : ''}`;
    const rawMsg = buildCartOrderMessage(cartWithProducts, totalBill, finalNote);
    const url = getWhatsAppUrl(whatsappNumber, rawMsg);

    // Save order details to local admin orders for dashboard analytics
    try {
      const storedOrders = localStorage.getItem('png_orders');
      let orders: WhatsAppOrder[] = storedOrders ? JSON.parse(storedOrders) : [];
      const newOrder: WhatsAppOrder = {
        id: `PNG-ORDER-${Math.floor(1000 + Math.random() * 9000)}`,
        products: cartWithProducts.map(item => ({
          name: item.product.name,
          qty: item.quantity,
          price: item.product.price,
          variant: item.selectedVariant
        })),
        totalPrice: totalBill,
        orderDate: new Date().toLocaleDateString(),
        customerName: customerName || 'Custom Cart',
        customerPhone: customerPhone || 'N/A',
        status: 'Pending'
      };
      localStorage.setItem('png_orders', JSON.stringify([newOrder, ...orders]));
    } catch {
      // safe bypass
    }

    onClearCart();
    window.open(url, '_blank', 'noreferrer,noopener');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex items-center space-x-2 border-b border-gray-900 pb-3 mb-8">
        <ShoppingBag className="h-5 w-5 text-[#0066FF]" />
        <h1 className="font-display text-xl font-black text-white uppercase tracking-wider sm:text-2xl">
          Your Shopping Cart
        </h1>
      </div>

      {cartWithProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-800 bg-[#0E0E15] py-20 px-4 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-700 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Your cart is currently empty</h3>
          <p className="text-xs text-gray-500 max-w-sm mb-6">
            Gather superadapters, fast cords, or mobile setups to proceed to automatic order parsing.
          </p>
          <button 
            onClick={() => onNavigate('shop')}
            className="rounded-lg bg-[#0066FF] px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition cursor-pointer"
          >
            Start Gadget Explore
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* ITEMS LIST COLUMN */}
          <div className="lg:col-span-2 space-y-3">
            {cartWithProducts.map((item) => (
              <div 
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-gray-800 bg-[#0E0E15] p-4 gap-4"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="h-16 w-16 min-w-[64px] overflow-hidden rounded-lg bg-[#161622]">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 
                      onClick={() => onNavigate('product', item.product.slug)}
                      className="text-xs font-bold text-white hover:text-[#0066FF] cursor-pointer line-clamp-1 py-0.5 sm:text-sm"
                    >
                      {item.product.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center mt-1">
                      {item.selectedVariant && (
                        <span className="rounded bg-gray-900 px-2 py-0.5 text-[9px] text-gray-400 border border-gray-800">
                          {item.selectedVariant}
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-[#FF6B00]">
                        {formatBDT(item.product.price)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Counter & Action */}
                <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 border-t sm:border-0 border-gray-900 pt-3 sm:pt-0">
                  <div className="flex h-9 items-center rounded-lg border border-gray-800 bg-gray-900">
                    <button
                      onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                      className="flex h-full w-8 items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQty(item.id, Math.min(item.product.stock, item.quantity + 1))}
                      className="flex h-full w-8 items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <strong className="text-xs text-white uppercase tracking-wider hidden sm:block">
                    {formatBDT(item.product.price * item.quantity)}
                  </strong>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="rounded bg-rose-950/20 border border-rose-900/40 p-2 text-rose-400 hover:bg-rose-900 hover:text-white transition cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center bg-[#0E0E15] rounded-xl border border-gray-800 p-4 mt-2">
              <span className="text-xs text-gray-400">Changed your mind?</span>
              <button 
                onClick={onClearCart}
                className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
              >
                Flush Cart Items
              </button>
            </div>
          </div>

          {/* CHECKOUT BILL & CONTACT PARAMETERS */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-5">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white border-b border-gray-900 pb-3 mb-4">
                Booking Summary
              </h3>

              <div className="space-y-3 pb-4 border-b border-gray-950 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Cart Items qty</span>
                  <span className="font-semibold text-white">{cartWithProducts.length} devices</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Standard Shipping</span>
                  <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Free</span>
                </div>
                <div className="flex justify-between border-t border-gray-900 pt-3 text-sm">
                  <span className="font-bold text-gray-200">Total Bill</span>
                  <strong className="font-display text-[#FF6B00] text-lg font-black">{formatBDT(totalBill)}</strong>
                </div>
              </div>

              {/* AUTOMATED WHATSAPP PARAMETERS FORM */}
              <form onSubmit={handleWhatsAppCheckout} className="mt-5 space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. S.M. Sakib"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-[#12121A] px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:border-[#0066FF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Your Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01712345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-[#12121A] px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:border-[#0066FF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Delivery Address & Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Provide detailed house address..."
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-[#12121A] px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:border-[#0066FF] focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full flex h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01] cursor-pointer"
                >
                  <Phone className="h-4 w-4 fill-white text-white" />
                  <span>Submit Order to WhatsApp</span>
                </button>
              </form>

              <div className="mt-4 flex items-center justify-center space-x-1 border-t border-gray-900 pt-3 text-[10px] text-gray-500 text-center uppercase tracking-wide">
                <span>Free cash delivery and check warranty is guaranteed!</span>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}


/* ============================================================================
   5. ABOUT PAGE
   ============================================================================ */
export function AboutView() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in font-sans">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl font-black text-white sm:text-4xl md:text-5xl uppercase tracking-tight">
          About <span className="text-[#0066FF]">PLUG N GO</span>
        </h1>
        <p className="mt-2 text-sm text-gray-400 max-w-xl mx-auto">
          Bangladeshi tech connoisseurs providing lightning adapters, genuine smart devices & esports gaming peripherals.
        </p>
      </div>

      <div className="space-y-8 text-sm text-gray-300 leading-relaxed">
        
        {/* Banner */}
        <div className="rounded-2xl overflow-hidden aspect-video relative max-h-74 border border-gray-800">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200" 
            alt="Plug N Go Headquarters" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-5">
            <span className="font-display text-white font-bold text-lg">Jamuna Future Park Store — Outlet Plaza</span>
          </div>
        </div>

        {/* Story */}
        <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-6 space-y-4">
          <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-gray-900 pb-2">
            Our Electronics Vision
          </h2>
          <p>
            Founded in Dhaka, <strong>PLUG N GO</strong> is established on a singular core goal: supplying verified original electronics directly to users with immediate automated checkout coordinates. We eradicate intermediate distributors to maintain local Bangladeshi Taka rates as cheap as possible.
          </p>
          <p>
            From high-speed multi-port GaN power matrices to flagship titanium official phones, we pride ourselves on authentic brand representations and hassle-free replacements.
          </p>
        </div>

        {/* Features Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-5">
            <ShieldCheck className="h-8 w-8 text-[#0066FF] mb-3" />
            <h3 className="font-bold text-white text-xs uppercase tracking-wide mb-1">100% Genuine</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Each gadget contains legal manufacturer authentication codes and official warranties.</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-5">
            <Zap className="h-8 w-8 text-[#FF6B00] mb-3" />
            <h3 className="font-bold text-white text-xs uppercase tracking-wide mb-1">Express Delivery</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">Same day immediate packaging within Dhaka. Next day courier tracking for outside cities.</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-5">
            <Phone className="h-8 w-8 text-emerald-500 mb-3" />
            <h3 className="font-bold text-white text-xs uppercase tracking-wide mb-1">WhatsApp Chat</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">Order details format dynamically in your clipboard for immediate conversation processing.</p>
          </div>
        </div>

      </div>
    </div>
  );
}


/* ============================================================================
   6. CONTACT PAGE WITH ADDRESS DETAILS
   ============================================================================ */
export function ContactView({ settings }: { settings: AdminSettings }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in font-sans">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl font-black text-white sm:text-4xl uppercase tracking-tight">
          Reach Our <span className="text-[#FF6B00]">Team</span>
        </h1>
        <p className="mt-2 text-sm text-gray-400 mx-auto max-w-lg">
          Need premium bulk setups or experiencing adapter queries? Ping us direct or visit our physical retail block.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Contact Info list */}
        <div className="space-y-4">
          {/* Outlet location card */}
          <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-5">
            <div className="flex items-start space-x-3.5">
              <div className="rounded-lg bg-[#0066FF]/10 border border-[#0066FF]/30 p-2.5 text-[#0066FF]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Main Retail block</h3>
                <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                  {settings.address}
                </p>
              </div>
            </div>
          </div>

          {/* Operation hours clock */}
          <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-5">
            <div className="flex items-start space-x-3.5">
              <div className="rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/30 p-2.5 text-[#FF6B00]">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Opening Schedules</h3>
                <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                  Everyday (Friday off): 11:30 AM – 8:30 PM (Dhaka UTC+6)
                </p>
              </div>
            </div>
          </div>

          {/* Direct call setup */}
          <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-5">
            <div className="flex items-start space-x-3.5">
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-emerald-500">
                <Phone className="h-5 w-5 fill-emerald-500" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">WhatsApp Line Support</h3>
                <p className="mt-1 text-xs text-gray-400 font-bold">
                  +{settings.whatsappNumber}
                </p>
                <div className="mt-2.5">
                  <a 
                    href={getWhatsAppUrl(settings.whatsappNumber, 'Hello PLUG N GO, I require general customer coordination.')}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center text-xs text-emerald-500 hover:underline font-bold"
                  >
                    <span>Click to Chat</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Social channels card */}
        <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-6 text-center space-y-4">
          <Gift className="h-10 w-10 text-[#0066FF] mx-auto" />
          <h2 className="font-display font-black text-white text-lg uppercase tracking-wider">Social Channels</h2>
          <p className="text-xs text-gray-400">
            Follow PLUG N GO Bangladesh on main channels to view fresh flash sales drop highlights and coupon prizes.
          </p>
          
          <div className="flex justify-center space-x-4 pt-2">
            <a 
              href={settings.facebookLink}
              target="_blank" 
              rel="noreferrer noopener"
              className="flex h-11 items-center space-x-2 rounded-lg bg-gray-900 border border-gray-800 px-4 text-xs font-bold text-gray-300 hover:text-white transition cursor-pointer"
            >
              <Facebook className="h-4 w-4 fill-[#0066FF] text-[#0066FF]" />
              <span>Facebook</span>
            </a>
            
            <a 
              href={settings.instagramLink}
              target="_blank" 
              rel="noreferrer noopener"
              className="flex h-11 items-center space-x-2 rounded-lg bg-gray-900 border border-gray-800 px-4 text-xs font-bold text-gray-300 hover:text-white transition cursor-pointer"
            >
              <Instagram className="h-4 w-4 text-[#FF6B00]" />
              <span>Instagram</span>
            </a>
          </div>

          <div className="pt-3 border-t border-gray-950">
            <span className="text-[10px] text-gray-500 tracking-wide block">
              PLUG N GO — Plug In. Power Up. Go!
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
