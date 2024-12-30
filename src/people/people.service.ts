import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createPersonDto.password,
      );

      const peopleData = {
        nome: createPersonDto.nome,
        passwordHash,
        email: createPersonDto.email,
      };

      const newPerson = this.personRepository.create(peopleData);
      await this.personRepository.save(newPerson);
      return newPerson;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('E-mail já está cadastrado.');
      }

      throw error;
    }
  }

  async findAll() {
    const people = await this.personRepository.find({
      order: {
        id: 'desc',
      },
    });

    return people;
  }

  async findOne(id: number) {
    const person = await this.personRepository.findOneBy({
      id,
    });

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    return person;
  }

  async update(
    id: number,
    updatePersonDto: UpdatePersonDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const peopleData = {
      nome: updatePersonDto?.nome,
    };

    if (updatePersonDto?.password) {
      const passwordHash = await this.hashingService.hash(
        updatePersonDto.password,
      );

      peopleData['passwordHash'] = passwordHash;
    }

    const person = await this.personRepository.preload({
      id,
      ...peopleData,
    });

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    return this.personRepository.save(person);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const person = await this.personRepository.findOneBy({ id });

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    return this.personRepository.remove(person);
  }
}
