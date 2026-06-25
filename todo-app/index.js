import { serve } from '@hono/node-server';
import { app, injectWebSocket } from './src/app.js';

const server = serve({
  fetch: app.fetch,
  port: 8000,
});

injectWebSocket(server);
