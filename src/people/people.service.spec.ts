import { Repository } from 'typeorm';
import { PeopleService } from './people.service';
import { Person } from './entities/person.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';

jest.mock('fs/promises'); // Mocka module import

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
            remove: jest.fn(),
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

    it('should throw a ForbiddenException if user is not authorized', async () => {
      // Arrange
      const personId = 1;
      const tokenPayload = { sub: 2 } as any;
      const updatePersonDto = { nome: 'Joana' };
      const existingPerson = { id: personId, nome: 'Joana' };

      jest
        .spyOn(personRepository, 'preload')
        .mockResolvedValue(existingPerson as any);

      // Act and Assert
      await expect(
        peopleService.update(personId, updatePersonDto, tokenPayload),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw a NotFounderException if user not exists', async () => {
      // Arrange
      const personId = 1;
      const updatePersonDto = { nome: 'Joana' };
      const tokenPayload = { sub: personId } as any;

      // Fake that preload returned null
      jest.spyOn(personRepository, 'preload').mockResolvedValue(null);

      // Act and Assert
      await expect(
        peopleService.update(personId, updatePersonDto, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an authorized person', async () => {
      // Arrange
      const personId = 1;
      const tokenPayload = { sub: personId } as any;
      const existingPerson = { id: personId, nome: 'Joana' };

      // Mock findOneBy to return the existing person
      jest
        .spyOn(personRepository, 'findOneBy')
        .mockResolvedValue(existingPerson as any);

      // Mock remove to return the deleted person
      jest
        .spyOn(personRepository, 'remove')
        .mockResolvedValue(existingPerson as any);

      // Act
      const result = await peopleService.remove(personId, tokenPayload);

      // Assert
      // Ensure findOneBy was called with the correct id
      expect(personRepository.findOneBy).toHaveBeenCalledWith({ id: personId });

      // Ensure peopleService.remove was called with correct arguments
      expect(personRepository.remove).toHaveBeenCalledWith(existingPerson);

      // Ensure the result is the deleted person
      expect(result).toEqual(existingPerson);
    });

    it('should throw NotFoundException if person not exists', async () => {
      // Arrange
      const personId = 1;
      const tokenPayload = { sub: personId } as any;

      // Mock findOneBy to return the existing person
      jest.spyOn(personRepository, 'findOneBy').mockResolvedValue(null);

      // Act and Assert
      await expect(
        peopleService.remove(personId, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      // Arrange
      const personId = 1;
      const tokenPayload = { sub: 2 } as any;
      const existingPerson = { id: personId, nome: 'Joana' };

      // Mock findOneBy to return the existing person
      jest
        .spyOn(personRepository, 'findOneBy')
        .mockResolvedValue(existingPerson as any);

      // Act and Assert
      await expect(
        peopleService.remove(personId, tokenPayload),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('uploadPicture', () => {
    it('should save an imagem correctly and update the person', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.png',
        size: 2000,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const mockPerson = {
        id: 1,
        nome: 'Luiz',
        email: 'luiz@email.com',
      } as Person;

      const tokenPayload = { sub: 1 } as any;

      jest.spyOn(peopleService, 'findOne').mockResolvedValue(mockPerson);
      jest.spyOn(personRepository, 'save').mockResolvedValue({
        ...mockPerson,
        picture: '1.png',
      });

      const filePath = path.resolve(process.cwd(), 'pictures', '1.png');

      // Act
      const result = await peopleService.uploadPicture(mockFile, tokenPayload);

      // Assert
      expect(fs.writeFile).toHaveBeenCalledWith(filePath, mockFile.buffer);

      expect(personRepository.save).toHaveBeenCalledWith({
        ...mockPerson,
        picture: '1.png',
      });

      expect(result).toEqual({
        ...mockPerson,
        picture: '1.png',
      });
    });

    it('should throw a BadRequestException if the file is too small', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.png',
        size: 500, // less than 1024 bytes
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const tokenPayload = { sub: 1 } as any;

      // Act & Assert
      await expect(
        peopleService.uploadPicture(mockFile, tokenPayload),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a NotFoundException if the person was not found', async () => {
      // Arrange
      const mockFile = {
        originalname: 'test.png',
        size: 2000,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const tokenPayload = { sub: 1 } as any;

      jest
        .spyOn(peopleService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(
        peopleService.uploadPicture(mockFile, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });
}); 
