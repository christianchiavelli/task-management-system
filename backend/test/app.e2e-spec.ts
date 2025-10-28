import { Test, TestingModule } from '@nestjs/testing';

import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'Task Management API');
        expect(res.body).toHaveProperty('version', '1.0.0');
        expect(res.body).toHaveProperty('status', 'running');
      });
  });
});
