import {
  response,
  param,
  post,
  requestBody,
  getModelSchemaRef,
} from '@loopback/openapi-v3';
import { model, Model, property } from '@loopback/repository';
import { Request } from 'express';
import { authenticate } from '../../decorators/authenticate';
import { requestObject } from '../../decorators/requestObject';
import { User } from '../../models/user.model';
import { SomeError } from '../responseModels';

@model()
class UserWithNumber extends Model {
  @property({ type: User, required: true })
  user!: User;
  @property({ type: 'array', itemType: 'number', required: true })
  numbers!: number[];

  constructor(data: Partial<UserWithNumber>) {
    super(data);
  }
}
export default class {
  @post('/{id}', {
    description: 'Get user by id',
    responses: {},
  })
  @response(200, UserWithNumber)
  @response(413, SomeError)
  @authenticate('jwt')
  // Property name should be unique for every controller as operationId
  async getUser(
    @requestObject() req: Request,
    @param.path.number('id') id: number,
    @requestBody({
      required: false,
      content: {
        'application/json': {
          schema: getModelSchemaRef(User),
        },
      },
    })
    user?: User,
    @param({
      in: 'query',
      schema: { type: 'array', items: { type: 'number' } },
      name: 'param',
      style: 'form',
      explode: true,
      example: '?param=1&param=2&param=3',
    })
    param?: number[]
  ) {
    const u = new User({
      name: 'name',
      address: { street: 'street', house: 0 },
      birthday: new Date().toISOString(),
    });

    // Request object will be injected
    // console.log(req);

    if (Math.random() > 0.5) {
      if (param) {
        return new UserWithNumber({ user: u, numbers: [...param, id] });
      }

      await new Promise((res) => setTimeout(res, 2000));

      return Promise.resolve(new UserWithNumber({ user: u, numbers: [id] }));
    }

    return new SomeError('Oops');
  }
}
