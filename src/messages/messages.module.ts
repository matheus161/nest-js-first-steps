import { forwardRef, Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { PeopleModule } from 'src/people/people.module';
import { MessageUtils, MessageUtilsMock } from './message.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    forwardRef(() => PeopleModule),
  ], // Import entities for this module
  controllers: [MessagesController],
  providers: [
    MessagesService,
    {
      provide: MessageUtils,
      useValue: new MessageUtilsMock(), // value to be used
      // useClass: MessageUtils,
    },
  ],
  exports: [MessageUtils],
})
export class MessagesModule {}
