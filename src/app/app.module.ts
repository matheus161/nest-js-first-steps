import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from 'src/messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from 'src/people/people.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import appConfig from './app.config';

/* Organizar e encapsular o código */
@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: ['env/.env'], // multiple files
      // ignoreEnvFile: true, // ignore when necessary (Heroku)
      validationSchema: Joi.object({
        DATABASE_TYPE: Joi.required(),
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.required(),
        DATABASE_DATABASE: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_AUTOLOADENTITIES: Joi.number().min(0).max(1).default(0),
        DATABASE_SYNCHRONIZE: Joi.number().min(0).max(1).default(0),
      }),
    }),
    ConfigModule.forFeature(appConfig), // Inject inside this module
    // TypeOrmModule.forRoot({
    //   type: process.env.DATABASE_TYPE as 'postgres',
    //   host: process.env.DATABASE_HOST,
    //   port: +process.env.DATABASE_PORT,
    //   username: process.env.DATABASE_USERNAME,
    //   database: process.env.DATABASE_DATABASE,
    //   password: process.env.DATABASE_PASSWORD,
    //   autoLoadEntities: Boolean(process.env.DATABASE_AUTOLOADENTITIES), // Loads entities without needing to specify them
    //   synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), // Synchronizes with the database. Should not be used in production
    // }),

    // This function is used to inject inside a Module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: async (appConfigurations: ConfigType<typeof appConfig>) => {
        return {
          type: appConfigurations.database.type,
          host: appConfigurations.database.host,
          port: appConfigurations.database.port,
          username: appConfigurations.database.username,
          database: appConfigurations.database.database,
          password: appConfigurations.database.password,
          autoLoadEntities: appConfigurations.database.autoLoadEntities,
          synchronize: appConfigurations.database.synchronize,
        };
      },
    }),
    MessagesModule,
    PeopleModule,
  ],
  controllers: [AppController],
  providers: [AppService] /* Injetar dependencias */,
})
export class AppModule {}
