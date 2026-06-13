/**
 * Local development server
 * Env resolution strategy (workspace-aware):
 *  - When run via root `npm run dev` (cwd = project root) → .env at ./
 *  - When run standalone from backend/       (cwd = backend/) → .env at ../
 */
import { createApp } from './app.js';

const PORT = parseInt(process.env.PORT ?? '3001', 10);
const app = createApp();

app.listen(PORT, () => {
  console.log(`\n🚀  API server running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Env:    ${process.env.NODE_ENV ?? 'development'}\n`);
});
