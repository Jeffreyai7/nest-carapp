import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST)', () => {

    const email = "yaam@gmail.com";
    const password = "passwordss";
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password })
      .expect(201)
      .then((res) => {
        expect(res.body.email).toEqual(email);
        expect(res.body.password).toBeUndefined();
      });
  });
});
