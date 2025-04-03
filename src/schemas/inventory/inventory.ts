// 4. Inventory (Tồn kho)
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { product } from '../core/product.schema';
import { store } from '../core/store.schema';
import { relations } from 'drizzle-orm';

export const inventory = pgTable(
  'inventory',
  {
    productId: integer('product_id').notNull(),
    storeId: integer('store_id').notNull(),
    quantity: integer('quantity').notNull().default(0),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.productId, table.storeId] }),
  }),
);

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(product, {
    fields: [inventory.productId],
    references: [product.id],
  }),
  store: one(store, {
    fields: [inventory.storeId],
    references: [store.id],
  }),
}));
