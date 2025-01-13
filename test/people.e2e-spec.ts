import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import globalConfig from 'src/global-config/global.config';
import * as path from 'path';
import { MessagesModule } from 'src/messages/messages.module';
import { PeopleModule } from 'src/people/people.module';
import { GlobalConfigModule } from 'src/global-config/global-config.module';
import { AuthModule } from 'src/auth/auth.module';
import appConfig from 'src/app/config/app.config';
import * as request from 'supertest';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(globalConfig),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          database: 'testing', // ATTENTION
          password: '123456',
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
        ServeStaticModule.forRoot({
          rootPath: path.resolve(__dirname, '..', '..', 'pictures'),
          serveRoot: '/pictures',
        }),
        MessagesModule,
        PeopleModule,
        GlobalConfigModule,
        AuthModule,
      ],
    }).compile();

    app = module.createNestApplication();

    appConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/people (POST)', () => {
    it('should create a person with success', async () => {
      const createPersonDto = {
        email: 'matheus@email.com',
        password: '123456',
        nome: 'Matheus',
        routePolicies: [RoutePolicies.createPessoa],
      };
      const response = await request(app.getHttpServer())
        .post('/people')
        .send(createPersonDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        email: createPersonDto.email,
        passwordHash: expect.any(String),
        nome: createPersonDto.nome,
        active: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        picture: '',
        id: expect.any(Number),
        routePolicies: createPersonDto.routePolicies,
      });
    });
  });
});
