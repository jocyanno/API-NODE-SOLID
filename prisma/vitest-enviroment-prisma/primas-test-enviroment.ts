import { prisma } from '@/lib/prisma';
import { execSync } from 'child_process';
import { randomUUID } from 'node:crypto';
import 'dotenv/config';
import type { Environment } from 'vitest/environments';

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the environment variables');
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schema);
  return url.toString();
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema);

    console.log(databaseUrl)

    process.env.DATABASE_URL = databaseUrl;

    execSync('npx prisma migrate deploy')
    return {
      async teardown() {
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);

        await prisma.$disconnect();
      }
    }
  }
}