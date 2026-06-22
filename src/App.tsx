/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  getStoredSettings, 
  saveStoredSettings,
  getStoredProducts, 
  saveStoredProducts,
  getStoredCategories, 
  saveStoredCategories,
  getStoredBrands, 
  saveStoredBrands,
  getStoredBanners, 
  saveStoredBanners,
  getStoredReviews, 
  saveStoredReviews,
  getStoredOrders, 
  saveStoredOrders,
  formatBDT,
  getWhatsAppUrl,
  getStoredCoupons,
  saveStoredCoupons,
  getStoredCustomers,
  saveStoredCustomers,
  getStoredAdminUsers,
  saveStoredAdminUsers,
  getStoredActivityLogs,
  saveStoredActivityLogs
} from './utils';
import { Product, Category, Brand, Banner, AdminSettings, Review, WhatsAppOrder, CartItem, Coupon, Customer, AdminUser, LoginActivityLog } from './types';

// Components
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ProductCard from './components/ProductCard';
import FlashHeader, { StockProgressBar } from './components/FlashSale';
import { 
  ShopView, 
  ProductDetailView, 
  WishlistView, 
  CartView, 
  AboutView, 
  ContactView 
} from './components/CustomerViews';
import AdminPanel from './components/AdminPanel';
import AdminAuth from './components/AdminAuth';
import { Globe, ShieldAlert, Monitor, Terminal, Lock, HelpCircle, HardDriveDownload } from 'lucide-react';

import { 
  Smartphone, 
  Laptop, 
  Tv, 
  Gamepad2, 
  Zap, 
  Home as HomeIcon, 
  Truck, 
  ShieldCheck, 
  Headphones, 
  ChevronRight, 
  Instagram, 
  Facebook, 
  PhoneCall, 
  ChevronLeft 
} from 'lucide-react';

