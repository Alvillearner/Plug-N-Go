/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, Brand, Banner, AdminSettings, Review, WhatsAppOrder } from './types';
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
  return `🛒 *PLUG N GO — Order Request*

📦 Product: ${product.name}
💰 Price: ${formatBDT(product.price)}
🔢 Quantity: ${quantity}
🎨 Variant: ${variant || 'No specific color/spec selected'}
${note ? `📝 Note: ${note}\n` : ''}
⚡ Total: ${formatBDT(finalPrice)}

Please confirm my order. Thank you! ⚡`;
}

// Create order message for multiple list items (Cart Checkout)
export function buildCartOrderMessage(items: { product: Product; quantity: number; selectedVariant?: string }[], totalPrice: number, note?: string): string {
  let itemsText = '';
  items.forEach((item, index) => {
    itemsText += `${index + 1}. *${item.product.name}*\n   🔢 Qty: ${item.quantity} | 💰 Unit: ${formatBDT(item.product.price)}${item.selectedVariant ? ` | 🎨 Spec: ${item.selectedVariant}` : ''}\n\n`;
  });

  return `🛒 *PLUG N GO — Multi-Product Order Request*

🛍️ *Order Items:*
${itemsText}💵 *Subtotal:* ${formatBDT(totalPrice)}
${note ? `📝 *Customer Note:* ${note}\n` : ''}
Please confirm my order. Thank you! ⚡`;
}

// LocalStorage Persistence Handlers
export function getStoredSettings(): AdminSettings {
  const data = localStorage.getItem('png_settings');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (parsed && (parsed.whatsappNumber === '8801712345678' || parsed.whatsappNumber === '1712345678' || parsed.whatsappNumber === '01895292208')) {
        parsed.whatsappNumber = '01312023489';
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
