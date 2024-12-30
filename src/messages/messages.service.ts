import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeopleService } from 'src/people/people.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import messagesConfig from './messages.config';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

/**
 * This serves as a repository, handling all CRUD operations related to the database.
 */
@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly peopleService: PeopleService,
    private readonly configService: ConfigService,
    @Inject(messagesConfig.KEY)
    private readonly messagesConfiguration: ConfigType<typeof messagesConfig>,
  ) {
    const databaseUsername =
      this.configService.get<string>('DATABASE_USERNAME');
    console.log({ databaseUsername });
    console.log('proccess.env', process.env.DATABASE_USERNAME);
    console.log({ messagesConfiguration });
  }

  throwNotFoundError() {
    // throw new HttpException('Recado não encontrado', HttpStatus;NOT_FOUND)
    throw new NotFoundException('Recado não encontrado');
  }

  async findAll(paginationDto?: PaginationDto) {
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

  async create(
    createMessageDto: CreateMessageDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const { paraId } = createMessageDto;

    // Find the person to whom the message is being sent
    const para = await this.peopleService.findOne(paraId);

    // Find the person who is creating the message
    const de = await this.peopleService.findOne(tokenPayload.sub);

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
        nome: message.de.nome,
      },
      para: {
        id: message.para.id,
        nome: message.para.nome,
      },
    };
  }

  async update(
    id: number,
    updateMessageDto: UpdateMessageDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const message = await this.findOne(id);

    if (message.de.id !== tokenPayload.sub) {
      throw new ForbiddenException(
        'Você não pode alterar um recado que não seja seu.',
      );
    }

    message.texto = updateMessageDto?.texto ?? message.texto;
    message.lido = updateMessageDto?.lido ?? message.lido;

    return await this.messageRepository.save(message);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const message = await this.findOne(id);

    if (message.de.id !== tokenPayload.sub) {
      throw new ForbiddenException(
        'Você não pode alterar um recado que não seja seu.',
      );
    }

    return this.messageRepository.remove(message);
  }
}
