import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

import fs from 'fs/promises';
import { ProductDto } from './app/models/product.model';
import { AdminCredentials } from './app/models/admin.model';

// Get the directory path of the current module file
const __dirname = dirname(fileURLToPath(import.meta.url));

// Example Express Rest API endpoints
app.get('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.query;
    const adminData: AdminCredentials = JSON.parse(
      await fs.readFile(
        resolve(__dirname, '../browser/data/admin.json'),
        'utf-8'
      )
    );

    if (
      username?.toString().toLowerCase() === adminData.username &&
      password == adminData.password
    ) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/admin/products', async (req, res) => {
  try {
    const newProduct = req.body;
    const products = JSON.parse(
      await fs.readFile(resolve(__dirname, 'src/data/products.json'), 'utf-8')
    );
    products.push(newProduct);
    await fs.writeFile(
      resolve(__dirname, '../browser/data/products.json'),
      JSON.stringify(products, null, 2)
    );
    res.json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/products/search', async (req, res) => {
  try {
    const { trackingCode, productId } = req.query;
    console.log('req', req.query);
    const products: ProductDto[] = JSON.parse(
      await fs.readFile(
        resolve(__dirname, '../browser/data/products.json'),
        'utf-8'
      )
    );
    const product = products.find(
      (p) => p.trackingId == trackingCode || p.id == productId
    );
    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/admin/products', async (req, res) => {
  try {
    console.log('req', req.query);
    const products: ProductDto[] = JSON.parse(
      await fs.readFile(
        resolve(__dirname, '../browser/data/products.json'),
        'utf-8'
      )
    );
    console.log(products);
    if (products.length > 0) {
      res.json({ success: true, data: products });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Serve static files from /browser
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('*', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;
  console.log('orirignalURL', originalUrl);
  if (originalUrl.startsWith('/api/')) {
    // Prevent Angular from handling API routes
    return res
      .status(404)
      .json({ success: false, message: 'API route not found' });
  }
  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
  return;
});

// Global Error Handling (prevents crashes)
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
