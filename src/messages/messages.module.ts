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
import { OnlyLowercaseLettersRegex } from 'src/common/regex/only-lowercase-letters.regex';
import { RegexFactory } from 'src/common/regex/regex.factory';

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
    RegexFactory,
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
      useFactory: (regexFactory: RegexFactory) => {
        // My code/logic
        return regexFactory.create('RemoveSpacesRegex');
      },
      inject: [RegexFactory],
    },
  ],
  exports: [MessageUtils, SERVER_NAME],
})
export class MessagesModule {}
