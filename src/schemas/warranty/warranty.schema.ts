// 12. Warranty (Bảo hành)
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { saleDetails } from '../sales/sale/saleDetails.schema';
import { warrantyService } from './service.schema';

export const warranty = pgTable('warranty', {
  id: serial('id').primaryKey(),
  saleId: integer('sale_id').notNull(),
  productId: integer('product_id').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: varchar('status', { length: 20 }).default('active'),
  warrantyCode: varchar('warranty_code', { length: 100 }).notNull().unique(),
});

export const warrantyRelations = relations(warranty, ({ one, many }) => ({
  saleDetail: one(saleDetails, {
    fields: [warranty.saleId, warranty.productId],
    references: [saleDetails.saleId, saleDetails.productId],
  }),
  services: many(warrantyService),
}));
