import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from 'src/messages/messages.module';

/* Organizar e encapsular o código */
@Module({
  imports: [MessagesModule],
  controllers: [AppController],
  providers: [AppService] /* Injetar dependencias */,
})
export class AppModule {}
