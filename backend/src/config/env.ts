import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/school_erp',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
};
