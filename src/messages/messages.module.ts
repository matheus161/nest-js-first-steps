import { forwardRef, Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { PeopleModule } from 'src/people/people.module';
import { MessageUtils, MessageUtilsMock } from './message.utils';
import { SERVER_NAME } from 'src/common/constants/server-name.constant';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
} from './messages.constant';
import { OnlyLowercaseLettersRegex } from 'src/common/regex/only-lowercase-letterts.regex';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';

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
    {
      provide: SERVER_NAME,
      useValue: 'My Name Is NestJS',
    },
    {
      provide: ONLY_LOWERCASE_LETTERS_REGEX,
      useClass: OnlyLowercaseLettersRegex,
    },
    {
      provide: REMOVE_SPACES_REGEX,
      useClass: RemoveSpacesRegex,
    },
  ],
  exports: [MessageUtils, SERVER_NAME],
})
export class MessagesModule {}
