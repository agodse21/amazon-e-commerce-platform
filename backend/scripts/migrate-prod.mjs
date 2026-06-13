import { config } from 'dotenv';
import { spawnSync } from 'child_process';
import { resolve } from 'path';

if (!process.env.DATABASE_URL) {
  config({ path: resolve(process.cwd(), '../.env') });
}

if (!process.env.DATABASE_URL) {
  console.error(
    'DATABASE_URL is not set. Add it to .env at the repo root or export it in your shell.'
  );
  process.exit(1);
}

const result = spawnSync('prisma', ['migrate', 'deploy'], {
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
