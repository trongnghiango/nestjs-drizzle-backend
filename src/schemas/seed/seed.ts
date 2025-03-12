import { faker } from '@faker-js/faker';
import 'dotenv/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';

const databaseUrl = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: true,
});

const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

async function runSeed() {
  const userIds = await Promise.all(
    Array(10)
      .fill('')
      .map(async () => {
        const user = await db
          .insert(schema.users)
          .values({
            email: faker.internet.email(),
            name: faker.person.firstName() + ' ' + faker.person.lastName(),
            password: '',
          })
          .returning();
        return user[0].id;
      }),
  );

  const postIds = await Promise.all(
    Array(50)
      .fill('')
      .map(async () => {
        const post = await db
          .insert(schema.posts)
          .values({
            content: faker.lorem.paragraph(),
            title: faker.lorem.sentence(),
            authorId: faker.helpers.arrayElement(userIds),
          })
          .returning();
        return post[0].id;
      }),
  );

  //

  await Promise.all(
    Array(50)
      .fill('')
      .map(async () => {
        const comment = await db
          .insert(schema.comments)
          .values({
            text: faker.lorem.sentence(),
            authorId: faker.helpers.arrayElement(userIds),
            postId: faker.helpers.arrayElement(postIds),
          })
          .returning();
        return comment[0].id;
      }),
  );

  //
  const insertedGroups = await db
    .insert(schema.groups)
    .values([
      {
        name: 'TS',
      },
      {
        name: 'JS',
      },
    ])
    .returning();

  const groupIds = insertedGroups.map((group) => group.id);
  //

  //
  await Promise.all(
    userIds.map(async (userId) => {
      return db.insert(schema.usersToGroups).values({
        userId: userId,
        groupId: faker.helpers.arrayElement(groupIds),
      });
    }),
  );
}

runSeed()
  .then()
  .catch((err) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.error(err.message ?? err);
    process.exit(0);
  });
