# Note


### code

```ts
// schema.ts
import {
  pgTable, serial, text, varchar, integer, timestamp, boolean,
  primaryKey, foreignKey, relations
} from 'drizzle-orm/pg-core';

// 1. Store (Cửa hàng)
export const store = pgTable('store', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
});

// Quan hệ cho Store
export const storeRelations = relations(store, ({ many }) => ({
  inventories: many(inventory),
  purchaseOrders: many(purchaseOrder),
  sales: many(sale),
}));

// 2. Supplier (Nhà cung cấp)
export const supplier = pgTable('supplier', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
});

export const supplierRelations = relations(supplier, ({ many }) => ({
  products: many(product),
  purchaseOrders: many(purchaseOrder),
}));

// 3. Product (Sản phẩm)
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

// 4. Inventory (Tồn kho)
export const inventory = pgTable('inventory',
  {
    productId: integer('product_id').notNull(),
    storeId: integer('store_id').notNull(),
    quantity: integer('quantity').notNull().default(0),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.productId, table.storeId] }),
  })
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

// 5. Purchase Order (Đơn nhập hàng)
export const purchaseOrder = pgTable('purchase_order', {
  id: serial('id').primaryKey(),
  storeId: integer('store_id').notNull(),
  supplierId: integer('supplier_id').notNull(),
  orderDate: timestamp('order_date').notNull(),
  expectedDeliveryDate: timestamp('expected_delivery_date'),
  status: varchar('status', { length: 50 }).default('pending'),
});

export const purchaseOrderRelations = relations(purchaseOrder, ({ one, many }) => ({
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
}));

// 6. Purchase Order Details (Chi tiết đơn nhập)
export const purchaseOrderDetails = pgTable('purchase_order_details',
  {
    orderId: integer('order_id').notNull(),
    productId: integer('product_id').notNull(),
    quantityOrdered: integer('quantity_ordered').notNull(),
    unitCost: integer('unit_cost').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.orderId, table.productId] }),
  })
);

export const purchaseOrderDetailsRelations = relations(purchaseOrderDetails, ({ one }) => ({
  order: one(purchaseOrder, {
    fields: [purchaseOrderDetails.orderId],
    references: [purchaseOrder.id],
  }),
  product: one(product, {
    fields: [purchaseOrderDetails.productId],
    references: [product.id],
  }),
}));

// 7. Goods Receipt (Phiếu nhập kho)
export const goodsReceipt = pgTable('goods_receipt', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  receiptDate: timestamp('receipt_date').notNull(),
  notes: text('notes'),
});

export const goodsReceiptRelations = relations(goodsReceipt, ({ one, many }) => ({
  order: one(purchaseOrder, {
    fields: [goodsReceipt.orderId],
    references: [purchaseOrder.id],
  }),
  details: many(goodsReceiptDetails),
}));

// 8. Goods Receipt Details (Chi tiết nhập kho)
export const goodsReceiptDetails = pgTable('goods_receipt_details',
  {
    receiptId: integer('receipt_id').notNull(),
    productId: integer('product_id').notNull(),
    quantityReceived: integer('quantity_received').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.receiptId, table.productId] }),
  })
);

export const goodsReceiptDetailsRelations = relations(goodsReceiptDetails, ({ one }) => ({
  receipt: one(goodsReceipt, {
    fields: [goodsReceiptDetails.receiptId],
    references: [goodsReceipt.id],
  }),
  product: one(product, {
    fields: [goodsReceiptDetails.productId],
    references: [product.id],
  }),
}));

// 9. User (Người dùng/Khách hàng)
export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  address: text('address').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  isActivated: boolean('is_activated').notNull().default(false),
});

export const userRelations = relations(user, ({ many }) => ({
  sales: many(sale),
}));

// 10. Sale (Đơn bán hàng)
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

// 11. Sale Details (Chi tiết đơn bán)
export const saleDetails = pgTable('sale_details',
  {
    saleId: integer('sale_id').notNull(),
    productId: integer('product_id').notNull(),
    quantitySold: integer('quantity_sold').notNull(),
    unitPrice: integer('unit_price').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.saleId, table.productId] }),
  })
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

// 12. Warranty (Bảo hành)
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

// 13. Warranty Service (Dịch vụ bảo hành)
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

export const warrantyServiceRelations = relations(warrantyService, ({ one }) => ({
  warranty: one(warranty, {
    fields: [warrantyService.warrantyId],
    references: [warranty.id],
  }),
}));
```