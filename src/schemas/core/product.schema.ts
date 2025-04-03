// 3. Product (Sản phẩm)
import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { supplier } from './supplier.schema';
import { warranty } from '../warranty/warranty.schema';
import { saleDetails } from '../sales/sale/saleDetails.schema';
import { inventory } from '../inventory/inventory';
import { purchaseOrderDetails } from '../inventory/purchase/orderDetails';

export const product = pgTable('product', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  price: integer('price').notNull(),
  supplierId: integer('supplier_id').notNull(),
});

export const productRelations = relations(product, ({ one, many }) => ({
  supplier: one(supplier, {
    fields: [product.supplierId],
    references: [supplier.id],
  }),
  inventories: many(inventory),
  purchaseOrderDetails: many(purchaseOrderDetails),
  saleDetails: many(saleDetails),
  warranties: many(warranty),
}));
