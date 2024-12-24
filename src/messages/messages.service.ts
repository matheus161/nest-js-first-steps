import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto.decorator';
import { UpdateMessageDto } from './dto/update-message.dto.decorator';

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

  findOne(id: number) {
    const message = this.messages.find(item => item.id === id);

    if (!message) this.throwNotFoundError();

    return message;
  }

  create(createMessageDto: CreateMessageDto) {
    this.lastId++;

    const id = this.lastId;
    const newMessage = {
      id,
      ...createMessageDto,
      lido: false,
      data: new Date(),
    };

    this.messages.push(newMessage);

    return newMessage;
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    const isMessageExistsIndex = this.messages.findIndex(
      item => item.id === +id,
    );

    if (isMessageExistsIndex < 0) {
      this.throwNotFoundError();
    }

    const findMessage = this.messages[isMessageExistsIndex];

    this.messages[isMessageExistsIndex] = {
      ...findMessage,
      ...updateMessageDto,
    };

    return this.messages[isMessageExistsIndex];
  }

  remove(id: number) {
    const isMessageExistsIndex = this.messages.findIndex(
      item => item.id === id,
    );

    if (isMessageExistsIndex < 0) {
      this.throwNotFoundError();
    }

    const message = this.messages[isMessageExistsIndex];

    this.messages.splice(isMessageExistsIndex, 1);

    return message;
  }
}
