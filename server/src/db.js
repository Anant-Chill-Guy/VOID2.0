import pg from 'pg';
import { config } from './config.js';

const isLocal = config.databaseUrl.includes('localhost');

const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  // Module scope already gives a serverless container one pool shared across
  // warm invocations; the cap keeps a traffic spike from opening the driver's
  // default ten connections per container against Neon.
  max: 3,
});

export const query = (text, params) => pool.query(text, params);
