import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * This serves as a repository, handling all CRUD operations related to the database.
 */
@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  throwNotFoundError() {
    // throw new HttpException('Recado não encontrado', HttpStatus;NOT_FOUND)
    throw new NotFoundException('Recado não encontrado');
  }

  async findAll() {
    return await this.messageRepository.find();
  }

  async findOne(id: number) {
    // const message = this.messages.find(item => item.id === id);
    const message = await this.messageRepository.findOne({
      where: { id },
    });

    if (!message) this.throwNotFoundError();

    return message;
  }

  async create(createMessageDto: CreateMessageDto) {
    const newMessage = {
      ...createMessageDto,
      lido: false,
      data: new Date(),
    };

    const message = await this.messageRepository.create(newMessage);
    return this.messageRepository.save(message);
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const partialUpdateMessageDto = {
      lido: updateMessageDto?.lido,
      texto: updateMessageDto?.texto,
    };

    // Find and upload
    const message = await this.messageRepository.preload({
      id,
      ...partialUpdateMessageDto,
    });

    if (!message) return this.throwNotFoundError();

    return await this.messageRepository.save(message);
  }

  async remove(id: number) {
    const message = await this.messageRepository.findOneBy({
      id,
    });

    if (!message) return this.throwNotFoundError();

    return this.messageRepository.remove(message);
  }
}
