import cors from 'cors';

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const isLocalDevOrigin = (origin: string) =>
  process.env.NODE_ENV !== 'production' && /^https?:\/\/localhost(:\d+)?$/.test(origin);

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, same-origin Vercel)
    if (!origin || allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
