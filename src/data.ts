/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, Brand, Banner, AdminSettings, Review, WhatsAppOrder } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-mobile', name: 'Mobile', slug: 'mobile', icon: 'Smartphone' },
  { id: 'cat-laptop', name: 'Laptop', slug: 'laptop', icon: 'Laptop' },
  { id: 'cat-tv', name: 'TV & Video', slug: 'tv', icon: 'Tv' },
  { id: 'cat-gaming', name: 'Gaming', slug: 'gaming', icon: 'Gamepad2' },
  { id: 'cat-accessories', name: 'Accessories', slug: 'accessories', icon: 'Zap' },
  { id: 'cat-smarthome', name: 'Smart Home', slug: 'smart-home', icon: 'Home' }
];

export const DEFAULT_BRANDS: Brand[] = [
  { id: 'brand-apple', name: 'Apple', logo: 'border border-gray-200 shadow-sm bg-white text-black p-1 rounded font-bold' },
  { id: 'brand-samsung', name: 'Samsung', logo: 'border border-gray-200 shadow-sm bg-white text-blue-800 p-1 rounded font-black' },
  { id: 'brand-sony', name: 'Sony', logo: 'border border-gray-200 shadow-sm bg-white text-gray-900 p-1 rounded tracking-widest font-bold' },
  { id: 'brand-xiaomi', name: 'Xiaomi', logo: 'border border-gray-200 shadow-sm bg-orange-500 text-white p-1 rounded font-bold' },
  { id: 'brand-anker', name: 'Anker', logo: 'border border-gray-200 shadow-sm bg-blue-600 text-white p-1 rounded font-bold' },
  { id: 'brand-logitech', name: 'Logitech', logo: 'border border-gray-200 shadow-sm bg-sky-500 text-white p-1 rounded font-bold' }
];

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    title: 'Flagship Gaming Gear',
    subtitle: 'Level up your gaming experience',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=1200',
    tagline: 'Plug In. Power Up. Go!',
    link: 'gaming'
  },
  {
    id: 'ban-2',
    title: 'Ultralight Performance Laptops',
    subtitle: 'Work or study from anywhere with premium power',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200',
    tagline: 'Ultimate Portability. Speed Unleashed.',
    link: 'laptop'
  },
  {
    id: 'ban-3',
    title: 'Fast Charging Powerhouses',
    subtitle: 'Premium GAN adapters and cords for heavy setups',
    imageUrl: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&q=80&w=1200',
    tagline: 'Always Charged. Always Moving.',
    link: 'accessories'
  }
];

