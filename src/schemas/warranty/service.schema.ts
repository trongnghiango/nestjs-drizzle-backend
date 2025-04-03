// 13. Warranty Service (Dịch vụ bảo hành)
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { warranty } from './warranty.schema';
import { relations } from 'drizzle-orm';

export const warrantyService = pgTable('warranty_service', {
  id: serial('id').primaryKey(),
  warrantyId: integer('warranty_id').notNull(),
  serviceType: varchar('service_type', { length: 50 }).notNull(),
  serviceDate: timestamp('service_date').notNull(),
  technicianId: varchar('technician_id', { length: 20 }),
  cost: integer('cost').default(0),
  description: text('description'),
  status: varchar('status', { length: 20 }).default('pending'),
});

export const warrantyServiceRelations = relations(
  warrantyService,
  ({ one }) => ({
    warranty: one(warranty, {
      fields: [warrantyService.warrantyId],
      references: [warranty.id],
    }),
  }),
);
