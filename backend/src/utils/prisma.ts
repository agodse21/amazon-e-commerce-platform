import { PrismaClient, type Prisma } from '@prisma/client';
import { neon } from '@neondatabase/serverless';
import { PrismaNeonHTTP } from '@prisma/adapter-neon';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const devLog = ['query', 'error', 'warn'] as Prisma.LogLevel[];
const prodLog = ['error'] as Prisma.LogLevel[];

function createNeonClient(log: Prisma.LogLevel[]): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  const sql = neon(process.env.DATABASE_URL);
  const adapter = new PrismaNeonHTTP(sql);

  const options = {
    adapter,
    log,
  } as Prisma.PrismaClientOptions;

  return new PrismaClient(options);
}

function createPrismaClient(): PrismaClient {
  const log = process.env.NODE_ENV === 'development' ? devLog : prodLog;

  // Vercel + Neon: HTTP driver adapter (no query-engine binary or ws to bundle)
  if (process.env.VERCEL === '1') {
    return createNeonClient(log);
  }

  return new PrismaClient({ log });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Reuse one client per warm serverless instance
globalForPrisma.prisma = prisma;
