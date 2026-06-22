/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// Import default data from client files for seamless seeding of full-stack DB
import {
  DEFAULT_PRODUCTS,
  DEFAULT_CATEGORIES,
  DEFAULT_BRANDS,
  DEFAULT_BANNERS,
  DEFAULT_SETTINGS,
  DEFAULT_REVIEWS,
  DEFAULT_ORDERS
} from './src/data';

import {
  DEFAULT_COUPONS,
  DEFAULT_CUSTOMERS,
  DEFAULT_ADMIN_USERS,
  DEFAULT_ACTIVITY_LOGS
} from './src/utils';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const DB_FILE = path.join(process.cwd(), 'db-store.json');

  app.use(express.json({ limit: '10mb' }));

  // Helper to save database to disk
  function saveDb(data: any) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('[DATABASE-ERROR] Failed to persist data to db-store.json:', err);
    }
  }

  // Helper to load database from disk or seed default state
  function loadDb() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const content = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(content);
        // Ensure all required fields exist
        if (parsed && typeof parsed === 'object') {
          return {
            settings: parsed.settings ?? DEFAULT_SETTINGS,
            products: parsed.products ?? DEFAULT_PRODUCTS,
            categories: parsed.categories ?? DEFAULT_CATEGORIES,
            brands: parsed.brands ?? DEFAULT_BRANDS,
            banners: parsed.banners ?? DEFAULT_BANNERS,
            orders: parsed.orders ?? DEFAULT_ORDERS,
            reviews: parsed.reviews ?? DEFAULT_REVIEWS,
            coupons: parsed.coupons ?? DEFAULT_COUPONS,
            customers: parsed.customers ?? DEFAULT_CUSTOMERS,
            adminUsers: parsed.adminUsers ?? DEFAULT_ADMIN_USERS,
            activityLogs: parsed.activityLogs ?? DEFAULT_ACTIVITY_LOGS
          };
        }
      } catch (err) {
        console.error('[DATABASE-ERROR] Parsing db-store.json failed, resetting defaults:', err);
      }
    }

    // Initialize with default datasets from client source code
    const initialDb = {
      settings: DEFAULT_SETTINGS,
      products: DEFAULT_PRODUCTS,
      categories: DEFAULT_CATEGORIES,
      brands: DEFAULT_BRANDS,
      banners: DEFAULT_BANNERS,
      orders: DEFAULT_ORDERS,
      reviews: DEFAULT_REVIEWS,
      coupons: DEFAULT_COUPONS,
      customers: DEFAULT_CUSTOMERS,
      adminUsers: DEFAULT_ADMIN_USERS,
      activityLogs: DEFAULT_ACTIVITY_LOGS
    };
    saveDb(initialDb);
    return initialDb;
  }

  // Initialize db-store file on boot
  let dbState = loadDb();

  // Disable caching on entire API subroutes
  app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // REST API: Load all shared collections
  app.get('/api/store-data', (req, res) => {
    try {
      // Reload from disk to fetch any file insertions/restarts
      dbState = loadDb();
      console.log(`[API] Fetched shared store data - ${dbState.products.length} products total.`);
      res.json(dbState);
    } catch (err: any) {
      console.error('[API-ERROR] Fetching store-data failed:', err);
      res.status(500).json({ error: 'Database failed to load store configurations', details: err.message });
    }
  });

  // REST API: Save/Sync specific single collection state
  app.post('/api/sync', (req, res) => {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Sync payload must specify a data "key" and "value" list.' });
    }

    try {
      // Re-read to prevent race overrides
      dbState = loadDb();
      
      // Update targeted field
      dbState[key] = value;
      saveDb(dbState);

      const itemsNum = Array.isArray(value) ? `${value.length} items` : 'object';
      console.log(`[API-SYNC] Successfully written "${key}" to central database (${itemsNum}).`);
      res.json({ success: true, key, items: value.length });
    } catch (err: any) {
      console.error(`[API-ERROR] Syncing key "${key}" failed:`, err);
      res.status(500).json({ error: 'Database failed to persist synchronized record', details: err.message });
    }
  });

  // REST API: Single health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // Configure Vite Development Server or Static Build output handlers
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('[SYSTEM] Node/Vite development server loaded in middleware mode.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[SYSTEM] Node server mounted production static build handlers from /dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SYSTEM] Full-stack engine listening on network port *:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('[SYSTEM-CRITICAL] Failed to bootstrap node server process:', error);
});
