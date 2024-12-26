import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeopleService } from 'src/people/people.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

/**
 * This serves as a repository, handling all CRUD operations related to the database.
 */
@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly peopleService: PeopleService,
  ) {}

  throwNotFoundError() {
    // throw new HttpException('Recado não encontrado', HttpStatus;NOT_FOUND)
    throw new NotFoundException('Recado não encontrado');
  }

  async findAll(paginationDto?: PaginationDto) {
    console.log('MessagesService findAll executado');

    const { limit = 10, offset = 0 } = paginationDto;

    return await this.messageRepository.find({
      relations: ['de', 'para'],
      take: limit,
      skip: offset,
      order: {
        id: 'desc',
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
  }

  async findOne(id: number) {
    // const message = this.messages.find(item => item.id === id);
    const message = await this.messageRepository.findOne({
      where: {
        id,
      },
      relations: ['de', 'para'],
      order: {
        id: 'desc',
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });

    if (!message) this.throwNotFoundError();

    return message;
  }

  async create(createMessageDto: CreateMessageDto) {
    const { deId, paraId } = createMessageDto;

    // Find the person who is creating the message
    const de = await this.peopleService.findOne(deId);

    // Find the person to whom the message is being sent
    const para = await this.peopleService.findOne(paraId);

    const newMessage = {
      texto: createMessageDto.texto,
      de,
      para,
      lido: false,
      data: new Date(),
    };

    const message = await this.messageRepository.create(newMessage);
    await this.messageRepository.save(message);

    return {
      ...message,
      de: {
        id: message.de.id,
      },
      para: {
        id: message.para.id,
      },
    };
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.findOne(id);

    message.texto = updateMessageDto?.texto ?? message.texto;
    message.lido = updateMessageDto?.lido ?? message.lido;

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
