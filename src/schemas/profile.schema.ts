import { integer, jsonb, pgTable, serial } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const profile = pgTable('profile', {
  id: serial().primaryKey(),
  metadata: jsonb('metadata'),
  userId: integer('userId').references(() => users.id),
});
