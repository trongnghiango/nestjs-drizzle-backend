import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schemas/schema';

export const DRIZZLE = Symbol('drizzle-connection');
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        //lay Database_url -> create pool -> return {...}
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const pool = new Pool({
          connectionString: databaseUrl,
          ssl: true,
        });

        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
