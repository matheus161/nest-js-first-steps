import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from 'src/messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from 'src/people/people.module';
import { ConfigModule } from '@nestjs/config';

/* Organizar e encapsular o código */
@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: ['env/.env'], // multiple files
      // ignoreEnvFile: true, // ignore when necessary (Heroku)
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      database: process.env.DATABASE_DATABASE,
      password: process.env.DATABASE_PASSWORD,
      autoLoadEntities: Boolean(process.env.DATABASE_AUTOLOADENTITIES), // Loads entities without needing to specify them
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), // Synchronizes with the database. Should not be used in production
    }),
    MessagesModule,
    PeopleModule,
  ],
  controllers: [AppController],
  providers: [AppService] /* Injetar dependencias */,
})
export class AppModule {}
