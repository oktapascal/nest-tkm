import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { cleanDatabase } from './test-utils';
import * as request from 'supertest';

describe('Application e2e Testing', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let access_token: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let refresh_token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
    await app.listen(3000);
  });

  afterAll(async () => {
    await cleanDatabase(app);
    await app.close();
  }, 0);

  describe('/auth/register', () => {
    it('user success registered', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'foo',
          password: 'bar',
          role: 'SUPERADMIN',
          name: 'Foo Bar',
        })
        .expect(201);
    });

    it('user cannot registered because duplicate credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'foo',
          password: 'bar',
          role: 'SUPERADMIN',
          name: 'Foo Bar',
        })
        .expect(400);
    });
  });

  describe('/auth/login', () => {
    it('user success logged in', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'foo',
          password: 'bar',
        })
        .expect(200);

      access_token = response.body.access_token;
      refresh_token = response.body.refresh_token;
    });

    it('user cannot logged in because username is wrong', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'foo1',
          password: 'bar',
        })
        .expect(404);
    });

    it('user cannot logged in because password is wrong', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'foo',
          password: 'ba',
        })
        .expect(401);
    });
  });
});
