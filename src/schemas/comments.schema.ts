import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { posts } from './posts.schema';
import { users } from './users.schema';

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  authorId: integer('authorId').references(() => users.id),
  postId: integer('postId').references(() => posts.id),
});
