import { Repository } from 'typeorm';
import { PeopleService } from './people.service';
import { Person } from './entities/person.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';
import { ConflictException, NotFoundException } from '@nestjs/common';

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
            findOneBy: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
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
      const createPersonDto: CreatePersonDto = {
        email: 'matheus@email.com',
        nome: 'Matheus',
        password: '123456',
        routePolicies: [RoutePolicies.createPessoa],
      };
      const passwordHash = 'HASHDESENHA';
      const newPerson = {
        id: 1,
        nome: createPersonDto.nome,
        email: createPersonDto.email,
        passwordHash,
      };

      // Como o valor retornado por hashingService.hash é necessário vamos simular este valor.
      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);

      // Como a pessoa retornada por personRepository.create é necessária em personRepository.save. Vamos simular este valor.
      jest.spyOn(personRepository, 'create').mockReturnValue(newPerson as any);

      // Act -> Ação (executar o método)
      const result = await peopleService.create(createPersonDto);

      // Assert
      // O método hashingService.hash foi chamado com createPessoaDto.password?
      expect(hashingService.hash).toHaveBeenCalledWith(
        createPersonDto.password,
      );

      // O método personRepository.create foi chamado com os dados da nova pessoa com o hash de senha gerado por hashingService.hash?
      expect(personRepository.create).toHaveBeenCalledWith({
        nome: createPersonDto.nome,
        passwordHash,
        email: createPersonDto.email,
        routePolicies: [RoutePolicies.createPessoa],
      });

      // O método personRepository.save foi chamado com os dados da nova
      // pessoa gerada por personRepository.create?
      expect(personRepository.save).toHaveBeenCalledWith(newPerson);

      // O resultado do método pessoaService.create retornou a nova
      // pessoa criada?
      expect(result).toEqual(newPerson);
    });

    it('should throw a ConflictException if e-mail already exists', async () => {
      jest.spyOn(personRepository, 'save').mockRejectedValue({
        code: '23505',
      });

      await expect(peopleService.create({} as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw an Error if something went wrong', async () => {
      jest
        .spyOn(personRepository, 'save')
        .mockRejectedValue(new Error('Erro genérico'));

      await expect(peopleService.create({} as any)).rejects.toThrow(
        new Error('Erro genérico'),
      );
    });
  });

  describe('findOne', () => {
    it('should return a person when find it', async () => {
      const personId = 1;
      const person = {
        id: personId,
        nome: 'Luiz',
        email: 'luiz@email.com',
        passwordHash: '123456',
      };

      jest
        .spyOn(personRepository, 'findOneBy')
        .mockResolvedValue(person as any);

      const result = await peopleService.findOne(personId);

      expect(result).toEqual(person);
    });

    it('should throw an error if person not found', async () => {
      await expect(peopleService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all people', async () => {
      const personMock: Person[] = [
        {
          id: 1,
          nome: 'Matheus',
          email: 'matheus@email.com',
          passwordHash: '123456',
        } as Person,
      ];

      jest.spyOn(personRepository, 'find').mockResolvedValue(personMock);

      const result = await peopleService.findAll();

      expect(result).toEqual(personMock);
      expect(personRepository.find).toHaveBeenCalledWith({
        // Isso é importante para manter a regra de negócio
        order: {
          id: 'desc',
        },
      });
    });
  });

  describe('update', () => {
    it('should update a person if user is authorized', async () => {
      // Arrange
      const personId = 1;
      const updatePersonDto = { nome: 'Joana', password: '654321' };
      const tokenPayload = { sub: personId } as any;
      const passwordHash = 'HASHDESENHA';
      const updatedPerson = { id: personId, nome: 'Joana', passwordHash };

      jest.spyOn(hashingService, 'hash').mockResolvedValueOnce(passwordHash);
      jest
        .spyOn(personRepository, 'preload')
        .mockResolvedValue(updatedPerson as any);
      jest
        .spyOn(personRepository, 'save')
        .mockResolvedValue(updatedPerson as any);

      // Act
      const result = await peopleService.update(
        personId,
        updatePersonDto,
        tokenPayload,
      );

      // Assert
      expect(hashingService.hash).toHaveBeenCalledWith(
        updatePersonDto.password,
      );
      expect(personRepository.preload).toHaveBeenCalledWith({
        id: personId,
        nome: updatePersonDto.nome,
        passwordHash,
      });
      expect(personRepository.save).toHaveBeenCalledWith(updatedPerson);
      expect(result).toEqual(updatedPerson);
    });
  });
});
