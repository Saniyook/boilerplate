import {
  get,
  response,
  param,
  post,
  requestBody,
  getModelSchemaRef,
} from '@loopback/openapi-v3';
import { Entity, model, Model, property } from '@loopback/repository';
import { SomeError, SuccessModel } from '../responseModels';

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

export default class GetUserController {
  @post('/login/{id}')
  @response(200, SuccessModel)
  @response(413, SomeError)
  getUser(
    @param({
      in: 'query',
      schema: { type: 'array', items: { type: 'number', minItems: 1 } },
      name: 'param',
      allowReserved: true,
      required: false,
    })
    param: number,
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
    if (Math.random() > 0.5) return new SuccessModel([1, 2, 3, param, id]);

    return new SomeError('Oops');
  }
}
