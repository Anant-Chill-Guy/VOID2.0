// Vercel entry point for the Express backend. vercel.json rewrites /api/:path*
// here, and Vercel preserves the original pathname through that rewrite, so the
// app's own `app.use('/api', router)` mounting still matches.
//
// This file is the whole backend on Vercel: the frontend is served as static
// files from dist/ and server/src/index.js (the listener + Neon heartbeat) is
// never imported.
import { createApp } from '../server/src/app.js';

// Built once per container and reused across warm invocations.
let app;
try {
  app = createApp();
} catch (err) {
  // createApp throws when the environment is incomplete. Letting that escape at
  // module scope would surface as an opaque FUNCTION_INVOCATION_FAILED, so the
  // reason is logged and answered by the handler instead.
  console.error('API boot failed:', err.message);
}

export default function handler(req, res) {
  if (!app) {
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Server misconfigured: check the environment variables.' }));
    return;
  }
  return app(req, res);
}
