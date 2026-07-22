import { PrismaClient } from "../generated/prisma"

// Tránh tạo nhiều instance PrismaClient khi hot-reload ở môi trường dev.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : [],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

// Cờ cho biết database đã được cấu hình hay chưa (dùng để fallback).
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL)
