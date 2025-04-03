import 'dotenv/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';
import { store } from '../core/store.schema';
import { supplier } from '../core/supplier.schema';
import { product } from '../core/product.schema';
import { user } from '../sales/customer.schema';
import { purchaseOrder } from '../inventory/purchase/order';
import { purchaseOrderDetails } from '../inventory/purchase/orderDetails';
import { goodsReceipt } from '../inventory/receipt/goodsReceipt';
import { goodsReceiptDetails } from '../inventory/receipt/goodsReceiptDetails';
import { inventory } from '../inventory/inventory';
import { sale } from '../sales/sale/sale.schema';
import { saleDetails } from '../sales/sale/saleDetails.schema';
import { warranty, warrantyService } from '../schema';

const databaseUrl = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: true,
});

const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

async function seed() {
  // 1. Tạo Store đầu tiên (không phụ thuộc vào bảng nào)
  const [store1] = await db
    .insert(store)
    .values({
      name: 'Cửa hàng chính',
      address: '123 Đường Lê Lợi, Q1, TP.HCM',
      phone: '02838223344',
      email: 'cuahangchinh@example.com',
    })
    .returning();

  // 2. Tạo Supplier (nhà cung cấp)
  const [supplier1] = await db
    .insert(supplier)
    .values({
      name: 'Công ty Điện tử ABC',
      address: 'Khu công nghệ cao, Q9, TP.HCM',
      phone: '02839998877',
      email: 'info@abc-electronics.com',
    })
    .returning();

  // 3. Tạo Products (phụ thuộc Supplier)
  const [product1] = await db
    .insert(product)
    .values({
      name: 'Laptop XYZ Model 2023',
      description: 'Laptop cao cấp 15 inch',
      sku: 'LT-XYZ-2023',
      price: 25000000,
      supplierId: supplier1.id,
    })
    .returning();

  const [product2] = await db
    .insert(product)
    .values({
      name: 'Màn hình 24 inch 4K',
      description: 'Màn hình công nghệ IPS',
      sku: 'MN-24-4K',
      price: 5000000,
      supplierId: supplier1.id,
    })
    .returning();

  // 4. Tạo User (khách hàng)
  const [user1] = await db
    .insert(user)
    .values({
      name: 'Nguyễn Văn A',
      phone: '0912345678',
      address: '456 Nguyễn Huệ, Q1, TP.HCM',
      email: 'nguyenvana@example.com',
      isActivated: true,
    })
    .returning();

  // 5. Tạo Purchase Order (đơn nhập hàng)
  const [purchaseOrder1] = await db
    .insert(purchaseOrder)
    .values({
      storeId: store1.id,
      supplierId: supplier1.id,
      orderDate: new Date('2023-10-01'),
      expectedDeliveryDate: new Date('2023-10-05'),
      status: 'completed',
    })
    .returning();

  // 6. Thêm chi tiết đơn nhập
  await db.insert(purchaseOrderDetails).values([
    {
      orderId: purchaseOrder1.id,
      productId: product1.id,
      quantityOrdered: 10,
      unitCost: 22000000,
    },
    {
      orderId: purchaseOrder1.id,
      productId: product2.id,
      quantityOrdered: 20,
      unitCost: 4500000,
    },
  ]);

  // 7. Tạo Goods Receipt (phiếu nhập kho)
  const [goodsReceipt1] = await db
    .insert(goodsReceipt)
    .values({
      orderId: purchaseOrder1.id,
      receiptDate: new Date('2023-10-04'),
      notes: 'Nhập hàng đầy đủ',
    })
    .returning();

  // 8. Thêm chi tiết nhập kho
  await db.insert(goodsReceiptDetails).values([
    {
      receiptId: goodsReceipt1.id,
      productId: product1.id,
      quantityReceived: 10,
    },
    {
      receiptId: goodsReceipt1.id,
      productId: product2.id,
      quantityReceived: 20,
    },
  ]);

  // 9. Cập nhật tồn kho (inventory)
  await db.insert(inventory).values([
    {
      productId: product1.id,
      storeId: store1.id,
      quantity: 10,
    },
    {
      productId: product2.id,
      storeId: store1.id,
      quantity: 20,
    },
  ]);

  // 10. Tạo Sale (đơn bán hàng)
  const [sale1] = await db
    .insert(sale)
    .values({
      storeId: store1.id,
      userId: user1.id,
      saleDate: new Date('2023-10-10'),
      totalAmount: 30000000,
    })
    .returning();

  // 11. Thêm chi tiết đơn hàng
  await db.insert(saleDetails).values([
    {
      saleId: sale1.id,
      productId: product1.id,
      quantitySold: 1,
      unitPrice: 25000000,
    },
    {
      saleId: sale1.id,
      productId: product2.id,
      quantitySold: 2,
      unitPrice: 5000000,
    },
  ]);

  // 12. Tạo Warranty (bảo hành)
  const [warranty1] = await db
    .insert(warranty)
    .values({
      saleId: sale1.id,
      productId: product1.id,
      startDate: new Date('2023-10-10'),
      endDate: new Date('2024-10-10'),
      warrantyCode: 'WB-20231010-001',
      status: 'active',
    })
    .returning();

  // 13. Thêm dịch vụ bảo hành
  await db.insert(warrantyService).values({
    warrantyId: warranty1.id,
    serviceType: 'initial_activation',
    serviceDate: new Date('2023-10-10'),
    status: 'completed',
    description: 'Kích hoạt bảo hành ban đầu',
  });

  console.log('Seed dữ liệu thành công!');
}

seed().catch((e) => {
  console.error('Lỗi trong quá trình seed:', e);
  process.exit(1);
});
