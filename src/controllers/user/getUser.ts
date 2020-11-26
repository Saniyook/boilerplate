import {
  get,
  response,
  param,
  post,
  requestBody,
  getModelSchemaRef,
} from '@loopback/openapi-v3';
import { model, Model, property } from '@loopback/repository';
import { SomeError } from '../responseModels';

@model()
class Address {
  @property({ type: 'string' })
  street!: string;

  @property({ type: 'number' })
  house!: number;
}

@model()
class User {
  @property({ type: 'string' })
  name!: string;

  @property({ type: Address })
  address!: Address;
}

@model()
class UserWithNumber extends Model {
  @property({ type: User })
  user!: User;

  @property({ type: 'array', itemType: 'number' })
  numbers!: number[];

  constructor(data: Partial<UserWithNumber>) {
    super(data);
  }
}

export default class GetUserController {
  @post('/login/{id}')
  @response(200, UserWithNumber)
  @response(413, SomeError)
  getUser(
    @param({
      in: 'query',
      schema: { type: 'array', items: { type: 'number' } },
      name: 'param',
      allowReserved: true,
      required: false,
      style: 'form',
      explode: true,
      example: '?param=1&param=2&param=3',
    })
    param: number[],
    @param.path.number('id') id: number,
    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: getModelSchemaRef(User),
        },
      },
    })
    user: User
  ) {
    return new UserWithNumber({ user: user, numbers: [...param, id] });

    return new SomeError('Oops');
  }
}
