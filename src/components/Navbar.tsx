/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Heart, 
  ShoppingCart, 
  Settings, 
  Menu, 
  X, 
  Info, 
  Contact, 
  ShoppingBag 
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: () => void;
  logoText: string;
}

export default function Navbar({
  currentTab,
  onNavigate,
  cartCount,
  wishlistCount,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  logoText
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  const navItems = [
    { label: 'Home', tab: 'home' },
    { label: 'Shop All', tab: 'shop' },
    { label: 'About', tab: 'about' },
    { label: 'Contact', tab: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-[#0A0A0F]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Wordmark */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex cursor-pointer items-center space-x-2 transition hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#0066FF] to-[#FF6B00] p-1 text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]">
            <Zap className="h-5 w-5 fill-white text-white" />
          </div>
          <span className="font-display text-xl font-black tracking-tight text-white sm:text-2xl">
            {logoText.split(' ')[0]}
            <span className="text-[#FF6B00]"> {logoText.split(' ').slice(1).join(' ')}</span>
          </span>
        </div>

        {/* Dynamic Desktop Search Bar */}
        <div className="hidden max-w-md flex-1 px-8 md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search genuine electronics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="w-full rounded-full border border-gray-800 bg-[#12121A] py-1.5 pl-4 pr-10 text-sm text-gray-200 placeholder-gray-500 transition focus:border-[#0066FF] focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
            />
            <button 
              onClick={onSearchSubmit}
              type="button"
              className="absolute right-0 top-0 flex h-full w-10 items-center justify-center rounded-r-full text-gray-400 hover:text-[#0066FF]"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Desktop Links & Action Icons */}
        <div className="hidden items-center space-x-6 md:flex">
          <nav className="flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => onNavigate(item.tab)}
                className={`text-sm font-medium transition cursor-pointer hover:text-[#0066FF] ${
                  currentTab === item.tab ? 'text-[#0066FF]' : 'text-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="h-4 w-px bg-gray-800"></div>

          {/* Icon actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative rounded-full p-2 text-gray-400 transition hover:bg-gray-900 hover:text-rose-500 cursor-pointer"
              title="Wishlist"
            >
              <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative rounded-full p-2 text-gray-400 transition hover:bg-gray-900 hover:text-[#0066FF] cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingCart className={`h-5 w-5 ${cartCount > 0 ? 'text-[#0066FF]' : ''}`} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF6B00] text-[10px] font-bold text-white shadow-[0_0_5px_rgba(255,107,0,0.5)]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Console */}
            <button
              onClick={() => onNavigate('admin')}
              className={`rounded-full p-2 transition cursor-pointer ${
                currentTab === 'admin' 
                  ? 'bg-[#0066FF]/20 text-[#0066FF]' 
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
              title="Admin Panel"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Header elements (Search button, Cart, Menu) */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Wishlist Mobile shortcut */}
          <button
            onClick={() => onNavigate('wishlist')}
            className="relative rounded-full p-2 text-gray-400 transition hover:text-[#0066FF] cursor-pointer"
          >
            <Heart className={`h-5.5 w-5.5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Mobile shortcut */}
          <button
            onClick={() => onNavigate('cart')}
            className="relative rounded-full p-2 text-gray-400 transition hover:text-[#0066FF] cursor-pointer"
          >
            <ShoppingCart className={`h-5.5 w-5.5 ${cartCount > 0 ? 'text-[#0066FF]' : ''}`} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF6B00] text-[9px] font-weight-900 text-white leading-none">
                {cartCount}
              </span>
            )}
          </button>

          {/* Expand Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition hover:bg-gray-900 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-900 bg-[#0A0A0F] py-4 px-4 transition md:hidden animate-fade-in">
          {/* Search Bar */}
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search genuine electronics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="w-full rounded-lg border border-gray-800 bg-[#12121A] py-2 pl-3 pr-10 text-sm text-gray-200 placeholder-gray-500 focus:border-[#0066FF] focus:outline-none"
            />
            <button 
              onClick={() => {
                onSearchSubmit();
                setMobileMenuOpen(false);
              }}
              className="absolute right-0 top-0 flex h-full w-10 items-center justify-center rounded-r-lg text-gray-400"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => {
                  onNavigate(item.tab);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium cursor-pointer ${
                  currentTab === item.tab 
                    ? 'bg-[#0066FF]/10 text-[#0066FF]' 
                    : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {item.label}
              </button>
            ))}

            <div className="h-px bg-gray-900 my-2"></div>

            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium cursor-pointer ${
                currentTab === 'admin' 
                  ? 'bg-orange-500/10 text-orange-500' 
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings & Admin CRUD
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
