import { model, Model, property } from '@loopback/repository';

@model()
export class Address extends Model {
  @property({ type: 'string' })
  street!: string;

  @property({ type: 'number' })
  house!: number;

  constructor(data: Partial<Address>) {
    super(data);
  }
}
