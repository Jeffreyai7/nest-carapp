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

  it("signup as a new user then get the currently logged in user", async () => {
    
    const email = "jirukeh@gmail.com";
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: "passwordss" })
      .expect(201);

    const cookie = res.get("Set-Cookie");

    if (!cookie) {
      throw new Error("Cookie is undefined");
    }

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set("Cookie", cookie)
      .expect(200);


    expect(body.email).toEqual(email);

  })
});
