// 9. User (Người dùng/Khách hàng)
import { relations } from 'drizzle-orm';
import { boolean, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { sale } from './sale/sale.schema';

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  address: text('address').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  isActivated: boolean('is_activated').notNull().default(false),
});

export const userRelations = relations(user, ({ many }) => ({
  sales: many(sale),
}));
