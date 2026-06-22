/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, Brand, Banner, AdminSettings, Review, WhatsAppOrder, Coupon, Customer, AdminUser, LoginActivityLog } from './types';
import {
  DEFAULT_PRODUCTS,
  DEFAULT_CATEGORIES,
  DEFAULT_BRANDS,
  DEFAULT_BANNERS,
  DEFAULT_SETTINGS,
  DEFAULT_REVIEWS,
  DEFAULT_ORDERS
} from './data';

// BDT currency formatter (e.g. ৳ 1,25,000 or ৳ 1,200)
export function formatBDT(amount: number): string {
  return `৳ ${new Intl.NumberFormat('en-IN').format(amount)}`;
}

// Generate the WhatsApp Link
export function getWhatsAppUrl(phoneNumber: string, message: string): string {
  // strip all non-numeric from phone except starting symbols
  const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

// Create order message for a single product direct checkout
export function buildSingleProductMessage(product: Product, quantity: number, variant?: string, note?: string): string {
  const finalPrice = product.price * quantity;
  const formattedPrice = new Intl.NumberFormat('en-IN').format(finalPrice);
  return `⚡ PLUG N GO — Order Request

📦 Product: ${product.name}
💰 Price: ৳ ${formattedPrice}
🔢 Quantity: ${quantity}
🎨 Variant: ${variant || 'None'}${note ? `\n📝 Note: ${note}` : ''}

Please confirm my order. Thank you!`;
}

// Create order message for multiple list items (Cart Checkout)
export function buildCartOrderMessage(items: { product: Product; quantity: number; selectedVariant?: string }[], totalPrice: number, note?: string): string {
  const productsSummary = items.map((item) => `${item.product.name} (Qty: ${item.quantity}${item.selectedVariant ? `, Variant: ${item.selectedVariant}` : ''})`).join(', ');
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const formattedPrice = new Intl.NumberFormat('en-IN').format(totalPrice);
  
  return `⚡ PLUG N GO — Order Request

📦 Product: ${productsSummary}
💰 Price: ৳ ${formattedPrice}
🔢 Quantity: ${totalQty}
🎨 Variant: Refer to product details above${note ? `\n📝 Note: ${note}` : ''}

Please confirm my order. Thank you!`;
}

// LocalStorage Persistence Handlers
export function getStoredSettings(): AdminSettings {
  const data = localStorage.getItem('png_settings');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (parsed && (parsed.whatsappNumber === '8801712345678' || parsed.whatsappNumber === '1712345678' || parsed.whatsappNumber === '01895292208' || parsed.whatsappNumber === '01312023489')) {
        parsed.whatsappNumber = '8801312023489';
        localStorage.setItem('png_settings', JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      // fallback
    }
  }
  // Initialize on first access
  localStorage.setItem('png_settings', JSON.stringify(DEFAULT_SETTINGS));
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: AdminSettings): void {
  localStorage.setItem('png_settings', JSON.stringify(settings));
}

export function getStoredProducts(): Product[] {
  const data = localStorage.getItem('png_products');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  localStorage.setItem('png_products', JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

export function saveStoredProducts(products: Product[]): void {
  localStorage.setItem('png_products', JSON.stringify(products));
}

export function getStoredCategories(): Category[] {
  const data = localStorage.getItem('png_categories');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  localStorage.setItem('png_categories', JSON.stringify(DEFAULT_CATEGORIES));
  return DEFAULT_CATEGORIES;
}

export function saveStoredCategories(categories: Category[]): void {
  localStorage.setItem('png_categories', JSON.stringify(categories));
}

export function getStoredBrands(): Brand[] {
  const data = localStorage.getItem('png_brands');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  localStorage.setItem('png_brands', JSON.stringify(DEFAULT_BRANDS));
  return DEFAULT_BRANDS;
}

export function saveStoredBrands(brands: Brand[]): void {
  localStorage.setItem('png_brands', JSON.stringify(brands));
}

export function getStoredBanners(): Banner[] {
  const data = localStorage.getItem('png_banners');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  localStorage.setItem('png_banners', JSON.stringify(DEFAULT_BANNERS));
  return DEFAULT_BANNERS;
}

export function saveStoredBanners(banners: Banner[]): void {
  localStorage.setItem('png_banners', JSON.stringify(banners));
}

export function getStoredReviews(): Review[] {
  const data = localStorage.getItem('png_reviews');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  localStorage.setItem('png_reviews', JSON.stringify(DEFAULT_REVIEWS));
  return DEFAULT_REVIEWS;
}

export function saveStoredReviews(reviews: Review[]): void {
  localStorage.setItem('png_reviews', JSON.stringify(reviews));
}

export function getStoredOrders(): WhatsAppOrder[] {
  const data = localStorage.getItem('png_orders');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  localStorage.setItem('png_orders', JSON.stringify(DEFAULT_ORDERS));
  return DEFAULT_ORDERS;
}

export function saveStoredOrders(orders: WhatsAppOrder[]): void {
  localStorage.setItem('png_orders', JSON.stringify(orders));
}

// --- NEW SOPHISTICATED SERVICES PERSISTENCE ---

export const DEFAULT_COUPONS: Coupon[] = [
  { id: 'coup-1', code: 'LOYAL10', discountType: 'percentage', discountValue: 10, minOrderAmount: 5000, isActive: true },
  { id: 'coup-2', code: 'FLAT500', discountType: 'fixed', discountValue: 500, minOrderAmount: 15000, isActive: true },
  { id: 'coup-3', code: 'WELCOME', discountType: 'percentage', discountValue: 5, minOrderAmount: 1000, isActive: true }
];

export const DEFAULT_CUSTOMERS: Customer[] = [
  { id: 'cust-1', name: 'Sadman Sakib', email: 'sadman@gmail.com', phone: '01712039485', totalOrders: 3, totalSpend: 154000, joinDate: '2026-02-14' },
  { id: 'cust-2', name: 'Nusrat Jahan', email: 'nusrat.jahan@yahoo.com', phone: '01822394857', totalOrders: 1, totalSpend: 38500, joinDate: '2026-05-20' },
  { id: 'cust-3', name: 'Rashedul Islam', email: 'rashed.islam@outlook.com', phone: '01911223344', totalOrders: 0, totalSpend: 0, joinDate: '2026-06-21' }
];

export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  { id: 'user-admin', name: 'Super Admin', email: 'admin@lplugngo.com', role: 'Super Admin', status: 'Active' },
  { id: 'user-manager', name: 'Nayeem Islam', email: 'manager@lplugngo.com', role: 'Admin', status: 'Active' },
  { id: 'user-staff', name: 'Taskin Ahmed', email: 'staff@lplugngo.com', role: 'Staff', status: 'Active' }
];

export const DEFAULT_ACTIVITY_LOGS: LoginActivityLog[] = [];

export function getStoredCoupons(): Coupon[] {
  const data = localStorage.getItem('png_coupons');
  if (data) {
    try { return JSON.parse(data); } catch { }
  }
  localStorage.setItem('png_coupons', JSON.stringify(DEFAULT_COUPONS));
  return DEFAULT_COUPONS;
}

export function saveStoredCoupons(coupons: Coupon[]): void {
  localStorage.setItem('png_coupons', JSON.stringify(coupons));
}

export function getStoredCustomers(): Customer[] {
  const data = localStorage.getItem('png_customers');
  if (data) {
    try { return JSON.parse(data); } catch { }
  }
  localStorage.setItem('png_customers', JSON.stringify(DEFAULT_CUSTOMERS));
  return DEFAULT_CUSTOMERS;
}

export function saveStoredCustomers(customers: Customer[]): void {
  localStorage.setItem('png_customers', JSON.stringify(customers));
}

export function getStoredAdminUsers(): AdminUser[] {
  const data = localStorage.getItem('png_admin_users');
  if (data) {
    try { return JSON.parse(data); } catch { }
  }
  localStorage.setItem('png_admin_users', JSON.stringify(DEFAULT_ADMIN_USERS));
  return DEFAULT_ADMIN_USERS;
}

export function saveStoredAdminUsers(adminUsers: AdminUser[]): void {
  localStorage.setItem('png_admin_users', JSON.stringify(adminUsers));
}

export function getStoredActivityLogs(): LoginActivityLog[] {
  const data = localStorage.getItem('png_activity_logs');
  if (data) {
    try { return JSON.parse(data); } catch { }
  }
  localStorage.setItem('png_activity_logs', JSON.stringify(DEFAULT_ACTIVITY_LOGS));
  return DEFAULT_ACTIVITY_LOGS;
}

export function saveStoredActivityLogs(logs: LoginActivityLog[]): void {
  localStorage.setItem('png_activity_logs', JSON.stringify(logs));
}

