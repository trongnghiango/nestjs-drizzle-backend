import { HttpException, Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { posts } from '../schemas/posts.schema';
import { DrizzleDB } from '../schemas/types/drizzle';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { product } from '../schemas/core/product.schema';
import { store } from '../schemas/core/store.schema';
import { inventory } from '../schemas/inventory/inventory';
import { warranty, warrantyService } from '../schemas/warranty';
import { saleDetails } from '../schemas/sales/sale/saleDetails.schema';
import { and } from 'drizzle-orm/sql/expressions/conditions';

@Injectable()
export class PostService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}
  async create(createPostDto: CreatePostDto) {
    return await this.db.insert(posts).values(createPostDto);
    // return 'This action adds a new post';
  }

  async findAll() {
    // throw new HttpException('Ciquan', 400);
    // const list = await this.db.query.posts.findMany();
    // if (!list) {
    //   throw new HttpException('Post not found', 404);
    // }
    // return list;
    const result = await this.db.select().from(posts).execute();
    if (!result) {
      throw new HttpException('ERROR', 400);
    }
    return result;
  }

  // Lay lich su bao hanh
  async getWarrantyHistory() {
    return await this.db
      .select({
        warranty: warranty,
        saleDetail: saleDetails,
        product: product,
        service: warrantyService,
      })
      .from(warranty)
      .innerJoin(
        saleDetails,
        and(
          eq(warranty.saleId, saleDetails.saleId),
          eq(warranty.productId, saleDetails.productId),
        ),
      )
      .leftJoin(product, eq(saleDetails.productId, product.id))
      .leftJoin(warrantyService, eq(warranty.id, warrantyService.warrantyId));
  }

  //
  async getInventory() {
    // Lấy thông tin tồn kho
    const result = await this.db
      .select({
        inventory: inventory,
        product: product,
        store: store,
      })
      .from(inventory)
      .leftJoin(product, eq(inventory.productId, product.id))
      .leftJoin(store, eq(inventory.storeId, store.id));
    // const inventory = await this.db.query.inventory.findMany({
    //   with: {
    //     product: true,
    //     store: true,
    //   },
    // });
    return result;
  }

  // Hàm lấy dữ liệu phân trang
  async find(query: QueryPostDto) {
    const { page = 1, pageSize = 10 } = query;
    const offset = (page - 1) * pageSize; // Tính toán offset

    console.info(pageSize, page, offset);
    // Lấy dữ liệu trang hiện tại
    const data = await this.db
      .select()
      .from(posts)
      .limit(pageSize)
      .offset(offset);

    // Lấy tổng số bản ghi để tính toán tổng số trang
    const totalResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(posts);

    const total = totalResult[0].count;
    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      pagination: {
        currentPage: page,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  async findOne(id: number) {
    const post = await this.db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .execute();

    if (!post[0]) {
      throw new HttpException('Post not found', 404);
    }

    return post[0];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
