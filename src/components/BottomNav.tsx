/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Grid, Search, Heart, ShoppingCart } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  openSearchTrigger: () => void;
}

export default function BottomNav({
  currentTab,
  onNavigate,
  cartCount,
  wishlistCount,
  openSearchTrigger
}: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-900 bg-[#0A0A0F]/90 backdrop-blur-lg md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex h-[44px] min-w-[44px] flex-col items-center justify-center rounded-lg text-xs font-medium transition cursor-pointer ${
            currentTab === 'home' ? 'text-[#0066FF]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="mt-1 text-[10px]">Home</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => onNavigate('shop')}
          className={`flex h-[44px] min-w-[44px] flex-col items-center justify-center rounded-lg text-xs font-medium transition cursor-pointer ${
            currentTab === 'shop' ? 'text-[#0066FF]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Grid className="h-5 w-5" />
          <span className="mt-1 text-[10px]">Shop</span>
        </button>

        {/* Search */}
        <button
          onClick={() => {
            onNavigate('shop');
            openSearchTrigger();
          }}
          className="flex h-[48px] min-w-[48px] flex-col items-center justify-center rounded-full bg-gradient-to-tr from-[#0066FF] to-[#0044CC] text-white shadow-lg shadow-[#0066FF]/30 -translate-y-2 cursor-pointer"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Wishlist */}
        <button
          onClick={() => onNavigate('wishlist')}
          className={`flex h-[44px] min-w-[44px] flex-col items-center justify-center rounded-lg text-xs font-medium relative transition cursor-pointer ${
            currentTab === 'wishlist' ? 'text-rose-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
          {wishlistCount > 0 && (
            <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
              {wishlistCount}
            </span>
          )}
          <span className="mt-1 text-[10px]">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => onNavigate('cart')}
          className={`flex h-[44px] min-w-[44px] flex-col items-center justify-center rounded-lg text-xs font-medium relative transition cursor-pointer ${
            currentTab === 'cart' ? 'text-[#0066FF]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF6B00] text-[9px] font-bold text-white">
              {cartCount}
            </span>
          )}
          <span className="mt-1 text-[10px]">Cart</span>
        </button>
      </div>
    </div>
  );
}
