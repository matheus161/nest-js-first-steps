import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from 'src/messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
  controllers: [AppController],
  providers: [AppService] /* Injetar dependencias */,
})
export class AppModule {}
