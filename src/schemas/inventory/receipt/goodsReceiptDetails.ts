// 8. Goods Receipt Details (Chi tiết nhập kho)
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { goodsReceipt } from './goodsReceipt';
import { product } from '../../core/product.schema';

export const goodsReceiptDetails = pgTable(
  'goods_receipt_details',
  {
    receiptId: integer('receipt_id').notNull(),
    productId: integer('product_id').notNull(),
    quantityReceived: integer('quantity_received').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.receiptId, table.productId] }),
  }),
);

export const goodsReceiptDetailsRelations = relations(
  goodsReceiptDetails,
  ({ one }) => ({
    receipt: one(goodsReceipt, {
      fields: [goodsReceiptDetails.receiptId],
      references: [goodsReceipt.id],
    }),
    product: one(product, {
      fields: [goodsReceiptDetails.productId],
      references: [product.id],
    }),
  }),
);
