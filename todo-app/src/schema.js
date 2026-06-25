import { smallint } from 'drizzle-orm/gel-core';
import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';

export const todosTable = sqliteTable('todos', {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  done: int({ mode: 'boolean' }).notNull(),
  priority: text({ enum: ['low', 'medium', 'high'] })
    .default('medium')
    .notNull(),
});

export const usersTable = sqliteTable('users', {
  id: int().primaryKey({ autoIncrement: true }),
  email: text().notNull(),
  hash: text().notNull(),
  salt: text().notNull(),
  token: text().notNull(),
});
