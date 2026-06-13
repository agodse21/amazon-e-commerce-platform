import './loadEnv.js';
import './types/express.js';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middleware/corsMiddleware.js';
import { sessionMiddleware } from './middleware/sessionMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import wishlistRoutes from './routes/wishlist.js';

export function createApp() {
  const app = express();

  // Vercel sits behind a reverse proxy — required for rate limiting and secure cookies
  app.set('trust proxy', 1);

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:', 'http:'],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      },
    })
  );

  app.use(corsMiddleware);

  // Body Parsers
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());

  // Session (assigns sessionId cookie to every request)
  app.use(sessionMiddleware);

  // Rate Limiting
  if (process.env.NODE_ENV === 'production') {
    app.use(apiLimiter);
  }

  // Health Check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/wishlist', wishlistRoutes);

  // 404 + Error Handlers
  app.use('/api/*', notFoundHandler);
  app.use(errorHandler);

  return app;
}
