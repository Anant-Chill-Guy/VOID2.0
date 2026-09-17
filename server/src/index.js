import { createApp } from './app.js';
import { config } from './config.js';
import { query } from './db.js';

// Long-running entry point only — `npm run dev:server` locally, and the Railway
// host if that is still in use. Vercel never reaches this file: api/index.js
// builds the app from app.js and the platform owns the listener, which is why
// the heartbeat below is safe to keep here.

// Heartbeat: keeps the Neon compute awake so the first request after idle
// doesn't pay a 4-10s cold-start (free-tier Neon suspends after ~5 min idle).
setInterval(() => {
  query('SELECT 1').catch(() => {});
}, 2 * 60 * 1000);

const app = createApp();

app.listen(config.port, () => {
  console.log(`VOID server listening on http://localhost:${config.port}`);
});
