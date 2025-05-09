import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial().primaryKey(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  email: text('email').notNull(),
});
