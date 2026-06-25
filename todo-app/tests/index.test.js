import test from 'ava';
import { app } from '../src/app.js';

test('it shows todos', async (t) => {
  const response = await app.request('/');
  const html = response.text();
  t.assert(html.includes('Todo seznam'));
});
