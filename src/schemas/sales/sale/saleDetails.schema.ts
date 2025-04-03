// 11. Sale Details (Chi tiết đơn bán)
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { sale } from './sale.schema';
import { relations } from 'drizzle-orm';
import { product } from '../../core/product.schema';

export const saleDetails = pgTable(
  'sale_details',
  {
    saleId: integer('sale_id').notNull(),
    productId: integer('product_id').notNull(),
    quantitySold: integer('quantity_sold').notNull(),
    unitPrice: integer('unit_price').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.saleId, table.productId] }),
  }),
);

export const saleDetailsRelations = relations(saleDetails, ({ one }) => ({
  sale: one(sale, {
    fields: [saleDetails.saleId],
    references: [sale.id],
  }),
  product: one(product, {
    fields: [saleDetails.productId],
    references: [product.id],
  }),
}));
