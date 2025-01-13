import { PeopleController } from './people.controller';


describe('PessoasController', () => {
  let controller: PeopleController;
  const peopleServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    uploadPicture: jest.fn(),
  };

  beforeEach(() => {
    controller = new PeopleController(peopleServiceMock as any);
  });

  it('create - should use the PessoasService with the correct argument', async () => {
    const argument = { key: 'value' };
    const expected = { anyKey: 'anyValue' };

    jest.spyOn(peopleServiceMock, 'create').mockResolvedValue(expected);

    const result = await controller.create(argument as any);

    expect(peopleServiceMock.create).toHaveBeenCalledWith(argument);
    expect(result).toEqual(expected);
  });

  it('findAll - should use the PeopleService', async () => {
    const mockRequest: any = { REQUEST_TOKEN_PAYLOAD_KEY: { sub: '1' } };
    const expected = { anyKey: 'anyValue' };

    jest.spyOn(peopleServiceMock, 'findAll').mockResolvedValue(expected);

    const result = await controller.findAll(mockRequest);

    expect(peopleServiceMock.create).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  it('findOne - should use the PeopleService with the correct argument', async () => {
    const argument = '1';
    const expected = { anyKey: 'anyValue' };

    jest.spyOn(peopleServiceMock, 'findOne').mockResolvedValue(expected);

    const result = await controller.findOne(argument as any);

    expect(peopleServiceMock.findOne).toHaveBeenCalledWith(+argument);
    expect(result).toEqual(expected);
  });

  it('update - should use the PeopleService with the correct arguments', async () => {
    const argument1 = '1';
    const argument2 = { key: 'value' };
    const argument3 = { key: 'value' };
    const expected = { anyKey: 'anyValue' };

    jest.spyOn(peopleServiceMock, 'update').mockResolvedValue(expected);

    const result = await controller.update(
      argument1,
      argument2 as any,
      argument3 as any,
    );

    expect(peopleServiceMock.update).toHaveBeenCalledWith(
      +argument1,
      argument2,
      argument3,
    );
    expect(result).toEqual(expected);
  });

  it('remove - should use the PeopleService with the correct arguments', async () => {
    const argument1 = 1;
    const argument2 = { aKey: 'aValue' };
    const expected = { anyKey: 'anyValue' };

    jest.spyOn(peopleServiceMock, 'remove').mockResolvedValue(expected);

    const result = await controller.remove(argument1 as any, argument2 as any);

    expect(peopleServiceMock.remove).toHaveBeenCalledWith(
      +argument1,
      argument2,
    );
    expect(result).toEqual(expected);
  });

  it('updatePicture - should use the PeopleService with the correct arguments', async () => {
    const argument1 = { aKey: 'aValue' };
    const argument2 = { bKey: 'bValue' };
    const expected = { anyKey: 'anyValue' };

    jest.spyOn(peopleServiceMock, 'uploadPicture').mockResolvedValue(expected);

    const result = await controller.updatePicture(
      argument1 as any,
      argument2 as any,
    );

    expect(peopleServiceMock.uploadPicture).toHaveBeenCalledWith(
      argument1,
      argument2,
    );
    expect(result).toEqual(expected);
  });
});
