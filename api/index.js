






import { createApp } from '../server/src/app.js';


let app;
try {
  app = createApp();
} catch (err) {
  
  
  
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
