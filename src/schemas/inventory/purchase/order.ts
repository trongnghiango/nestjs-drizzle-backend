// 5. Purchase Order (Đơn nhập hàng)
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { store } from '../../core/store.schema';
import { supplier } from '../../core/supplier.schema';
import { purchaseOrderDetails } from './orderDetails';
import { goodsReceipt } from '../receipt/goodsReceipt';

export const purchaseOrder = pgTable('purchase_order', {
  id: serial('id').primaryKey(),
  storeId: integer('store_id').notNull(),
  supplierId: integer('supplier_id').notNull(),
  orderDate: timestamp('order_date').notNull(),
  expectedDeliveryDate: timestamp('expected_delivery_date'),
  status: varchar('status', { length: 50 }).default('pending'),
});

export const purchaseOrderRelations = relations(
  purchaseOrder,
  ({ one, many }) => ({
    store: one(store, {
      fields: [purchaseOrder.storeId],
      references: [store.id],
    }),
    supplier: one(supplier, {
      fields: [purchaseOrder.supplierId],
      references: [supplier.id],
    }),
    details: many(purchaseOrderDetails),
    goodsReceipts: many(goodsReceipt),
  }),
);
