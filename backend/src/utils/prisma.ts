import { PrismaClient, type Prisma } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const devLog = ['query', 'error', 'warn'] as Prisma.LogLevel[];
const prodLog = ['error'] as Prisma.LogLevel[];

function createNeonClient(log: Prisma.LogLevel[]): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const options = {
    adapter: new PrismaNeon(pool),
    log,
  } as Prisma.PrismaClientOptions;

  return new PrismaClient(options);
}

function createPrismaClient(): PrismaClient {
  const log = process.env.NODE_ENV === 'development' ? devLog : prodLog;

  // Vercel + Neon: use the serverless driver adapter (no query-engine binary to bundle)
  if (process.env.VERCEL === '1') {
    return createNeonClient(log);
  }

  return new PrismaClient({ log });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Reuse one client per warm serverless instance
globalForPrisma.prisma = prisma;
