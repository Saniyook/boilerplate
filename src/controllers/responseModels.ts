import { Model, model, property } from '@loopback/repository';

@model()
export class SomeError extends Model {
  constructor(message: string) {
    super();
    this.message = message;
  }

  @property({ type: 'string' })
  message: string;
}
