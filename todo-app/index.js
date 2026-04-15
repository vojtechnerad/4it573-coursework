import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import ejs from 'ejs';
import { createNodeWebSocket } from '@hono/node-ws';

import { drizzle } from 'drizzle-orm/libsql';
import { todosTable } from './src/schema.js';
import { eq } from 'drizzle-orm';
import { WSContext } from 'hono/ws';

const db = drizzle({
  connection: 'file:db.sqlite',
  logger: true,
});

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

/**
 * @type {Set<WSContext<WebSocket>>}
 */
let webSockets = new Set();

app.get(
  '/ws',
  upgradeWebSocket((c) => ({
    onOpen: (evt, ws) => {
      webSockets.add(ws);
      console.log('open web sockets:', webSockets.size);
    },
    onMessage: () => {
      console.log('message');
    },
    onClose: (evt, ws) => {
      console.log('close');
      webSockets.delete(ws);
    },
  })),
);

app.get('/', async (c) => {
  const todos = await db.select().from(todosTable).all();
  const html = await ejs.renderFile('views/index.html', {
    todos,
  });
  return c.html(html);
});

app.get('/todo/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const todo = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, id))
    .get();

  if (todo) {
    const html = await ejs.renderFile('views/todo-detail.html', {
      todo,
    });
    return c.html(html);
  } else {
    const html = await ejs.renderFile('views/404.html');
    return c.html(html);
  }
});

app.post('add-todo', async (c) => {
  const body = await c.req.formData();
  const title = body.get('title');
  await db.insert(todosTable).values({
    title,
    done: false,
  });

  sendTodosToAllWebsockets();

  return c.redirect('/');
});

app.post('update-todo', async (c) => {
  const body = await c.req.formData();
  const id = Number(body.get('id'));
  const title = body.get('title');
  const priority = body.get('priority');

  await db
    .update(todosTable)
    .set({ title, priority })
    .where(eq(todosTable.id, id));

  sendTodosToAllWebsockets();

  return c.redirect(`/todo/${id}`);
});

app.get('/remove-todo/:id', async (c) => {
  const id = Number(c.req.param('id'));
  await db.delete(todosTable).where(eq(todosTable.id, id));

  sendTodosToAllWebsockets();

  return c.redirect('/');
});

app.get('/toggle-todo/:id', async (c) => {
  const id = Number(c.req.param('id'));

  const todo = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, id))
    .get();

  await db
    .update(todosTable)
    .set({ done: !todo.done })
    .where(eq(todosTable.id, id));

  sendTodosToAllWebsockets();

  const referer = c.req.header('Referer');
  return c.redirect(referer || '/');
});

app.get('/styles/:file', async (c) => {
  const file = c.req.param('file');
  const css = await ejs.renderFile(`styles/${file}`);
  return c.text(css, 200, {
    'Content-Type': 'text/css',
  });
});

app.notFound(async (c) => {
  const html = await ejs.renderFile('views/404.html');
  return c.html(html);
});

const sendTodosToAllWebsockets = async () => {
  try {
    const todos = await db.select().from(todosTable).all();

    const html = await ejs.renderFile('views/_todos.html', {
      todos,
    });

    for (const webSocket of webSockets) {
      webSocket.send(
        JSON.stringify({
          type: 'todos',
          html,
        }),
      );
    }
  } catch (e) {
    console.error(e);
  }
};

const server = serve({
  fetch: app.fetch,
  port: 8000,
});

injectWebSocket(server);
