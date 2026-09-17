import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import { router } from './routes.js';

/**
 * Builds the Express app without binding a port, so the same app serves both
 * the long-running local server (src/index.js) and the Vercel function
 * (api/index.js).
 */
export const createApp = () => {
  const app = express();
  app.disable('x-powered-by');
  // Both hosts terminate TLS at a proxy, so the socket peer is always the
  // proxy. Trusting one hop makes req.ip the real client address, which is what
  // the login rate limiter keys on — without it every visitor shares one bucket.
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: config.frontendOrigins }));
  app.use(express.json());

  app.use('/api', router);

  // 404 for unknown API routes.
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

  // Centralized error handler.
  app.use((err, _req, res, _next) => {
    console.error('unhandled error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  });

  return app;
};
