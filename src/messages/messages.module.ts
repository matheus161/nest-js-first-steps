import { forwardRef, Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { PeopleModule } from 'src/people/people.module';
import { MessageUtils } from './message.utils';
import { ConfigModule } from '@nestjs/config';
import messagesConfig from './messages.config';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    ConfigModule.forFeature(messagesConfig),
    TypeOrmModule.forFeature([Message]),
    forwardRef(() => PeopleModule),
    EmailModule,
  ], // Import entities for this module
  controllers: [MessagesController],
  providers: [MessagesService, MessageUtils],
  exports: [MessageUtils],
})
export class MessagesModule {}
