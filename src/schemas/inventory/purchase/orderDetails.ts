// 6. Purchase Order Details (Chi tiết đơn nhập)
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { purchaseOrder } from './order';
import { product } from '../../core/product.schema';

export const purchaseOrderDetails = pgTable(
  'purchase_order_details',
  {
    orderId: integer('order_id').notNull(),
    productId: integer('product_id').notNull(),
    quantityOrdered: integer('quantity_ordered').notNull(),
    unitCost: integer('unit_cost').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.orderId, table.productId] }),
  }),
);

export const purchaseOrderDetailsRelations = relations(
  purchaseOrderDetails,
  ({ one }) => ({
    order: one(purchaseOrder, {
      fields: [purchaseOrderDetails.orderId],
      references: [purchaseOrder.id],
    }),
    product: one(product, {
      fields: [purchaseOrderDetails.productId],
      references: [product.id],
    }),
  }),
);
