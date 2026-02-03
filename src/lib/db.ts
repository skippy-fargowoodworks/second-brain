import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create adapter factory
const adapterFactory = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? '',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// Create Prisma client with adapter factory
// PrismaClient will call connect() internally
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: adapterFactory as any })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
