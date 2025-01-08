import { Repository } from 'typeorm';
import { PeopleService } from './people.service';
import { Person } from './entities/person.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';

describe('PessoasService', () => {
  let peopleService: PeopleService;
  let personRepository: Repository<Person>;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: getRepositoryToken(Person),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    peopleService = module.get(PeopleService);
    personRepository = module.get<Repository<Person>>(
      getRepositoryToken(Person),
    );
    hashingService = module.get<HashingService>(HashingService);
  });

  it('pessoaService deve estar definido', () => {
    expect(peopleService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new person', async () => {
      // Arange
      // CreatePessoaDto
      const createPersonDto: CreatePersonDto = {
        email: 'matheus@email.com',
        nome: 'Matheus',
        password: '123456',
        routePolicies: [RoutePolicies.createPessoa],
      };
      const passwordHash = 'HASHDESENHA';

      // Que o hashing service tenha o método hash
      // Saber se o hashing service foi chamado com CreatePessoaDto
      // Saber se o pessoaRepository.create foi chamado com dados pessoa
      // Saber se pessoaRepository.save foi chamado com a pessoa criada
      // O retorno final deve ser a nova pessoa criada -> expect

      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);

      // Act
      await peopleService.create(createPersonDto);

      // Assert
      expect(hashingService.hash).toHaveBeenCalledWith(
        createPersonDto.password,
      );
      expect(personRepository.create).toHaveBeenCalledWith({
        nome: createPersonDto.nome,
        passwordHash,
        email: createPersonDto.email,
        routePolicies: [RoutePolicies.createPessoa],
      });
    });
  });
});
