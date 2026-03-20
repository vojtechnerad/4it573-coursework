import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import ejs from 'ejs';

const app = new Hono();

let todos = [
  { id: 1, title: 'Zajit na pivo', isDone: false },
  { id: 2, title: 'Jit se uci node.js', isDone: true },
];

app.get('/', async (c) => {
  const html = await ejs.renderFile('views/index.html', {
    todos,
  });
  return c.html(html);
});

app.post('add-todo', async (c) => {
  const body = await c.req.formData();
  const title = body.get('title');
  todos.push({
    id: todos.length + 1,
    title,
    isDone: false,
  });
  return c.redirect('/');
});

app.get('/remove-todo/:id', async (c) => {
  const id = Number(c.req.param('id'));
  todos = todos.filter((todo) => todo.id !== id);
  return c.redirect('/');
});

app.get('/toggle-todo/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const todo = todos.find((todo) => todo.id === id);
  todo.isDone = !todo.isDone;
  return c.redirect('/');
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
