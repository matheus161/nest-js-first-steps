import { Repository } from 'typeorm';
import { PeopleService } from './people.service';
import { Person } from './entities/person.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

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
          useValue: {},
        },
        {
          provide: HashingService,
          useValue: {},
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
});
