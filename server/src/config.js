import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const required = ['DATABASE_URL', 'ADMIN_PASSWORD', 'AUTH_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  
  
  throw new Error(`Missing required env vars: ${missing.join(', ')}`);
}



const parseOrigins = (raw) =>
  String(raw || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

export const config = {
  port: Number(process.env.PORT || 8080),
  databaseUrl: process.env.DATABASE_URL,
  adminPassword: process.env.ADMIN_PASSWORD,
  authSecret: process.env.AUTH_SECRET,
  frontendOrigins: parseOrigins(process.env.FRONTEND_ORIGIN),
  tokenTtlMs: 60 * 60 * 1000, 
};
