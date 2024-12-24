import { Injectable, NotFoundException } from '@nestjs/common';
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

  throwNotFoundError() {
    // throw new HttpException('Recado não encontrado', HttpStatus;NOT_FOUND)
    throw new NotFoundException('Recado não encontrado');
  }

  findAll() {
    return this.messages;
  }

  findOne(id: string) {
    const message = this.messages.find(item => item.id === +id);

    if (!message) this.throwNotFoundError();

    return message;
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

    if (isMessageExistsIndex < 0) {
      this.throwNotFoundError();
    }

    const findMessage = this.messages[isMessageExistsIndex];

    this.messages[isMessageExistsIndex] = {
      ...findMessage,
      ...body,
    };

    return this.messages[isMessageExistsIndex];
  }

  remove(id: string) {
    const isMessageExistsIndex = this.messages.findIndex(
      item => item.id === +id,
    );

    if (isMessageExistsIndex < 0) {
      this.throwNotFoundError();
    }

    const message = this.messages[isMessageExistsIndex];

    this.messages.splice(isMessageExistsIndex, 1);

    return message;
  }
}
