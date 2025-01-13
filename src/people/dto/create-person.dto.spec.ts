import { validate } from 'class-validator';
import { CreatePersonDto } from './create-person.dto';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';

describe('CreatePersonDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = new CreatePersonDto();
    dto.email = 'teste@example.com';
    dto.password = 'senha123';
    dto.nome = 'Luiz Otávio';
    dto.routePolicies = [RoutePolicies.createPessoa];

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // No errors mean the DTO is valid
  });

  it('should fail if the email is invalid', async () => {
    const dto = new CreatePersonDto();
    dto.email = 'invalid-email';
    dto.password = 'senha123';
    dto.nome = 'Luiz Otávio';
    dto.routePolicies = [RoutePolicies.createPessoa];

    const errors = await validate(dto);
   
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail if the password is too short', async () => {
    const dto = new CreatePersonDto();
    dto.email = 'teste@example.com';
    dto.password = '123';
    dto.nome = 'Luiz Otávio';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail if the name is empty', async () => {
    const dto = new CreatePersonDto();
    dto.email = 'teste@example.com';
    dto.password = 'senha123';
    dto.nome = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('nome');
  });

  it('should fail if the name is too long', async () => {
    const dto = new CreatePersonDto();
    dto.email = 'teste@example.com';
    dto.password = 'senha123';
    dto.nome = 'a'.repeat(101);

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('nome');
  });

  it('should fail if the routesPolicies is invalid', async () => {
    const dto = new CreatePersonDto();
    dto.email = 'teste@example.comr';
    dto.password = 'senha123';
    dto.nome = 'Luiz Otávio';
    dto.routePolicies = ['invalid-type'] as any;

    const errors = await validate(dto);
   
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('routePolicies');
  });
});
