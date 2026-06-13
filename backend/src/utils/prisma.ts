import { PrismaClient, type Prisma } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const devLog = ['query', 'error', 'warn'] as Prisma.LogLevel[];
const prodLog = ['error'] as Prisma.LogLevel[];

function createPrismaClient(): PrismaClient {
  const log = process.env.NODE_ENV === 'development' ? devLog : prodLog;
  return new PrismaClient({ log });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Reuse one client per warm serverless instance
globalForPrisma.prisma = prisma;
