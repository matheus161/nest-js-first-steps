import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { Person } from 'src/people/entities/person.entity';
import { HashingService } from './hashing/hashing.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly hashingService: HashingService,
  ) {}

  async login(loginDto: LoginDto) {
    const person = await this.personRepository.findOneBy({
      email: loginDto.email,
    });

    if (!person) {
      throw new UnauthorizedException('Usuário ou senha inválidos.');
    }

    const passwordIsValid = await this.hashingService.compare(
      loginDto.password,
      person.passwordHash,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Usuário ou senha inválidos.');
    }

    return { message: 'Usuário logado!' };
  }
}
