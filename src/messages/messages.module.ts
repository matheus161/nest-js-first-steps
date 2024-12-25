import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { PeopleModule } from 'src/people/people.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), PeopleModule], // Import entities for this module
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
