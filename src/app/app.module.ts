import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from 'src/messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from 'src/people/people.module';
import { SimpleMiddleware } from 'src/common/middlewares/simple.middleware';
import { OutroMiddleware } from 'src/common/middlewares/outros.middleware';
import { APP_FILTER } from '@nestjs/core';
import { ErrorExceptionFilter } from 'src/common/filters/error-exception.filter';

/* Organizar e encapsular o código */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'postgres',
      password: '123456',
      autoLoadEntities: true, // Loads entities without needing to specify them
      synchronize: true, // Synchronizes with the database. Should not be used in production
    }),
    MessagesModule,
    PeopleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: ErrorExceptionFilter },
  ] /* Injetar dependencias */,
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
    consumer.apply(OutroMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