export const DEFAULT_SETTINGS: AdminSettings = {
  shopName: 'PLUG N GO',
  whatsappNumber: '8801312023489', // Default Bangladeshi number
  address: 'Level 4, Zone A, Jamuna Future Park, Dhaka, Bangladesh',
  facebookLink: 'https://facebook.com/plugngo.bd',
  instagramLink: 'https://instagram.com/plugngo.bd',
  logoText: 'PLUG N GO',
  seoTitle: 'PLUG N GO | Premium Electronics Shop in Bangladesh',
  seoDescription: 'Find genuine mobile devices, premium sound hubs, hypergaming accessories & fast chargers at PLUG N GO Bangladesh. Convenient automated order generation via WhatsApp!',
  paymentGatewayEnabled: true,
  manualPaymentInstructions: 'Please complete payment sending to our official bKash or Nagad Merchant Number: +8801312023489 (Use reference: {ORDER_ID})',
  notifyOnNewOrder: true,
  notifyEmail: 'admin@loyaltech.com',
  couponUsageLimit: 100
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-iphone15',
    name: 'iPhone 15 Pro Max (Titanium Natural)',
    slug: 'iphone-15-pro-max',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever. Perfect compatibility with high-speed networks. Genuine official factory unlocked variant with dual SIM options.',
    price: 138500,
    originalPrice: 145000,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1695048133031-7af481c45c11?auto=format&fit=crop&q=80&w=600'
    ],
    categoryId: 'cat-mobile',
    brandId: 'brand-apple',
    stock: 8,
    rating: 4.8,
    reviewsCount: 32,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    inFlashSale: true,
    variants: ['256GB', '512GB', '1TB'],
    specifications: {
      'Chipset': 'Apple A17 Pro (3nm)',
      'Display': '6.7 inches LTPO Super Retina XDR OLED',
      'Battery': '4441 mAh with fast charge',
      'Camera': '48MP Main + 12MP Telephoto 5x + 12MP Ultrawide',
      'Frame': 'Grade 5 Titanium design'
    }
  },
  {
    id: 'prod-mbairm2',
    name: 'Apple MacBook Air M2 (8GB/256GB SSD)',
    slug: 'macbook-air-m2',
    description: 'Strikingly thin design, blazing-fast computing speed, and a fanless silent build. The M2 chip introduces Next-Gen 8-core CPU and up to 10-core GPU, plus up to 18 hours of battery life to keep your workflow uninterrupted.',
    price: 114000,
    originalPrice: 121000,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=600'
    ],
    categoryId: 'cat-laptop',
    brandId: 'brand-apple',
    stock: 4,
    rating: 4.9,
    reviewsCount: 18,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    inFlashSale: false,
    variants: ['Space Gray', 'Midnight', 'Silver', 'Starlight'],
    specifications: {
      'Processor': 'Apple M2 Chip with 8-core CPU',
      'RAM': '8GB unified memory',
      'Storage': '256GB PCIe-based SSD',
      'Screen Size': '13.6-inch Liquid Retina Display',
      'Battery': 'Up to 18 hours playback'
    }
  },
  {
    id: 'prod-sonyu80',
    name: 'Sony Bravia X80L 55 Inch Smart Google TV',
    slug: 'sony-bravia-x80l-55',
    description: 'Over a billion colors brought to life by TRILUMINOS PRO and our 4K HDR Processor X1. With intense contrast, everything you watch feels real. Features seamless Google TV integration so you can watch your favorite apps side-by-side.',
    price: 89900,
    originalPrice: 98000,
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=600'
    ],
    categoryId: 'cat-tv',
    brandId: 'brand-sony',
    stock: 3,
    rating: 4.6,
    reviewsCount: 22,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    inFlashSale: false,
    specifications: {
      'Screen Size': '55 Inch 4K Ultra HD',
      'Processor': '4K HDR Processor X1',
      'Sound OS': 'Dolby Atmos Integration (20W Speaker)',
      'Operating System': 'Google TV OS',
      'Refresh Rate': '60 Hz Motionflow XR'
    }
  },
  {
    id: 'prod-boseqc',
    name: 'Bose QuietComfort Wireless Noise-Cancelling Headphones',
    slug: 'bose-quietcomfort-wireless',
    description: 'Legendary audio with premium acoustic noise cancellation. Designed with customizable quiet/aware settings and adjustable EQ filters, these snug, cloud-like head-pads let you shut out all ambient city traffic and dive deep into your tunes.',
    price: 28500,
    originalPrice: 31000,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'
    ],
    categoryId: 'cat-accessories',
    brandId: 'brand-sony', // Best match brand
    stock: 12,
    rating: 4.7,
    reviewsCount: 45,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    inFlashSale: true,
    variants: ['Triple Black', 'White Smoke', 'Cypress Green'],
    specifications: {
      'Battery Life': 'Up to 24 Hours on single charge',
      'Charging Ports': 'USB Type-C Fast Charge',
      'Connectivity': 'Bluetooth 5.1 (30ft range)',
      'App Support': 'Bose Music App'
    }
  },
  {
    id: 'prod-anker65',
    name: 'Anker Nano II 65W 3-Port GaN PPS Fast Charger',
    slug: 'anker-nano-ii-65w',
    description: 'Say goodbye to your old, clunky multi-chargers. This powerful GaN adapter packs charging speed for phones, tablets, and even high-speed laptops, all in a tiny, heatproof pocket footprint. Built with safety locks to protect your phone motherboard.',
    price: 3850,
    originalPrice: 4500,
    images: [
      'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&q=80&w=600'
    ],
    categoryId: 'cat-accessories',
    brandId: 'brand-anker',
    stock: 25,
    rating: 4.9,
    reviewsCount: 112,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    inFlashSale: false,
    specifications: {
      'Total Output': '65W Max',
      'USB Ports': '2x USB-C PowerIQ3, 1x USB-A',
      'Technology': 'GaN II Innovation',
      'Protection': 'ActiveShield Temperature Safeguard'
    }
  },
  {
    id: 'prod-dualsense',
    name: 'PS5 DualSense Wireless Controller (Midnight Black)',
    slug: 'ps5-dualsense-midnight-black',
    description: 'Discover a deeper, highly immersive gaming experience that brings all screen action to life in the palms of your hands. Features rich, responsive haptic feedback triggers, and a built-in microphone for instant multi-player coordinate sync.',
    price: 7200,
    originalPrice: 8500,
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=600'
    ],
    categoryId: 'cat-gaming',
    brandId: 'brand-sony',
    stock: 15,
    rating: 4.8,
    reviewsCount: 64,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    inFlashSale: true,
    variants: ['Midnight Black', 'Cosmic Red', 'Classic White', 'Starlight Blue'],
    specifications: {
      'Compatibilty': 'PS5 Console, PC (Bluetooth/USB)',
      'Haptic Triggers': 'Dynamic Adaptive Triggers',
      'Motion Sensors': 'Built-in 3x-Axis Gyroscope + Accelerometer',
      'Audio Port': '3.5mm Headphone Jack'
    }
  },
  {
    id: 'prod-xiaomiband8',
    name: 'Xiaomi Smart Band 8 Active (Black Metal)',
    slug: 'xiaomi-smart-band-8-active',
    description: 'A gorgeous, high-refresh AMOLED wrist-display featuring over 150 sport training programs, continuous 24-hr heart tracking and sleep analytics. Sleek waterproof shell with a premium charging system and long battery usage.',
    price: 2950,
    originalPrice: 3800,
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=600'
    ],
    categoryId: 'cat-accessories',
    brandId: 'brand-xiaomi',
    stock: 30,
    rating: 4.4,
    reviewsCount: 56,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    inFlashSale: false,
    specifications: {
      'Display': '1.62 inches AMOLED, 600 nits brightness',
      'Waterproof Depth': '5ATM (Up to 50 meters)',
      'Battery Duration': 'Up to 16 Days standard use',
      'Sensors': 'Acceleration, Heart Rate, SpO2 Blood Oxygen'
    }
  },
  {
    id: 'prod-logikeyboard',
    name: 'Logitech G PRO X mechanical TKL Keyboard',
    slug: 'logitech-g-pro-x-keyboard',
    description: 'Designed in collaboration with elite esport pros. This Tenkeyless mechanical masterpiece features swappable responsive switches, rich LIGHTSYNC RGB per-key coloring, and double-shot matte visual keycaps.',
    price: 13900,
    originalPrice: 15500,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600'
    ],
    categoryId: 'cat-gaming',
    brandId: 'brand-logitech',
    stock: 5,
    rating: 4.7,
    reviewsCount: 29,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    inFlashSale: false,
    variants: ['Blue Clicky Switches', 'Red Linear Switches', 'Brown Tactile Switches'],
    specifications: {
      'Layout': 'TKL Compact Gaming Design',
      'Switch Type': 'Hot-Swappable Pro Grade Switches',
      'Cable': '6ft Detachable High Speed USB Keyboard wire',
      'RGB Control': 'Logitech G HUB desktop suite enabled'
    }
  },
  {
    id: 'prod-securecam',
    name: 'Xiaomi Smart Security Camera 2K (360° Rotatable)',
    slug: 'xiaomi-smart-security-camera-2k',
    description: 'Crystal clear 2K resolution lens with continuous smart 360-degree rotation view, premium infrared night-vision, AI motion alert notification filtering, and real-time talkback audio with built-in mic & speaker.',
    price: 3600,
    originalPrice: 4200,
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600'
    ],
    categoryId: 'cat-smarthome',
    brandId: 'brand-xiaomi',
    stock: 18,
    rating: 4.5,
    reviewsCount: 42,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    inFlashSale: false,
    specifications: {
      'Resolution': '2304 x 1296 (2K Frame rate)',
      'Angle Coverage': '360° Horizontal, 108° Vertical',
      'Storage': 'MicroSD card (up to 256GB) + Cloud Storage',
      'WiFi': '2.4GHz IEEE 802.11b/g/n'
    }
  },
  {
    id: 'prod-g502mouse',
    name: 'Logitech G502 HERO High Performance Gaming Mouse',
    slug: 'logitech-g502-hero',
    description: 'Equipped with Logitech HERO 25K gaming sensor for pixel-perfect tracking. Features 11 custom-mappable buttons, tunable weights, customizable LIGHTSYNC RGB styling, and premium durable switches.',
    price: 5200,
    originalPrice: 6500,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600'
    ],
    categoryId: 'cat-gaming',
    brandId: 'brand-logitech',
    stock: 14,
    rating: 4.8,
    reviewsCount: 156,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    inFlashSale: true,
    specifications: {
      'Sensor': 'HERO 25K Sensor',
      'Resolution': '100 – 25,600 DPI Range',
      'Side Weighting': '5x Adjustable 3.6g extra weights included',
      'Buttons Count': '11 Fully Programmable switches'
    }
  }
];

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-iphone15',
    userName: 'Tanvir Rahman',
    rating: 5,
    comment: 'Super fast service from PLUG N GO! Got the phone in pristine packing within 2 hours in Dhaka. Recommended highly!',
    date: '2026-06-15'
  },
  {
    id: 'rev-2',
    productId: 'prod-iphone15',
    userName: 'Sadia Chowdhury',
    rating: 4,
    comment: 'Phone feels amazing, authentic batch. Had brief confusion on delivery window but they resolved with premium speed over WhatsApp.',
    date: '2026-06-18'
  },
  {
    id: 'rev-3',
    productId: 'prod-anker65',
    userName: 'Asif Mahmud',
    rating: 5,
    comment: 'Best charger ever, easily power runs my MacBook and Samsung device at once. Got my order confirmed instantly on WhatsApp!',
    date: '2026-06-20'
  }
];

export const DEFAULT_ORDERS: WhatsAppOrder[] = [
  {
    id: 'PNG-ORDER-9182',
    products: [
      { name: 'iPhone 15 Pro Max (Titanium Natural) - 256GB', qty: 1, price: 138500 },
      { name: 'Anker Nano II 65W 3-Port GaN PPS Fast Charger', qty: 1, price: 3850 }
    ],
    totalPrice: 142350,
    orderDate: '2026-06-21',
    customerName: 'Samiul Al-Kadir',
    customerPhone: '01827364521',
    status: 'Pending'
  },
  {
    id: 'PNG-ORDER-9381',
    products: [
      { name: 'Xiaomi Smart Band 8 Active Black Metal', qty: 1, price: 2950 }
    ],
    totalPrice: 2950,
    orderDate: '2026-06-22',
    customerName: 'Meherun Nesa',
    customerPhone: '01711223344',
    status: 'Completed'
  }
];
