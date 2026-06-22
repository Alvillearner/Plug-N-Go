/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number; // For rendering discounts
  images: string[];
  categoryId: string;
  brandId: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  inFlashSale: boolean;
  variants?: string[]; // e.g. ["Black", "White", "Navy Blue", "Slate Grey"]
  specifications?: Record<string, string>; // e.g. {"Battery": "5000mAh", "Screen": "6.7 inch AMOLED"}
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // Name of Lucide icon to render
}

export interface Brand {
  id: string;
  name: string;
  logo: string; // Icon or abbreviation text or direct URL
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  id: string; // cart item special unique id
  productId: string;
  quantity: number;
  selectedVariant?: string;
}

export interface WhatsAppOrder {
  id: string;
  products: {
    name: string;
    qty: number;
    price: number;
    variant?: string;
  }[];
  totalPrice: number;
  orderDate: string;
  customerName?: string;
  customerPhone?: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  tagline: string;
  link: string; // Slug or tab path
}

export interface AdminSettings {
  shopName: string;
  whatsappNumber: string; // e.g. "8801700000000"
  address: string;
  facebookLink: string;
  instagramLink: string;
  logoText: string;
  seoTitle: string;
  seoDescription: string;
}