export default function App() {
  // --- CORE STATE PERSISTENE ---
  const [settings, setSettings] = useState<AdminSettings>(() => getStoredSettings());
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());
  const [brands, setBrands] = useState<Brand[]>(() => getStoredBrands());
  const [banners, setBanners] = useState<Banner[]>(() => getStoredBanners());
  const [orders, setOrders] = useState<WhatsAppOrder[]>(() => getStoredOrders());
  const [reviews, setReviews] = useState<Review[]>(() => getStoredReviews());

  // --- NEW RETRO/SOPHISTICATED SERVICES DIRECTORIES STATE ---
  const [coupons, setCoupons] = useState<Coupon[]>(() => getStoredCoupons());
  const [customers, setCustomers] = useState<Customer[]>(() => getStoredCustomers());
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => getStoredAdminUsers());
  const [activityLogs, setActivityLogs] = useState<LoginActivityLog[]>(() => getStoredActivityLogs());

  // --- COMPULSORY MULTI-APPLICATION SANDBOX SELECTOR ---
  const [browserApp, setBrowserApp] = useState<'store' | 'admin'>('store');
  const [browserUrl, setBrowserUrl] = useState<string>('https://www.loyaltech-electronics.com');

  // --- JWT SESSION AND ACCESS STATE METRIC ---
  const [adminSession, setAdminSession] = useState<AdminUser | null>(() => {
    const token = localStorage.getItem('png_jwt_token');
    const roster = getStoredAdminUsers();
    if (token && token.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.session_')) {
      const uid = token.split('session_')[1];
      const match = roster.find(u => u.id === uid);
      if (match) return match;
    }
    return null;
  });

  // --- INTERACTION STATES ---
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Cart & Wishlist structures
  const [cart, setCart] = useState<CartItem[]>(() => {
    const data = localStorage.getItem('png_cart');
    return data ? JSON.parse(data) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const data = localStorage.getItem('png_wishlist');
    return data ? JSON.parse(data) : [];
  });

  // Active banner slide index
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // --- SYNC ENGINE AND MULTI-DEVICE PERSISTENCE HANDLERS ---
  const [isSyncLoaded, setIsSyncLoaded] = useState(false);

  const syncToServer = (key: string, value: any) => {
    if (!isSyncLoaded) return; // Prevent initial double sync
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    })
    .then(async (res) => {
      if (!res.ok) {
        const txt = await res.text();
        console.warn(`[DB-SYNC-ERROR] Refusing backup for key "${key}":`, txt);
      }
    })
    .catch((err) => {
      console.warn(`[DB-SYNC-ERROR] Server offline or disconnected inside sandbox:`, err);
    });
  };

  // Initial pull on boot from server-side JSON database
  useEffect(() => {
    fetch('/api/store-data')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('[DEBUG] Server-side remote database parsed successfully:', data);
        if (data.settings) setSettings(data.settings);
        if (data.products) setProducts(data.products);
        if (data.categories) setCategories(data.categories);
        if (data.brands) setBrands(data.brands);
        if (data.banners) setBanners(data.banners);
        if (data.orders) setOrders(data.orders);
        if (data.reviews) setReviews(data.reviews);
        if (data.coupons) setCoupons(data.coupons);
        if (data.customers) setCustomers(data.customers);
        if (data.adminUsers) setAdminUsers(data.adminUsers);
        if (data.activityLogs) setActivityLogs(data.activityLogs);
        
        // Mark sync ready
        setIsSyncLoaded(true);
      })
      .catch(err => {
        console.error('[ERROR] Central server storage unavailable. Standard off-line state retained:', err);
        // Fallback to offline mode
        setIsSyncLoaded(true);
      });
  }, []);

  // Sync state modifications to disk & central database
  useEffect(() => {
    saveStoredSettings(settings);
    syncToServer('settings', settings);
  }, [settings]);

  useEffect(() => {
    saveStoredProducts(products);
    syncToServer('products', products);
  }, [products]);

  useEffect(() => {
    saveStoredCategories(categories);
    syncToServer('categories', categories);
  }, [categories]);

  useEffect(() => {
    saveStoredBrands(brands);
    syncToServer('brands', brands);
  }, [brands]);

  useEffect(() => {
    saveStoredBanners(banners);
    syncToServer('banners', banners);
  }, [banners]);

  useEffect(() => {
    saveStoredOrders(orders);
    syncToServer('orders', orders);
  }, [orders]);

  useEffect(() => {
    saveStoredReviews(reviews);
    syncToServer('reviews', reviews);
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('png_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('png_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    saveStoredCoupons(coupons);
    syncToServer('coupons', coupons);
  }, [coupons]);

  useEffect(() => {
    saveStoredCustomers(customers);
    syncToServer('customers', customers);
  }, [customers]);

  useEffect(() => {
    saveStoredAdminUsers(adminUsers);
    syncToServer('adminUsers', adminUsers);
  }, [adminUsers]);

  useEffect(() => {
    saveStoredActivityLogs(activityLogs);
    syncToServer('activityLogs', activityLogs);
  }, [activityLogs]);

  // Sync back and forth navigation address updates
  useEffect(() => {
    if (browserApp === 'store') {
      setBrowserUrl('https://www.loyaltech-electronics.com');
    } else {
      setBrowserUrl('https://admin.loyaltech-electronics.com');
    }
  }, [browserApp]);

  // Infinite rotate slider banner timer
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // --- ACTIONS HANDLERS ---
  const handleNavigate = (tab: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentTab(tab);
    if (tab === 'product' && param) {
      setSelectedProductSlug(param);
    } else if (tab === 'shop' && param) {
      setSelectedCategorySlug(param);
    } else {
      setSelectedProductSlug('');
      setSelectedCategorySlug('');
    }
  };

  const handleSearchSubmit = () => {
    handleNavigate('shop');
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleAddToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [
          ...prev, 
          { 
            id: `cart-${Math.random().toString(36).substr(2, 9)}`, 
            productId, 
            quantity: 1 
          }
        ];
      }
    });
  };

  const handleAddToCartWithSpecs = (productId: string, qty: number, variantSpec?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === productId && item.selectedVariant === variantSpec
      );
      if (existing) {
        return prev.map((item) => 
          item.id === existing.id 
            ? { ...item, quantity: item.quantity + qty } 
            : item
        );
      } else {
        return [
          ...prev, 
          { 
            id: `cart-${Math.random().toString(36).substr(2, 9)}`, 
            productId, 
            quantity: qty,
            selectedVariant: variantSpec
          }
        ];
      }
    });
  };

  const handleUpdateCartQty = (id: string, qty: number) => {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleAddReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const r: Review = {
      ...newReview,
      id: `rev-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('sv') // 'YYYY-MM-DD'
    };
    setReviews([r, ...reviews]);
  };

  const handleSliderNext = () => {
    setActiveBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const handleSliderPrev = () => {
    setActiveBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // --- FILTERS PRESETS ---
  const flashSaleProducts = useMemo(() => {
    return products.filter((p) => p.inFlashSale);
  }, [products]);

  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.isFeatured);
  }, [products]);

  const bestSellerProducts = useMemo(() => {
    return products.filter((p) => p.isBestSeller);
  }, [products]);

  const newArrivalProducts = useMemo(() => {
    return products.filter((p) => p.isNewArrival);
  }, [products]);

  // Map Category Lucide Names dynamically helper
  const renderCategoryIcon = (iconName: string) => {
    const props = { className: "h-6 w-6" };
    switch (iconName) {
      case 'Smartphone': return <Smartphone {...props} />;
      case 'Laptop': return <Laptop {...props} />;
      case 'Tv': return <Tv {...props} />;
      case 'Gamepad2': return <Gamepad2 {...props} />;
      case 'Zap': return <Zap {...props} />;
      default: return <Smartphone {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07070B] text-gray-200 selection:bg-[#0066FF] selection:text-white flex flex-col font-sans pb-16 md:pb-0">
      
      {/* 🚀 VIRTUAL DOUBLE-APP ENVIRONMENT CHROME BAR */}
      <header className="bg-[#0A0A0F] border-b border-gray-900 sticky top-0 z-50 select-none">
        
        {/* Browser Tabs top layout */}
        <div className="flex items-center justify-between px-3 pt-2.5 pb-2 bg-black/40 border-b border-gray-950">
          <div className="flex items-center gap-1.5 overflow-hidden">
            
            {/* Storefront Tab Tab */}
            <button
              onClick={() => {
                setBrowserApp('store');
                handleNavigate('home');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition border truncate cursor-pointer ${
                browserApp === 'store'
                  ? 'bg-[#12121A] border-gray-800 text-white shadow-md'
                  : 'bg-transparent border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-900/40'
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-[#0066FF]" />
              <span className="font-display uppercase tracking-wider text-[10px]">🌐 Client Shop UI</span>
            </button>

            {/* Admin Workspace Tab */}
            <button
              onClick={() => setBrowserApp('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition border truncate cursor-pointer ${
                browserApp === 'admin'
                  ? 'bg-[#12121A] border-rose-950/40 text-white shadow-md'
                  : 'bg-transparent border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-900/40'
              }`}
            >
              <Lock className="h-3.5 w-3.5 text-rose-500" />
              <span className="font-display uppercase tracking-wider text-[10px]">🔒 Isolated Admin App</span>
            </button>

          </div>

          {/* Activity countdown indicators */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500 opacity-80"></span>
              <span className="h-2 w-2 rounded-full bg-yellow-500 opacity-80"></span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 opacity-80"></span>
            </div>
          </div>
        </div>

        {/* Address and Command Bar */}
        <div className="px-4 py-2 bg-gradient-to-b from-[#0A0A0F] to-black/80 flex items-center gap-2">
          
          <div className="flex gap-1.5">
            <button 
              onClick={() => {
                setBrowserApp('store');
                handleNavigate('home');
              }}
              className={`p-1.5 rounded-lg border text-gray-505 transition hover:text-white hover:bg-gray-900/60 cursor-pointer ${browserApp === 'store' ? 'border-gray-800' : 'border-transparent'}`}
              title="Return to Shop Storefront"
            >
              <Globe className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => setBrowserApp('admin')} 
              className={`p-1.5 rounded-lg border text-gray-505 transition hover:text-white hover:bg-gray-900/60 cursor-pointer ${browserApp === 'admin' ? 'border-red-950/40' : 'border-transparent'}`}
              title="Access Secured Admin CRM"
            >
              <Lock className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex-1 flex items-center bg-gray-950/90 border border-gray-900 rounded-xl px-3 py-1 text-xs text-gray-400 font-mono">
            <span className="text-emerald-500 mr-1 flex items-center">https://</span>
            <span className="text-white font-bold">{browserApp === 'store' ? 'www.loyaltech-electronics.com' : 'admin.loyaltech-electronics.com'}</span>
          </div>

          <div className="text-[9px] uppercase font-bold text-gray-600 px-2.5 border-l border-gray-900 hidden md:block">
            {browserApp === 'store' ? 'Public Node (Store)' : 'Secure Back-End'}
          </div>

        </div>

      </header>

      {/* RENDER VIEWPORT */}
      {browserApp === 'admin' ? (
        <div className="flex-1 flex flex-col bg-[#0A0A0F] min-h-screen">
          
          {/* SECURE ADMIN ROUTE BARRIER OR AUTH SHIELD */}
          {adminSession ? (
            <AdminPanel
              products={products}
              categories={categories}
              brands={brands}
              banners={banners}
              orders={orders}
              settings={settings}
              coupons={coupons}
              customers={customers}
              adminUsers={adminUsers}
              activityLogs={activityLogs}
              currentUser={adminSession}
              onUpdateProducts={setProducts}
              onUpdateCategories={setCategories}
              onUpdateBrands={setBrands}
              onUpdateBanners={setBanners}
              onUpdateSettings={setSettings}
              onUpdateOrders={setOrders}
              onUpdateCoupons={setCoupons}
              onUpdateCustomers={setCustomers}
              onUpdateAdminUsers={setAdminUsers}
              onUpdateActivityLogs={setActivityLogs}
              onLogout={() => {
                // Log and terminate session
                const logoutLog: LoginActivityLog = {
                  id: `log-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  email: adminSession.email,
                  status: 'Manual Logout',
                  ipAddress: '103.220.145.' + Math.floor(Math.random() * 255),
                  userAgent: window.navigator.userAgent.substring(0, 50),
                  role: adminSession.role
                };
                setActivityLogs(prev => [logoutLog, ...prev]);
                localStorage.removeItem('png_jwt_token');
                setAdminSession(null);
              }}
            />
          ) : (
            <AdminAuth
              onLoginSuccess={(user) => {
                setAdminSession(user);
              }}
              logs={activityLogs}
              onAddLog={(log) => setActivityLogs(prev => [log, ...prev])}
            />
          )}

        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-screen">
          
          {/* Dynamic Header */}
          <Navbar
            currentTab={currentTab}
            onNavigate={handleNavigate}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            wishlistCount={wishlist.length}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            logoText={settings.shopName}
          />

      {/* --- HOMEPAGE VIEW --- */}
      {currentTab === 'home' && (
        <div className="animate-fade-in">
          
          {/* 1. HERO SLIDER BANNER */}
          {banners.length > 0 && (
            <section className="relative h-[280px] sm:h-[420px] lg:h-[480px] w-full bg-black overflow-hidden select-none">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
              
              <div className="relative h-full w-full">
                <img 
                  src={banners[activeBannerIndex]?.imageUrl} 
                  alt={banners[activeBannerIndex]?.title}
                  className="h-full w-full object-cover opacity-60 transition-transform duration-1000 scale-102"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-12 lg:p-16 max-w-4xl">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B00] mb-1">
                    {banners[activeBannerIndex]?.tagline || settings.shopName}
                  </span>
                  <p className="font-display text-xl font-black text-white sm:text-3xl lg:text-4xl leading-tight">
                    {banners[activeBannerIndex]?.title}
                  </p>
                  <p className="mt-2 text-xs text-gray-400 sm:text-sm font-medium">
                    {banners[activeBannerIndex]?.subtitle}
                  </p>
                  <div className="mt-4 sm:mt-6">
                    <button
                      onClick={() => handleNavigate('shop', banners[activeBannerIndex]?.link)}
                      className="inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-[#0066FF] to-blue-700 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white transition hover:scale-101 shadow-lg shadow-[#0066FF]/25 cursor-pointer"
                    >
                      Shop Collection
                    </button>
                  </div>
                </div>
              </div>

              {/* Slider Navigators */}
              {banners.length > 1 && (
                <>
                  <button 
                    onClick={handleSliderPrev}
                    className="absolute left-4 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/95 cursor-pointer"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={handleSliderNext}
                    className="absolute right-4 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/95 cursor-pointer"
                    title="Next Slide"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </section>
          )}

          {/* 2. CATEGORIES BENTO GRID */}
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 border-b border-gray-900 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#0066FF]">Explore blocks</span>
                <h2 className="font-display text-base font-black uppercase text-white tracking-widest sm:text-lg">
                  Shop by Category
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleNavigate('shop', cat.slug)}
                  className="group flex flex-col items-center justify-center rounded-xl border border-gray-800 bg-[#0E0E15] p-3 text-center transition duration-300 hover:border-gray-700 hover:bg-[#12121A]/80 cursor-pointer"
                >
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-[#0066FF]/10 text-[#0066FF] transition group-hover:bg-[#0066FF] group-hover:text-white p-1">
                    {renderCategoryIcon(cat.icon)}
                  </div>
                  <span className="font-sans text-[11px] font-bold text-gray-200 group-hover:text-white">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 3. FLASH SALES DISPLAY WITH TIMER */}
          {flashSaleProducts.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <FlashHeader onSeeAllClick={() => handleNavigate('shop')} />
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                {flashSaleProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="relative flex flex-col justify-between">
                    <ProductCard
                      product={p}
                      onNavigate={handleNavigate}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlist.includes(p.id)}
                      onAddToCart={handleAddToCart}
                      whatsappNumber={settings.whatsappNumber}
                    />
                    <div className="rounded-b-lg border-x border-b border-gray-800 bg-[#0A0A0F] px-3 pb-3">
                      <StockProgressBar stock={p.stock} originalCount={20} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. FEATURED PRODUCTS & CURATED PICKS */}
          {featuredProducts.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-[#0A0A0F]/20">
              <div className="mb-6 border-b border-gray-900 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-amber-500">Premium choices</span>
                  <h2 className="font-display text-base font-black uppercase text-white tracking-widest sm:text-lg">
                    Curated Picks
                  </h2>
                </div>
                <button
                  onClick={() => handleNavigate('shop')}
                  className="text-xs font-bold text-[#0066FF] hover:underline"
                >
                  View Index
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-4">
                {featuredProducts.slice(0, 4).map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onNavigate={handleNavigate}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.includes(p.id)}
                    onAddToCart={handleAddToCart}
                    whatsappNumber={settings.whatsappNumber}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 5. GIGANTIC WHY CHOOSE PLUG N GO BLOCK */}
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-gray-800 bg-[#0E0E15] p-5 sm:p-10">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6B00]">Authorized electronic core</span>
                <p className="font-display font-black text-xl uppercase text-white tracking-tight sm:text-2xl mt-1">
                  Why shop premium with PLUG N GO?
                </p>
                <p className="mt-2 text-xs text-gray-500 font-sans">
                  We guarantee zero mock replicas and instant customized order redirection.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="rounded-xl border border-gray-900 bg-gray-950/20 p-5 space-y-3 flex flex-col items-center text-center">
                  <div className="rounded-full bg-[#0066FF]/10 p-3 text-[#0066FF]">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-xs font-bold uppercase text-white tracking-wide">100% Genuine batch</h3>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Obtained directly from global manufacturers including Apple, Sony, Xiaomi, and Anker with original checking boxes.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-900 bg-gray-950/20 p-5 space-y-3 flex flex-col items-center text-center">
                  <div className="rounded-full bg-[#FF6B00]/10 p-3 text-[#FF6B00]">
                    <Truck className="h-6 w-6" />
                  </div>
                  <h3 className="text-xs font-bold uppercase text-white tracking-wide">Same-day JFP Express</h3>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Order details parse directly in your WhatsApp interface for instant same-day delivery inside corporate Dhaka zones.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-900 bg-gray-950/20 p-5 space-y-3 flex flex-col items-center text-center">
                  <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500">
                    <Headphones className="h-6 w-6" />
                  </div>
                  <h3 className="text-xs font-bold uppercase text-white tracking-wide">Dynamic Support</h3>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Enjoy real person conversation. No automated machine bot filters — just direct, pristine WhatsApp chat coordinate processing.
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* 6. BEST SELLERS */}
          {bestSellerProducts.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="mb-6 border-b border-gray-900 pb-3">
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#FF6B00]">Hottest Gadgets</span>
                <h2 className="font-display text-base font-black uppercase text-white tracking-widest sm:text-lg">
                  Best Selling models
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                {bestSellerProducts.slice(0, 4).map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onNavigate={handleNavigate}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.includes(p.id)}
                    onAddToCart={handleAddToCart}
                    whatsappNumber={settings.whatsappNumber}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 7. NEW ARRIVALS */}
          {newArrivalProducts.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#0A0A0F]/20 rounded-2xl">
              <div className="mb-6 border-b border-gray-900 pb-3">
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#0066FF]">Fresh off the assembly</span>
                <h2 className="font-display text-base font-black uppercase text-white tracking-widest sm:text-lg">
                  New Gadget Arrivals
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                {newArrivalProducts.slice(0, 4).map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onNavigate={handleNavigate}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.includes(p.id)}
                    onAddToCart={handleAddToCart}
                    whatsappNumber={settings.whatsappNumber}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 8. BRAND LOGOS CAROUSEL */}
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 select-none">
            <div className="border-t border-b border-gray-900 py-6 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-6">AUTHORIZED DISTRIBUTORS FOR</span>
              
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                {brands.map((b) => (
                  <div 
                    key={b.id} 
                    onClick={() => handleNavigate('shop')}
                    className="flex h-11 items-center justify-center text-xs tracking-wider transition hover:scale-105 cursor-pointer"
                  >
                    <span className={`px-4 py-1.5 font-sans font-black ${b.logo}`}>
                      {b.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      )}

      {/* --- CUSTOMER SHOP VIEW --- */}
      {currentTab === 'shop' && (
        <ShopView
          products={products}
          categories={categories}
          brands={brands}
          selectedCategorySlug={selectedCategorySlug}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNavigate={handleNavigate}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlist}
          onAddToCart={handleAddToCart}
          whatsappNumber={settings.whatsappNumber}
        />
      )}

      {/* --- PRODUCT DETAIL VIEW --- */}
      {currentTab === 'product' && (
        <ProductDetailView
          productSlug={selectedProductSlug}
          products={products}
          reviews={reviews}
          onAddReview={handleAddReview}
          onNavigate={handleNavigate}
          onAddToCartWithSpecs={handleAddToCartWithSpecs}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlist}
          whatsappNumber={settings.whatsappNumber}
        />
      )}

      {/* --- WISHLIST VIEW --- */}
      {currentTab === 'wishlist' && (
        <WishlistView
          products={products}
          wishlistIds={wishlist}
          onRemoveWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onNavigate={handleNavigate}
          whatsappNumber={settings.whatsappNumber}
        />
      )}

      {/* --- CART VIEW --- */}
      {currentTab === 'cart' && (
        <CartView
          cart={cart}
          products={products}
          onUpdateQty={handleUpdateCartQty}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          onNavigate={handleNavigate}
          whatsappNumber={settings.whatsappNumber}
        />
      )}

      {/* --- ABOUT VIEW --- */}
      {currentTab === 'about' && (
        <AboutView />
      )}

      {/* --- CONTACT VIEW --- */}
      {currentTab === 'contact' && (
        <ContactView settings={settings} />
      )}

      {/* --- CONTROL PANEL ADMIN --- */}
      {currentTab === 'admin' && (
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 animate-bounce">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider">Separate Application Node</h2>
          <p className="mt-2 text-xs text-gray-400 font-sans leading-relaxed">
            Security Protocol dictates that the **Admin Panel Workspace** has been completely isolated on its own domain server **admin.loyaltech-electronics.com**.
          </p>
          <p className="mt-1 text-xs text-[#0066FF] font-sans font-medium">
            To view the backend console, please click the <strong>🔒 Isolated Admin App</strong> tab or use the virtual browser cockpit header above.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => handleNavigate('home')}
              className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-gray-805 transition cursor-pointer"
            >
              Back to Storefront
            </button>
            <button
              onClick={() => {
                setBrowserApp('admin');
              }}
              className="rounded-lg bg-rose-950/40 border border-rose-800/30 px-4 py-2 text-xs font-bold text-white hover:bg-rose-900/30 transition cursor-pointer"
            >
              Access Admin App Node
            </button>
          </div>
        </div>
      )}

      {/* --- BOTTOM FLOATING TELEMETRY FOOTER --- */}
      <footer className="border-t border-gray-900 bg-[#0A0A0F] py-10 mt-16 font-sans">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-tr from-[#0066FF] to-[#FF6B00] text-white">
                <Zap className="h-4.5 w-4.5 fill-white" />
              </div>
              <span className="font-display font-black text-white text-lg tracking-tight">
                {settings.shopName}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              "Plug In. Power Up. Go!" - Leading Bangladeshi electronics shop supplied with lightning original accessories.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Link catalogs</h4>
            <div className="flex flex-col space-y-2 text-xs text-gray-400">
              <button onClick={() => handleNavigate('home')} className="hover:text-white inline-block text-left cursor-pointer">Main Home</button>
              <button onClick={() => handleNavigate('shop')} className="hover:text-white inline-block text-left cursor-pointer">Configure adapters</button>
              <button onClick={() => handleNavigate('about')} className="hover:text-white inline-block text-left cursor-pointer">About us</button>
              <button onClick={() => handleNavigate('contact')} className="hover:text-white inline-block text-left cursor-pointer">Contact Support</button>
            </div>
          </div>

          <div className="space-y-3 font-sans">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Showroom coordinates</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans mt-1">
              {settings.address}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Chat Checkout Channel</h4>
            <p className="text-xs text-gray-500 font-sans leading-relaxed">
              We process each order format dynamically via WhatsApp to resolve packaging guidelines.
            </p>

            <a
              href={getWhatsAppUrl(settings.whatsappNumber, 'Hello PLUG N GO!')}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-500 transition cursor-pointer"
            >
              <PhoneCall className="h-4 w-4 fill-white text-white" />
              <span>Direct Hotline</span>
            </a>
          </div>

        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-gray-950 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
            © 2026 {settings.shopName}. All legal warrants reserved.
          </span>
          
          <div className="flex space-x-3 text-gray-500 text-xs text-none">
            <a href={settings.facebookLink} target="_blank" rel="noreferrer noopener" className="hover:text-white transition"><Facebook className="h-4.5 w-4.5" /></a>
            <a href={settings.instagramLink} target="_blank" rel="noreferrer noopener" className="hover:text-white transition"><Instagram className="h-4.5 w-4.5" /></a>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Navigator for Android/iOS responsive flow */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        openSearchTrigger={() => setSearchQuery('')}
      />

        </div>
      )}

    </div>
  );
}
