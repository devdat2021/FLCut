import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

if (globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma;
} else {
    // 1. Create a native PostgreSQL connection pool 
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    // 2. Instantiate the Prisma 7 adapter wrapper
    const adapter = new PrismaPg(pool);

    // 3. Feed the non-empty options object explicitly into the constructor!
    prismaInstance = new PrismaClient({ adapter });

    if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = prismaInstance;
    }
}

export const prisma = prismaInstance;