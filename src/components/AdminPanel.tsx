/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Smartphone, 
  TrendingUp, 
  ShieldAlert, 
  Package, 
  RefreshCw, 
  PhoneCall, 
  DollarSign, 
  Tag, 
  FileText,
  Save,
  Grid
} from 'lucide-react';
import { Product, Category, Brand, Banner, AdminSettings, WhatsAppOrder } from '../types';
import { formatBDT } from '../utils';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  banners: Banner[];
  orders: WhatsAppOrder[];
  settings: AdminSettings;
  onUpdateProducts: (newProducts: Product[]) => void;
  onUpdateCategories: (newCategories: Category[]) => void;
  onUpdateBrands: (newBrands: Brand[]) => void;
  onUpdateBanners: (newBanners: Banner[]) => void;
  onUpdateSettings: (newSettings: AdminSettings) => void;
  onUpdateOrders: (newOrders: WhatsAppOrder[]) => void;
}

export default function AdminPanel({
  products,
  categories,
  brands,
  banners,
  orders,
  settings,
  onUpdateProducts,
  onUpdateCategories,
  onUpdateBrands,
  onUpdateBanners,
  onUpdateSettings,
  onUpdateOrders
}: AdminPanelProps) {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'dashboard' | 'products' | 'categories' | 'brands' | 'banners' | 'orders' | 'settings'>('dashboard');

  // --- CRUD STATES ---
  // Product Edit modal states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    originalPrice: 0,
    images: [''],
    categoryId: categories[0]?.id || '',
    brandId: brands[0]?.id || '',
    stock: 10,
    rating: 4.8,
    reviewsCount: 1,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    inFlashSale: false,
    variants: [],
    specifications: {}
  });
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  // Category CRUD states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');

  // Brand CRUD states
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');

  // Banners CRUD states
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImg, setNewBannerImg] = useState('');

  // Settings State form
  const [settingsForm, setSettingsForm] = useState<AdminSettings>({ ...settings });

  // Stock Alerts list calculator
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const totalRevenueMock = orders
    .filter((o) => o.status === 'Completed')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  // --- ACTIONS ---
  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    alert('Settings synced successfully to client storage!');
  };

  // Add Product Form Submit
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const generatedId = `prod-${Math.floor(1000 + Math.random() * 9000)}`;
    const slug = newProduct.slug || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Split specifications
    const builtSpecs: Record<string, string> = {
      'Origin': 'Official Manufacturer'
    };

    const finalImage = newProduct.images?.[0] || 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600';

    const p: Product = {
      id: generatedId,
      name: newProduct.name,
      slug: slug,
      description: newProduct.description || 'Premium genuine accessories supplied from JFP outlet.',
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
      images: [finalImage],
      categoryId: newProduct.categoryId || categories[0]?.id || 'cat-accessories',
      brandId: newProduct.brandId || brands[0]?.id || 'brand-anker',
      stock: Number(newProduct.stock ?? 10),
      rating: Number(newProduct.rating ?? 4.8),
      reviewsCount: Number(newProduct.reviewsCount ?? 1),
      isFeatured: !!newProduct.isFeatured,
      isBestSeller: !!newProduct.isBestSeller,
      isNewArrival: !!newProduct.isNewArrival,
      inFlashSale: !!newProduct.inFlashSale,
      variants: newProduct.variants || ['Black', 'White'],
      specifications: builtSpecs
    };

    onUpdateProducts([p, ...products]);
    setShowAddProductForm(false);
    
    // reset Partial state
    setNewProduct({
      name: '',
      slug: '',
      description: '',
      price: 0,
      stock: 10,
      images: [''],
      rating: 4.8
    });
    alert('Product added successfully!');
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you absolutely sure you want to delete this product?')) {
      onUpdateProducts(products.filter((p) => p.id !== id));
    }
  };

  // Trigger editing a product
  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    onUpdateProducts(updated);
    setEditingProduct(null);
    alert('Product modified successfully!');
  };

  // Category crud handlers
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const id = `cat-${Math.floor(1000 + Math.random() * 9000)}`;
    const slug = newCategorySlug || newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: Category = {
      id,
      name: newCategoryName,
      slug,
      icon: 'Smartphone'
    };

    onUpdateCategories([...categories, newCat]);
    setNewCategoryName('');
    setNewCategorySlug('');
    setShowCategoryForm(false);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Delete this category? Linked products will need re-assignment.')) {
      onUpdateCategories(categories.filter((c) => c.id !== id));
    }
  };

  // Brand crud handlers
  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    const id = `brand-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBr: Brand = {
      id,
      name: newBrandName,
      logo: 'border border-gray-200 bg-white shadow-sm p-1 text-black font-semibold rounded'
    };

    onUpdateBrands([...brands, newBr]);
    setNewBrandName('');
    setShowBrandForm(false);
  };

  const handleDeleteBrand = (id: string) => {
    if (confirm('Delete this brand?')) {
      onUpdateBrands(brands.filter((b) => b.id !== id));
    }
  };

  // Banner CRUD handlers
  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim() || !newBannerImg.trim()) return;

    const id = `ban-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBan: Banner = {
      id,
      title: newBannerTitle,
      subtitle: newBannerSubtitle || 'Smart accessories & phone cords',
      imageUrl: newBannerImg,
      tagline: 'Always Charged. Always Moving.',
      link: 'shop'
    };

    onUpdateBanners([...banners, newBan]);
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerImg('');
    setShowBannerForm(false);
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm('Delete this slider banner?')) {
      onUpdateBanners(banners.filter((b) => b.id !== id));
    }
  };

  // Order log handlers
  const handleToggleOrderStatus = (orderId: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const nextStatus = o.status === 'Pending' ? 'Completed' : o.status === 'Completed' ? 'Cancelled' : 'Pending';
        return {
          ...o,
          status: nextStatus as any
        };
      }
      return o;
    });
    onUpdateOrders(updated);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="mb-8 border-b border-gray-900 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#0066FF]">System Console Cockpit</span>
            <h1 className="font-display text-2xl font-black text-white sm:text-3xl uppercase tracking-wider mt-1">
              PLUG N GO — Shop Administrator
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'dashboard', label: 'Monitor' },
              { id: 'products', label: 'Devices CRUD' },
              { id: 'categories', label: 'Categories' },
              { id: 'brands', label: 'Brands list' },
              { id: 'banners', label: 'Hero Slides' },
              { id: 'orders', label: 'WhatsApp Logs' },
              { id: 'settings', label: 'General configs' }
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveAdminSubTab(sub.id as any)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold cursor-pointer border ${
                  activeAdminSubTab === sub.id
                    ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-lg shadow-[#0066FF]/25'
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. DASHBOARD ANALYTICS PANEL */}
      {activeAdminSubTab === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Top Row Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Total catalog</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <strong className="text-3xl font-display font-black text-white">{products.length}</strong>
                <span className="text-xs text-emerald-500 font-semibold uppercase">Devices</span>
              </div>
              <span className="text-[10px] text-gray-500 mt-2 block">Directly editable in real-time</span>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Active Categories</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <strong className="text-3xl font-display font-black text-white">{categories.length}</strong>
                <span className="text-xs text-[#0066FF] font-semibold uppercase">Blocks</span>
              </div>
              <span className="text-[10px] text-gray-500 mt-2 block">Available inside shop sidebar</span>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Low stock items</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <strong className={`text-3xl font-display font-black ${lowStockProducts.length > 0 ? 'text-[#FF6B00]' : 'text-emerald-500'}`}>
                  {lowStockProducts.length}
                </strong>
                <span className="text-xs text-gray-400 font-semibold uppercase">Alerts</span>
              </div>
              <span className="text-[10px] text-gray-500 mt-2 block">Requires adapter restocks</span>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Completed Revenue</span>
              <div className="flex items-baseline space-x-1 mt-2">
                <strong className="text-xl font-display font-black text-emerald-500">{formatBDT(totalRevenueMock)}</strong>
              </div>
              <span className="text-[10px] text-gray-500 mt-2 block">Based on Simulated orders</span>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* Low Stock Alerts Checklist */}
            <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-5 lg:col-span-1">
              <div className="flex items-center space-x-2 border-b border-gray-900 pb-3 mb-4">
                <ShieldAlert className="h-4.5 w-4.5 text-[#FF6B00]" />
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Stock depletion alerts</h3>
              </div>

              {lowStockProducts.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500 font-sans">
                  Excellent! All electronics are well stocked in shop memory.
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="rounded-lg border border-gray-900 bg-[#12121A] p-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-gray-200 block text-ellipsis overflow-hidden line-clamp-1">{p.name}</span>
                        <span className="text-[10px] text-gray-500">ID: {p.id}</span>
                      </div>
                      <span className="rounded bg-rose-950 border border-rose-800 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                        ({p.stock} left)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Simulated order checklist */}
            <div className="rounded-xl border border-gray-800 bg-[#0E0E15] p-5 lg:col-span-2">
              <div className="flex items-center space-x-2 border-b border-gray-900 pb-3 mb-4">
                <PhoneCall className="h-4.5 w-4.5 text-emerald-500" />
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Latest simulated WhatsApp Orders</h3>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500">
                  No orders generated in this session. Checkout some items to trace logs here.
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="rounded-lg border border-gray-900 bg-[#12121A] p-3 text-xs">
                      <div className="flex justify-between items-center mb-2">
                        <strong className="font-bold text-[#FF6B00]">{o.id}</strong>
                        <span className="text-[10px] text-gray-500">{o.orderDate}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-gray-400 block">Customer: {o.customerName} ({o.customerPhone || 'N/A'})</span>
                        <div className="mt-1 pl-2 border-l border-gray-800 text-[11px] text-gray-300">
                          {o.products.map((p, idx) => (
                            <div key={idx}>{p.name} (x{p.qty}) - {formatBDT(p.price)}</div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-900 pt-2 text-[10px]">
                        <span className="font-bold text-white">Bill: {formatBDT(o.totalPrice)}</span>
                        
                        <span 
                          onClick={() => handleToggleOrderStatus(o.id)}
                          className={`rounded px-2 py-0.5 font-bold uppercase tracking-wider text-[9px] cursor-pointer ${
                            o.status === 'Completed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : o.status === 'Cancelled'
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {o.status} (Toggle)
                        </span>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* 2. PRODUCTS CRUD */}
      {activeAdminSubTab === 'products' && (
        <div className="space-y-6 animate-fade-in select-none">
          
          <div className="flex items-center justify-between border-b border-gray-900 pb-3">
            <h3 className="font-display text-sm font-bold uppercase text-white tracking-wider">Device storage index</h3>
            <button
              onClick={() => setShowAddProductForm(!showAddProductForm)}
              className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 transition cursor-pointer"
            >
              {showAddProductForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{showAddProductForm ? 'Cancel Form' : 'Register New Electronics'}</span>
            </button>
          </div>

          {/* EDIT FORM DRAW (IF ACTIVE) */}
          {editingProduct && (
            <form onSubmit={handleSaveEditProduct} className="rounded-xl border border-[#0066FF]/30 bg-[#121222] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="text-xs font-bold text-[#0066FF] uppercase">Modify Product details</span>
                <button type="button" onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-white cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full rounded border border-gray-800 bg-[#0E0E15] px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Price (৳ BDT)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full rounded border border-gray-800 bg-[#0E0E15] px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full rounded border border-gray-800 bg-[#0E0E15] px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Demo Image Link</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.images[0]}
                    onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                    className="w-full rounded border border-gray-800 bg-[#0E0E15] px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Category Parent</label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                    className="w-full rounded border border-gray-800 bg-[#0E0E15] px-3 py-1.5 text-xs text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Description Paragraph</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full rounded border border-gray-800 bg-[#0E0E15] px-3 py-1.5 text-xs text-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => setEditingProduct(null)} className="rounded bg-gray-900 border border-gray-800 px-4 py-2 cursor-pointer text-gray-300">
                  Discard
                </button>
                <button type="submit" className="rounded bg-[#0066FF] px-5 py-2 cursor-pointer text-white font-bold">
                  Commit Edits
                </button>
              </div>
            </form>
          )}

          {/* ADD PRODUCT FORM (IF ACTIVE) */}
          {showAddProductForm && (
            <form onSubmit={handleAddProduct} className="rounded-xl border border-gray-800 bg-[#0E0E15] p-5 space-y-4 animate-fade-in text-xs text-none">
              <h4 className="text-xs uppercase font-bold text-[#FF6B00] mb-2 border-b border-gray-950 pb-2">Register Electronics Record</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ugreen Dual USB Fast charger"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full rounded border border-gray-800 bg-[#12121A] px-3 py-1.5 text-[#EEE]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Price (৳ BDT)</label>
                  <input
                    type="number"
                    required
                    placeholder="1200"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full rounded border border-gray-800 bg-[#12121A] px-3 py-1.5 text-[#EEE]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Discount original price (৳ BDT)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={newProduct.originalPrice || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                    className="w-full rounded border border-gray-800 bg-[#12121A] px-3 py-1.5 text-[#EEE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Single Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newProduct.images?.[0] || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                    className="w-full rounded border border-gray-800 bg-[#12121A] px-3 py-1.5 text-[#EEE]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Catalog Category</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    className="w-full rounded border border-gray-800 bg-[#12121A] px-3 py-1.5 text-gray-300"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Initial Stock quantity</label>
                  <input
                    type="number"
                    placeholder="15"
                    value={newProduct.stock ?? ''}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full rounded border border-gray-800 bg-[#12121A] px-3 py-1.5 text-[#EEE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Assign Brand</label>
                  <select
                    value={newProduct.brandId}
                    onChange={(e) => setNewProduct({ ...newProduct, brandId: e.target.value })}
                    className="w-full rounded border border-gray-800 bg-[#12121A] px-3 py-1.5 text-gray-300"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center pt-5">
                  <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!newProduct.inFlashSale}
                      onChange={(e) => setNewProduct({ ...newProduct, inFlashSale: e.target.checked })}
                      className="accent-[#0066FF]"
                    />
                    <span>Flash Sale Slot</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!newProduct.isFeatured}
                      onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                      className="accent-[#0066FF]"
                    />
                    <span>Featured Badge</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Official details..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full rounded border border-gray-800 bg-[#12121A] px-3 py-2 text-[#EEE]"
                ></textarea>
              </div>

              <button type="submit" className="w-full rounded bg-[#0066FF] py-3 text-xs font-bold text-white uppercase tracking-wider hover:bg-blue-600 transition cursor-pointer">
                Inject Product to database
              </button>
            </form>
          )}

          {/* INDEXED LIST TABLE */}
          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#0E0E15]">
            <table className="w-full border-collapse text-left text-xs text-none">
              <thead>
                <tr className="border-b border-gray-950 bg-gray-900/40 text-gray-400 uppercase font-bold tracking-wider text-[10px]">
                  <th className="py-3 px-4">Item details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (৳ BDT)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Delete & Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-900/20 text-gray-300">
                    <td className="py-3.5 px-4 flex items-center space-x-3 max-w-xs">
                      <img src={p.images[0]} alt="" className="h-9 w-9 rounded-lg object-cover bg-[#161622]" />
                      <div className="overflow-hidden">
                        <span className="font-bold text-gray-100 block text-ellipsis overflow-hidden line-clamp-1">{p.name}</span>
                        <span className="text-[9px] text-[#FF6B00] inline-block mt-0.5">{p.id}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {categories.find(c => c.id === p.categoryId)?.name || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-[#FFF] font-bold">
                      {formatBDT(p.price)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block h-2 w-2 rounded-full mr-1.5 ${p.stock <= 5 ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
                      {p.stock}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex space-x-2">
                        <button
                          onClick={() => startEditProduct(p)}
                          className="rounded bg-gray-900 border border-gray-850 p-1.5 text-[#0066FF] hover:bg-gray-800 transition cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="rounded bg-rose-950/20 border border-rose-900/40 p-1.5 text-rose-400 hover:bg-rose-900 hover:text-white transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 3. CATEGORIES INDEX */}
      {activeAdminSubTab === 'categories' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-gray-900 pb-3">
            <h3 className="font-display text-sm font-bold uppercase text-white tracking-wider">Configure Categories</h3>
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="flex h-9 items-center justify-center gap-1 text-xs font-semibold text-[#0066FF] hover:underline cursor-pointer"
            >
              {showCategoryForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{showCategoryForm ? 'Discard Form' : 'Register Category'}</span>
            </button>
          </div>

          {showCategoryForm && (
            <form onSubmit={handleAddCategory} className="rounded-xl border border-gray-850 bg-[#0E0E15] p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs select-none">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Category Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ultra Sound"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full rounded border border-gray-800 bg-[#12121A] px-3 py-2 text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Slug keyword</label>
                <input
                  type="text"
                  placeholder="e.g. ultra-sound"
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  className="w-full rounded border border-gray-800 bg-[#12121A] px-3 py-2 text-white placeholder-gray-500"
                />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full h-10 rounded bg-[#0066FF] font-black text-white cursor-pointer uppercase">
                  Append Block
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((c) => {
              const count = products.filter(p => p.categoryId === c.id).length;
              return (
                <div key={c.id} className="rounded-xl border border-gray-800 bg-[#0E0E15] p-4 flex items-center justify-between">
                  <div>
                    <strong className="text-gray-100 block text-sm font-bold">{c.name}</strong>
                    <span className="text-[10px] text-gray-500 font-medium">Slug: {c.slug} | {count} linked products</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteCategory(c.id)}
                    className="rounded bg-rose-950/20 border border-rose-900/40 p-2 text-rose-500 hover:bg-rose-900 hover:text-white transition cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 4. BRANDS CRUD */}
      {activeAdminSubTab === 'brands' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-gray-900 pb-3">
            <h3 className="font-display text-sm font-bold uppercase text-white tracking-wider">Brands listing</h3>
            <button
              onClick={() => setShowBrandForm(!showBrandForm)}
              className="flex h-9 items-center justify-center gap-1 text-xs font-semibold text-[#0066FF] hover:underline cursor-pointer"
            >
              {showBrandForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{showBrandForm ? 'Discard' : 'Append Brand'}</span>
            </button>
          </div>

          {showBrandForm && (
            <form onSubmit={handleAddBrand} className="rounded-xl border border-gray-850 bg-[#0E0E15] p-5 flex gap-4 text-xs max-w-lg select-none">
              <div className="flex-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Baseus BD"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full rounded border border-gray-800 bg-[#12121A] px-3 py-2 text-white"
                />
              </div>
              <div className="flex items-end">
                <button type="submit" className="h-[38px] rounded bg-[#0066FF] px-6 font-black text-white cursor-pointer uppercase">
                  Inject
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {brands.map((b) => {
              const count = products.filter(p => p.brandId === b.id).length;
              return (
                <div key={b.id} className="rounded-xl border border-gray-800 bg-[#0E0E15] p-4 flex flex-col justify-between h-24">
                  <span className="font-bold text-gray-100 block text-sm">{b.name}</span>
                  <div className="flex justify-between items-center text-[10px] text-gray-500">
                    <span>{count} gadgets</span>
                    <button 
                      onClick={() => handleDeleteBrand(b.id)}
                      className="text-rose-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 5. BANNERS (HERO SLIDER CONFIG) */}
      {activeAdminSubTab === 'banners' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-gray-900 pb-3">
            <h3 className="font-display text-sm font-bold uppercase text-white tracking-wider">Configure Hero Slides</h3>
            <button
              onClick={() => setShowBannerForm(!showBannerForm)}
              className="flex h-9 items-center justify-center gap-1 text-xs font-semibold text-[#0066FF] hover:underline cursor-pointer"
            >
              {showBannerForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{showBannerForm ? 'Cancel Form' : 'Register Slider banner'}</span>
            </button>
          </div>

          {showBannerForm && (
            <form onSubmit={handleAddBanner} className="rounded-xl border border-gray-850 bg-[#0E0E15] p-5 space-y-4 text-xs select-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Banner Heading Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Premium Fast Charge arrays"
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    className="w-full rounded border border-gray-800 bg-[#12121A] px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Main Image URL Link</label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newBannerImg}
                    onChange={(e) => setNewBannerImg(e.target.value)}
                    className="w-full rounded border border-gray-800 bg-[#12121A] px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Sub-heading</label>
                <input
                  type="text"
                  placeholder="Level up your charging speeds..."
                  value={newBannerSubtitle}
                  onChange={(e) => setNewBannerSubtitle(e.target.value)}
                  className="w-full rounded border border-gray-800 bg-[#12121A] px-3 py-2 text-white"
                />
              </div>

              <button type="submit" className="w-full h-10 rounded bg-[#0066FF] text-white uppercase font-bold cursor-pointer">
                Commit Banner to slider
              </button>
            </form>
          )}

          <div className="space-y-4">
            {banners.map((ban) => (
              <div key={ban.id} className="rounded-xl border border-gray-800 bg-[#0E0E15] p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex items-center space-x-3">
                  <img src={ban.imageUrl} alt="" className="h-14 w-28 object-cover rounded bg-gray-900" />
                  <div>
                    <span className="font-bold text-white block text-sm">{ban.title}</span>
                    <span className="text-[10px] text-gray-500 block">{ban.subtitle}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteBanner(ban.id)}
                  className="rounded bg-rose-955 border border-rose-900 px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-900 hover:text-white transition cursor-pointer"
                >
                  Delete Banner
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 6. WHATSAPP ORDERS LOG */}
      {activeAdminSubTab === 'orders' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="border-b border-gray-900 pb-3">
            <h3 className="font-display text-sm font-bold uppercase text-white tracking-wider">Simulated Checkout logs</h3>
            <p className="text-xs text-gray-400 mt-1">Whenever customers tap to checkout, order parameters track in localstorage indices.</p>
          </div>

          {orders.length === 0 ? (
            <div className="py-20 text-center rounded-2xl border border-gray-850 bg-[#0E0E15] text-xs text-gray-500">
              No orders traces found. Checkout items over the shopping cart route to see entries.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="rounded-xl border border-gray-800 bg-[#0E0E15] p-4 sm:p-5 text-xs relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-950 pb-3 mb-3">
                    <div>
                      <strong className="text-sm font-display font-black text-[#FF6B00] uppercase">{o.id}</strong>
                      <span className="text-[10px] text-gray-500 block sm:inline sm:ml-3">Logged Date: {o.orderDate}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-gray-400">Execution Status:</span>
                      <button 
                        onClick={() => handleToggleOrderStatus(o.id)}
                        className={`rounded px-2.5 py-1 font-bold text-[10px] uppercase tracking-wide cursor-pointer ${
                          o.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-400'
                            : o.status === 'Cancelled'
                            ? 'bg-red-950 text-red-400'
                            : 'bg-amber-950 text-amber-500'
                        }`}
                      >
                        {o.status} (Toggle status)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] block">Devices Requested</span>
                      <div className="space-y-1.5 pl-3 border-l border-gray-900 text-gray-200">
                        {o.products.map((p, i) => (
                          <div key={i}>
                            * {p.name} (x{p.qty}) - <strong className="text-white">{formatBDT(p.price)}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-900/30 border border-gray-950 p-3 self-center">
                      <span className="text-[10px] uppercase text-gray-500 block font-bold">Total Bill</span>
                      <strong className="text-base text-gray-100 font-bold tracking-tight block mt-1">{formatBDT(o.totalPrice)}</strong>
                      <span className="text-[9px] text-gray-400 mt-1 block">Customer: {o.customerName || 'Standard Chat checkout'}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* 7. SETTINGS PANEL */}
      {activeAdminSubTab === 'settings' && (
        <div className="animate-fade-in select-none">
          <form onSubmit={handleSaveSettings} className="rounded-2xl border border-gray-800 bg-[#0E0E15] p-5 sm:p-8 space-y-5 text-xs text-none">
            <div className="border-b border-gray-950 pb-3">
              <h3 className="font-display font-black text-sm uppercase text-gray-200 tracking-wider">Sync Outlet Parameters</h3>
              <p className="text-[10px] text-gray-500">Edit business parameters to redirect WhatsApp links seamlessly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Company brand Name</label>
                <input
                  type="text"
                  required
                  value={settingsForm.shopName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, shopName: e.target.value })}
                  className="w-full h-11 rounded-lg border border-gray-800 bg-[#12121A] px-3.5 text-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-[#444] block mb-1">WhatsApp number (With country prefix 880)</label>
                <input
                  type="text"
                  required
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  className="w-full h-11 rounded-lg border border-gray-800 bg-[#12121A] px-3.5 text-gray-200 font-medium text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-[#444] block mb-1">Physical Store Outlet Address</label>
              <input
                type="text"
                required
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full h-11 rounded-lg border border-gray-800 bg-[#12121A] px-3.5 text-gray-200 text-xs shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-950 pt-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Facebook Fanpage link</label>
                <input
                  type="text"
                  value={settingsForm.facebookLink}
                  onChange={(e) => setSettingsForm({ ...settingsForm, facebookLink: e.target.value })}
                  className="w-full h-11 rounded-lg border border-gray-800 bg-[#12121A] px-3.5 text-gray-200 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Instagram link</label>
                <input
                  type="text"
                  value={settingsForm.instagramLink}
                  onChange={(e) => setSettingsForm({ ...settingsForm, instagramLink: e.target.value })}
                  className="w-full h-11 rounded-lg border border-gray-800 bg-[#12121A] px-3.5 text-gray-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-950 pt-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">SEO Tagline Title</label>
                <input
                  type="text"
                  value={settingsForm.seoTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, seoTitle: e.target.value })}
                  className="w-full h-11 rounded-lg border border-gray-800 bg-[#12121A] px-3.5 text-gray-200 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">SEO Description</label>
                <input
                  type="text"
                  value={settingsForm.seoDescription}
                  onChange={(e) => setSettingsForm({ ...settingsForm, seoDescription: e.target.value })}
                  className="w-full h-11 rounded-lg border border-gray-800 bg-[#12121A] px-3.5 text-gray-200 text-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-950 flex justify-end">
              <button
                type="submit"
                className="flex h-12 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-tr from-[#0066FF] to-blue-800 px-8 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#0066FF]/20 hover:scale-[1.01] cursor-pointer"
              >
                <Save className="h-4.5 w-4.5" />
                <span>Save general credentials</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
