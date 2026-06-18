import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaNeon } from '@prisma/adapter-neon';

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient | undefined;
};

const dbUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";

let prisma: PrismaClient;

const isLocal = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");

if (process.env.NODE_ENV === 'production') {
  const adapter = isLocal 
    ? new PrismaPg({ connectionString: dbUrl }) 
    : new PrismaNeon({ connectionString: dbUrl });
  prisma = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.prisma) {
    const adapter = isLocal 
      ? new PrismaPg({ connectionString: dbUrl }) 
      : new PrismaNeon({ connectionString: dbUrl });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prisma = globalForPrisma.prisma;
}

export { prisma };
export default prisma;
