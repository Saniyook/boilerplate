import { model, Model, property } from '@loopback/repository';
import { Address } from './address.model';

@model()
export class User extends Model {
  @property({ type: 'string', required: true })
  name!: string;

  @property({ type: Address, required: true })
  address!: Partial<Address>;

  @property({ type: Date, required: true })
  birthday!: Date;

  constructor(data: Partial<User>) {
    super(data);
  }
}
