// 7. Goods Receipt (Phiếu nhập kho)
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { purchaseOrder } from '../purchase/order';
import { goodsReceiptDetails } from './goodsReceiptDetails';

export const goodsReceipt = pgTable('goods_receipt', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  receiptDate: timestamp('receipt_date').notNull(),
  notes: text('notes'),
});

export const goodsReceiptRelations = relations(
  goodsReceipt,
  ({ one, many }) => ({
    order: one(purchaseOrder, {
      fields: [goodsReceipt.orderId],
      references: [purchaseOrder.id],
    }),
    details: many(goodsReceiptDetails),
  }),
);
