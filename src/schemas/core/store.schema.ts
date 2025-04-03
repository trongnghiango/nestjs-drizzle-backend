import { relations } from 'drizzle-orm';
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { inventory } from '../inventory/inventory';
import { sale } from '../sales/sale/sale.schema';

// Table
export const store = pgTable('store', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
});

// Relations
export const storeRelations = relations(store, ({ many }) => ({
  inventories: many(inventory),
  sales: many(sale),
}));
