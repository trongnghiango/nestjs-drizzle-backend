// 10. Sale (Đơn bán hàng)
import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { store } from '../../core/store.schema';
import { user } from '../customer.schema';
import { saleDetails } from './saleDetails.schema';
import { warranty } from '../../warranty/warranty.schema';

export const sale = pgTable('sale', {
  id: serial('id').primaryKey(),
  storeId: integer('store_id').notNull(),
  userId: integer('user_id').notNull(),
  saleDate: timestamp('sale_date').notNull(),
  totalAmount: integer('total_amount').notNull(),
});

export const saleRelations = relations(sale, ({ one, many }) => ({
  store: one(store, {
    fields: [sale.storeId],
    references: [store.id],
  }),
  user: one(user, {
    fields: [sale.userId],
    references: [user.id],
  }),
  details: many(saleDetails),
  warranties: many(warranty),
}));
