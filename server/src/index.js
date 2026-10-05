import { createApp } from './app.js';
import { config } from './config.js';
import { query } from './db.js';








setInterval(() => {
  query('SELECT 1').catch(() => {});
}, 2 * 60 * 1000);

const app = createApp();

app.listen(config.port, () => {
  console.log(`VOID server listening on http://localhost:${config.port}`);
});
