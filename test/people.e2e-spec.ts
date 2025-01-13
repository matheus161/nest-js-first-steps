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
import { CreatePersonDto } from 'src/people/dto/create-person.dto';

const login = async (
  app: INestApplication,
  email: string,
  password: string,
) => {
  const response = await request(app.getHttpServer())
    .post('/auth')
    .send({ email, password });

  return response.body.accessToken;
};

const createUserAndLogin = async (app: INestApplication) => {
  const nome = 'Any User';
  const email = 'anyuser@email.com';
  const password = '123456';
  const routePolicies = [RoutePolicies.createPessoa];

  await request(app.getHttpServer()).post('/people').send({
    nome,
    email,
    password,
    routePolicies,
  });

  return login(app, email, password);
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

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

    accessToken = await createUserAndLogin(app);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/people (POST)', () => {
    it('should create a person with success', async () => {
      const createPersonDto: CreatePersonDto = {
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

    it('should throw an error if user with email already exists', async () => {
      const createPersonDto: CreatePersonDto = {
        email: 'matheus@email.com',
        password: '123456',
        nome: 'Matheus',
        routePolicies: [RoutePolicies.createPessoa],
      };

      await request(app.getHttpServer())
        .post('/people')
        .send(createPersonDto)
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post('/people')
        .send(createPersonDto)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toBe('E-mail já está cadastrado.');
    });

    it('should throw an error when password is too short', async () => {
      const createPersonDto: CreatePersonDto = {
        email: 'matheus@email.com',
        password: '123',
        nome: 'Matheus',
        routePolicies: [RoutePolicies.createPessoa],
      };

      const response = await request(app.getHttpServer())
        .post('/people')
        .send(createPersonDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toEqual([
        'password must be longer than or equal to 5 characters',
      ]);
      expect(response.body.message).toContain(
        'password must be longer than or equal to 5 characters',
      );
    });
  });

  describe('GET /people', () => {
    it('should return all people from database', async () => {
      const createPersonDto: CreatePersonDto = {
        email: 'matheus@email.com',
        password: '123456',
        nome: 'Matheus',
        routePolicies: [RoutePolicies.createPessoa],
      };

      // First create ir
      await request(app.getHttpServer())
        .post('/people')
        .send(createPersonDto)
        .expect(HttpStatus.CREATED);

      // Set Token and findAll
      const response = await request(app.getHttpServer())
        .get('/people')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            email: createPersonDto.email,
            nome: createPersonDto.nome,
          }),
        ]),
      );
    });
  });

  describe('GET /people/:id', () => {
    it('should return people by ID', async () => {
      const createPersonDto: CreatePersonDto = {
        email: 'matheus@email.com',
        password: '123456',
        nome: 'Matheus',
        routePolicies: [RoutePolicies.createPessoa],
      };

      const createResponse = await request(app.getHttpServer())
        .post('/people')
        .send(createPersonDto)
        .expect(HttpStatus.CREATED);

      const personId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .get(`/people/${personId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: personId,
          email: createPersonDto.email,
          nome: createPersonDto.nome,
        }),
      );
    });

    it('should throw an error when a person is not found', async () => {
      await request(app.getHttpServer())
        .get('/people/9999') // ID fictício
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /people/:id', () => {
    it('should update a person', async () => {
      const createPersonDto: CreatePersonDto = {
        email: 'matheus@email.com',
        password: '123456',
        nome: 'Matheus',
        routePolicies: [RoutePolicies.createPessoa],
      };

      const createResponse = await request(app.getHttpServer())
        .post('/people')
        .send(createPersonDto)
        .expect(HttpStatus.CREATED);

      const personId = createResponse.body.id;

      const authToken = await login(
        app,
        createPersonDto.email,
        createPersonDto.password,
      );

      const updatedBody = { nome: 'Matheus L.' };
      const updateResponse = await request(app.getHttpServer())
        .patch(`/people/${personId}`)
        .send(updatedBody)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(updateResponse.body).toEqual(
        expect.objectContaining({
          id: personId,
          nome: updatedBody.nome,
        }),
      );
    });

    it('should throw an error when a person is not found', async () => {
      await request(app.getHttpServer())
        .patch('/people/9999') // ID fictício
        .send({
          nome: 'Nome Atualizado',
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /people/:id', () => {
    it('should return a person', async () => {
      const createPersonDto: CreatePersonDto = {
        email: 'matheus@email.com',
        password: '123456',
        nome: 'Matheus',
        routePolicies: [RoutePolicies.createPessoa],
      };

      const createResponse = await request(app.getHttpServer())
        .post('/people')
        .send(createPersonDto)
        .expect(HttpStatus.CREATED);

      const authToken = await login(
        app,
        createPersonDto.email,
        createPersonDto.password,
      );

      const personId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .delete(`/people/${personId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.email).toBe(createPersonDto.email);
    });

    it('should throw an error if person not exists', async () => {
      await request(app.getHttpServer())
        .delete('/people/9999') // ID fictício
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
