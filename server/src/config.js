import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const required = ['DATABASE_URL', 'ADMIN_PASSWORD', 'AUTH_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  // Thrown rather than process.exit'd: on Vercel this module is imported inside
  // a request, and exiting there kills the invocation before a response is sent.
  throw new Error(`Missing required env vars: ${missing.join(', ')}`);
}

// FRONTEND_ORIGIN accepts a comma-separated list of allowed origins so the
// backend can be reached from both the local dev server and deployed frontends.
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
  tokenTtlMs: 60 * 60 * 1000, // 1h
};
