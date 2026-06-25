import { drizzle } from 'drizzle-orm/libsql';
import crypto from 'crypto';
import { usersTable } from './schema.js';

export const db = drizzle({
  connection:
    process.env.NODE_ENV === 'test' ? 'file::memory' : 'file:db.sqlite',
  logger: true,
});

export const createUser = async (email, hash) => {
  const salt = crypto.randomBytes(32).toString('base64');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10_000, 64, 'sha512')
    .toString('base64');
  const [user] = await db
    .insert(usersTable)
    .values({ email, hash, salt })
    .returning('*');
  return user;
};

export const retrieveUser = async (email, password) => {
  const user = await db
    .select()
    .from(usersTable)
    .where(usersTable.email.eq(email))
    .first();
};
