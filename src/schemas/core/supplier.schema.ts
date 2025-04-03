// 2. Supplier (Nhà cung cấp)
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { product } from './product.schema';
import { purchaseOrder } from '../inventory/purchase/order';

export const supplier = pgTable('supplier', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
});

export const supplierRelations = relations(supplier, ({ many }) => ({
  products: many(product),
  purchaseOrders: many(purchaseOrder),
}));
