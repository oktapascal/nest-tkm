import { INestApplication } from '@nestjs/common';
import { EntityManager } from 'typeorm';

export async function cleanDatabase(app: INestApplication) {
  const entityManager = app.get<EntityManager>(EntityManager);
  const tableNames = entityManager.connection.entityMetadatas
    .map((entity) => entity.tableName)
    .join(', ');

  await entityManager.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
}
