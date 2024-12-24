import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';

/**
 * This serves as a repository, handling all CRUD operations related to the database.
 */
@Injectable()
export class MessagesService {
  private lastId = 1;
  private messages: Message[] = [
    {
      id: 1,
      texto: 'Este é um recado de teste',
      de: 'Joana',
      para: 'João',
      lido: false,
      data: new Date(),
    },
  ];

  findAll() {
    return this.messages;
  }

  findOne(id: string) {
    return this.messages.find(item => item.id === +id);
  }

  create(body: any) {
    this.lastId++;
    const id = this.lastId;
    const newMessage = {
      id,
      ...body,
    };
    this.messages.push(newMessage);
  }

  update(id: string, body: any) {
    const isMessageExistsIndex = this.messages.findIndex(
      item => item.id === +id,
    );

    if (isMessageExistsIndex >= 0) {
      const findMessage = this.messages[isMessageExistsIndex];

      this.messages[isMessageExistsIndex] = {
        ...findMessage,
        ...body,
      };
    }
  }

  remove(id: string) {
    const isMessageExistsIndex = this.messages.findIndex(
      item => item.id === +id,
    );

    if (isMessageExistsIndex >= 0) {
      this.messages.splice(isMessageExistsIndex, 1);
    }
  }
}
