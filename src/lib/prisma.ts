import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool as NeonPool } from '@neondatabase/serverless';

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
  neonPool: NeonPool | undefined;
};

const dbUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";

let prisma: PrismaClient;

const isLocal = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");

if (isLocal) {
  // Local development using pg + @prisma/adapter-pg
  let pool: Pool;
  if (process.env.NODE_ENV === 'production') {
    pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  } else {
    if (!globalForPrisma.pool) {
      globalForPrisma.pool = new Pool({ connectionString: dbUrl });
    }
    pool = globalForPrisma.pool;
    
    if (!globalForPrisma.prisma) {
      const adapter = new PrismaPg(pool);
      globalForPrisma.prisma = new PrismaClient({ adapter });
    }
    prisma = globalForPrisma.prisma;
  }
} else {
  // Production / Cloud using Neon serverless driver
  if (process.env.NODE_ENV === 'production') {
    const pool = new NeonPool({ connectionString: dbUrl });
    const adapter = new PrismaNeon(pool);
    prisma = new PrismaClient({ adapter });
  } else {
    if (!globalForPrisma.neonPool) {
      globalForPrisma.neonPool = new NeonPool({ connectionString: dbUrl });
    }
    const pool = globalForPrisma.neonPool;
    
    if (!globalForPrisma.prisma) {
      const adapter = new PrismaNeon(pool);
      globalForPrisma.prisma = new PrismaClient({ adapter });
    }
    prisma = globalForPrisma.prisma;
  }
}

export { prisma };
export default prisma;
