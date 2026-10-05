import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import { router } from './routes.js';






export const createApp = () => {
  const app = express();
  app.disable('x-powered-by');
  
  
  
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: config.frontendOrigins }));
  app.use(express.json());

  app.use('/api', router);

  
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

  
  app.use((err, _req, res, _next) => {
    console.error('unhandled error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  });

  return app;
};
