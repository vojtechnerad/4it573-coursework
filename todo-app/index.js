import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import ejs from 'ejs';

import { drizzle } from 'drizzle-orm/libsql';
import { todosTable } from './src/schema.js';
import { eq } from 'drizzle-orm';

const db = drizzle({
  connection: 'file:db.sqlite',
  logger: true,
});

const app = new Hono();

app.get('/', async (c) => {
  const todos = await db.select().from(todosTable).all();
  const html = await ejs.renderFile('views/index.html', {
    todos,
  });
  return c.html(html);
});

app.get('/todo/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const todos = await db.select().from(todosTable).all();
  const todo = todos.find((todo) => todo.id === id);

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

  return c.redirect('/');
});

app.post('update-todo', async (c) => {
  const body = await c.req.formData();
  const id = Number(body.get('id'));
  const title = body.get('title');
  let todo = todos.find((todo) => todo.id === id);

  if (todo) {
    todo.title = title;

    return c.redirect(`/todo/${id}`);
  } else {
    const html = await ejs.renderFile('views/404.html');
    return c.html(html);
  }
});

app.get('/remove-todo/:id', async (c) => {
  const id = Number(c.req.param('id'));
  todos = todos.filter((todo) => todo.id !== id);
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

serve({
  fetch: app.fetch,
  port: 8000,
});
