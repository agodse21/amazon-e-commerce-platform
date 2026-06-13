import dotenv from 'dotenv';
import path from 'path';

// Load repo-root .env before any other app module reads process.env.
// ESM hoists static imports, so this must be imported first from app.ts.
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
}
