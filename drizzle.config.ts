import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: [
    './src/schemas/**/*.schema.ts',
    './src/schemas/{core,inventory,sales,warranty}/**/*.ts',
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
});
